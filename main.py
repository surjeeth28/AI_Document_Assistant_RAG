from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from pypdf import PdfReader
from services.llm_service import get_ai_response
from services.rag_service import split_text, create_embeddings, store_embeddings, retrieve
from sqlalchemy.orm import Session
from db.database import SessionLocal
from models.user import User, UserCreate, UserLogin
from models.chat import Chat
from auth import hash_password, verify_password, create_access_token
from deps import get_current_user

from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from db.database import engine, Base
Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_or_create_user(db):
    user = db.query(User).filter(User.email == "test@gmail.com").first()

    if not user:
        user = User(email="test@gmail.com", password="1234")
        db.add(user)
        db.commit()
        db.refresh(user)

    return user


@app.get("/chat")
def chat(query: str, db: Session = Depends(get_db), user=Depends(get_current_user)):
    db_user = db.query(User).filter(User.email == user["sub"]).first()

    # ✅ Save user message
    user_msg = Chat(
        user_id=db_user.id,
        role="user",
        message=query
    )
    db.add(user_msg)

    context = retrieve(query)

    prompt = f"""
    Answer based only on the context below:

    {context}

    Question: {query}
    """
    answer = get_ai_response(prompt)
    
    # user = get_or_create_user(db)
    user = db.query(User).filter(User.email == user["sub"]).first()

    new_chat = Chat(
        user_id=user.id,  # temporary
        role="ai",
        message=answer

    )

    db.add(new_chat)
    db.commit()

    return {"response": answer}

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    reader = PdfReader(file.file)
    text = ""

    for page in reader.pages:
        text += page.extract_text()

    chunks = split_text(text)
    embeddings = create_embeddings(chunks)

    store_embeddings(embeddings, chunks)

    return {"message": "Document indexed"}
    # return {"chunks": len(chunks), "embeddings": len(embeddings)}



# ✅ Signup
@app.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):

    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    
    if not user.email or not user.password:
        raise HTTPException(status_code=400, detail="Email and password required")

    user = User(
        email=user.email,
        password=hash_password(user.password)
    )
    db.add(user)
    db.commit()

    return {"message": "User created"}

# ✅ Login
@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    
    if not user.email or not user.password:
        raise HTTPException(status_code=400, detail="Email and password required")
    # ✅ Get user from DB
    db_user = db.query(User).filter(User.email == user.email).first()

    # ✅ Check user exists
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # ✅ Check password
    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # ✅ Create token
    token = create_access_token({"sub": db_user.email})

    return {"access_token": token}


@app.get("/history")
def get_history(db: Session = Depends(get_db), user=Depends(get_current_user)):

    db_user = db.query(User).filter(User.email == user["sub"]).first()

    chats = db.query(Chat).filter(Chat.user_id == db_user.id).order_by(Chat.created_at).all()

    return [
        {
            "role": chat.role,
            "message": chat.message
        }
        for chat in chats
    ]