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
3. (Optional) Install and run Ollama, then pull llama3 model:
   - Install Ollama: https://ollama.com/download
   - `ollama pull llama3`
   - `ollama serve`
4. Run backend:
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

## Notes
- The `backend/utils/ai_utils.py` is configured to call Ollama's local API at http://localhost:11434.
- If you prefer GPT4All instead, replace the generate call per the README notes.
- The streaming chat UI uses a simple fetch-based event stream from the backend `/ask_stream` endpoint.
