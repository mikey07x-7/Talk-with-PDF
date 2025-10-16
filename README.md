# Talk-with-PDF (Starter)

## Overview
A starter project that lets users upload a PDF, embeds its text using sentence-transformers,
stores embeddings in FAISS, and lets users ask questions. Uses Ollama (llama3) or GPT4All for local LLM responses.

This package includes a simple React frontend and a FastAPI backend with a streaming-friendly endpoint.

## Run (backend)
1. Create virtualenv and activate:
   ```bash
   python -m venv venv
   source venv/bin/activate  # macOS/Linux
   venv\Scripts\activate   # Windows PowerShell
   ```
2. Install requirements:
   ```bash
   pip install -r backend/requirements.txt
   ```
3. Run backend:
   ```bash
   cd backend
   uvicorn main:app --reload --port 8000
   ```

## Run (frontend)
1. From `frontend/` run:
   ```bash
   npm install
   npm start
   ```

