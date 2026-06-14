from sqlalchemy import Column, Integer, String,  ForeignKey, DateTime
from db.database import Base
from datetime import datetime

class Chat(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    role = Column(String)  # "user" or "ai"
    message = Column(String)

    created_at = Column(DateTime, default=datetime.utcnow)