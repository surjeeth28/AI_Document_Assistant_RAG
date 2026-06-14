from langchain_text_splitters import CharacterTextSplitter
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np


model = SentenceTransformer("all-MiniLM-L6-v2")

vector_db = None
stored_chunks = []

# user_data = {
#     user_id: {
#         "vector_db": ...,
#         "chunks": ...
#     }
# }

def split_text(text):
    splitter = CharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )
    return splitter.split_text(text)


def create_embeddings(chunks):
    return [model.encode(chunk) for chunk in chunks]


def store_embeddings(embeddings, chunks):
    global vector_db, stored_chunks

    dim = len(embeddings[0])
    vector_db = faiss.IndexFlatL2(dim)

    vector_db.add(np.array(embeddings))
    stored_chunks = chunks


def retrieve(query):
    global vector_db, stored_chunks

    if vector_db is None:
        return "No document uploaded yet."
        
    query_vector = model.encode(query)
    distances, indices = vector_db.search(
        np.array([query_vector]), k=3
    )

    results = [stored_chunks[i] for i in indices[0]]
    return "\n".join(results)