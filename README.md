
An AI-powered chatbot that answers questions from uploaded PDF documents using 
Retrieval-Augmented Generation (RAG).

## Features
- Upload PDF documents and ask questions in natural language
- Semantic search using FAISS vector database
- Fast LLM responses powered by Groq API and streaming like ChatGPT
- JWT-based login and signup for secure access
- Clean React.js chat interface

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React.js, CSS |
| Backend | FastAPI, Python |
| LLM | Groq API (llama-3.1-8b-instant), LangChain |
| Vector DB | FAISS |
| Deployment | Docker, Hugging Face Spaces, Vercel |
| Database | PostgreSQL (Supabase) |
| Auth | JWT |

## Getting Started

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables
Create a `.env` file in `/backend`:
```
GROQ_API_KEY=your_groq_api_key
DATABASE_URL=your_database_url
```
