import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai as google_genai
from sentence_transformers import SentenceTransformer
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_KEY"]
GEMINI_API_KEY = os.environ["GEMINI_API_KEY"]

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
gemini_client = google_genai.Client(api_key=GEMINI_API_KEY)

print("Loading embedding model...")
embedder = SentenceTransformer('all-MiniLM-L6-v2')

app = FastAPI(
    title="Mauritian Budget Spendings API",
    description="API to fetch public spending extraction data",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    question: str
    year: str | None = None


@app.get("/")
def read_root():
    return {"message": "Mauritian Budget API is online!"}


@app.get("/api/spendings")
def get_all_spendings():
    try:
        response = supabase.table("public_spendings").select("*").execute()
        if response.data is None:
            raise HTTPException(status_code=404, detail="No data found in public_spendings table.")
        return {"status": "success", "count": len(response.data), "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve data from database: {str(e)}")


@app.get("/api/measures")
def get_all_measures():
    try:
        response = supabase.table("budget_key_measures").select("*").execute()
        if response.data is None:
            raise HTTPException(status_code=404, detail="No measures found in budget_key_measures table.")
        return {"status": "success", "count": len(response.data), "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve measures: {str(e)}")


@app.post("/api/chat")
def chat(req: ChatRequest):
    try:
        query_vector = embedder.encode(req.question).tolist()

        results = supabase.rpc(
            "hybrid_search_budget",
            {
                "query_text": req.question,
                "query_embedding": query_vector,
                "match_count": 30,
                "filter_year": req.year
            }
        ).execute().data

        if not results:
            return {"status": "success", "answer": "I couldn't find relevant information in the budget documents."}

        context = "\n\n---\n\n".join(
            f"[Source: {m['financial_year']} Budget | Section: {m.get('theme', 'General')} | Paragraph: {m.get('paragraph_number', 'N/A')}]\n{m['content']}"
            for m in results
        )

        prompt = f"""You are a plain-language assistant for the Mauritian National Budget, helping ordinary citizens understand government spending.
    Answer the user's question using ONLY the context provided below.

    Instructions:
    - Write in clear, conversational prose. No bullet points, no markdown, no asterisks, no bold text.
    - Keep it concise — 3 to 5 sentences maximum.
    - Include specific figures (amounts, years) when they appear in the context.
    - If the answer is not in the context, say so plainly. Do NOT make up facts.

    ====================
    CONTEXT FROM BUDGET DOCUMENTS:
    {context}
    ====================

    USER QUESTION:
    {req.question}
    """

        response = gemini_client.models.generate_content(
            model='gemini-3.1-flash-lite',
            contents=prompt
        )

        return {"status": "success", "answer": response.text.strip()}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")
