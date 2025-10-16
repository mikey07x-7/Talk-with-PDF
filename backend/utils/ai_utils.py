import os
import json
import faiss
import requests
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer

# ✅ Load environment variables from .env file
load_dotenv()

# ✅ Initialize embedding model and FAISS index
model = SentenceTransformer('all-MiniLM-L6-v2')
dimension = 384
index = faiss.IndexFlatL2(dimension)
stored_chunks = []

def chunk_text(text, size=500, overlap=100):
    """Split text into overlapping chunks for better embedding search."""
    chunks = []
    i = 0
    while i < len(text):
        chunk = text[i:i + size]
        chunks.append(chunk)
        i += size - overlap
    return chunks

def create_embeddings(text):
    """Create embeddings for document text and add to FAISS index."""
    global stored_chunks
    chunks = chunk_text(text)
    embeddings = model.encode(chunks)
    index.add(embeddings)
    stored_chunks.extend(chunks)

def retrieve_answer(query):
    if not stored_chunks:
        return "⚠️ Please upload and analyze a PDF first."

    q_emb = model.encode([query])
    D, I = index.search(q_emb, k=3)
    context = " ".join([stored_chunks[i] for i in I[0]])

    prompt = f"""
You are an assistant that answers only from the given PDF context.
Context:
{context}

Question:
{query}

Answer clearly and concisely based on the PDF only.
"""

    try:
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {os.environ.get('GROQ_API_KEY')}"
        }

        payload = {
            "model": "llama-3.1-8b-instant",  # ✅ valid Groq model name
            "messages": [
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 4096
        }

        resp = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=60
        )

        data = resp.json()

        # 🧠 Debug if something went wrong
        if "choices" not in data:
            print("❌ Groq error response:", json.dumps(data, indent=2))
            if "error" in data:
                return f"⚠️ Groq API Error: {data['error'].get('message', 'Unknown error')}"
            return "⚠️ Unexpected response from Groq API."

        return data["choices"][0]["message"]["content"].strip()

    except Exception as e:
        return f"⚠️ Error calling Groq API: {e}"
