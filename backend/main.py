from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from utils.ai_utils import create_embeddings, retrieve_answer
import PyPDF2
import io

app = FastAPI()

# ✅ Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🧠 Data model for /ask
class Question(BaseModel):
    question: str

# 📄 Upload PDF
@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    contents = await file.read()
    pdf_reader = PyPDF2.PdfReader(io.BytesIO(contents))
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text() or ""
    create_embeddings(text)
    return {"message": f"{file.filename} uploaded and analyzed successfully."}

# 💬 Ask question
@app.post("/ask")
async def ask_question(body: Question):
    answer = retrieve_answer(body.question)
    return {"answer": answer}
