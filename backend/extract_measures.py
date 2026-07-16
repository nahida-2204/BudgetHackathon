import os
from dotenv import load_dotenv
from google import genai
from sentence_transformers import SentenceTransformer
from supabase import create_client, Client
import time

load_dotenv()

# ==========================================
# 1. SETUP & CONFIGURATION
# ==========================================
SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_KEY"]
GEMINI_API_KEY = os.environ["GEMINI_API_KEY"]

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
client = genai.Client(api_key=GEMINI_API_KEY)

print("Loading embedding model...")
embedder = SentenceTransformer('all-MiniLM-L6-v2')

# ==========================================
# 2. SECTOR MEASURES EXTRACTION FUNCTION
# ==========================================
def extract_sector_measures(sector_name: str, search_query: str, year_filter: str) -> str:
    print(f"Sweeping document for: {sector_name}...")
    
    query_vector = embedder.encode(search_query).tolist()
    
    # We use 15 chunks to cast a wide net (high recall) for this specific sector
    response = supabase.rpc(
        "hybrid_search_budget",
        {
            "query_text": search_query,             
            "query_embedding": query_vector,          
            "match_count": 15,       
            "filter_year": year_filter        
        }
    ).execute()
    
    results = response.data
    
    if not results:
        return "No specific measures found in the retrieved text."

    context_blocks = [match['content'] for match in results]
    full_context = "\n---\n".join(context_blocks)
    
    prompt = f"""You are an expert policy analyst.
    Look at the Mauritian Budget context below and extract the key government measures, policies, and initiatives specifically related to: {sector_name}.
    
    Context:
    {full_context}
    
    Instructions:
    - Return the actual measures in the following json format:
        {
        "sectors": [
            {
            "sector": "sectorName",
            "measures": [
                {
                "title": "title",
                "description": "description."
                }
            ]
            },
            {
            "sector": "sectorName",
            "measures": [
                {
                "title": "title",
                "description": "description"
                }
            ]
            }
        ]
        }
    - Do not use the names of the sectors in the example above, replaceit with the actual sector of each individual prompt.
    - Be concise but specific (include mentioned budgets, timelines, or targets if present).
    - If a point is just political rhetoric without a concrete measure, skip it.
    - If there are no concrete measures for this sector in the context, reply exactly with empty json.
    - Do not invent or assume information.
    """
    
    # Using Flash-Lite to avoid the 20 requests/day hard limit on Free Tier
    llm_response = client.models.generate_content(
        model='gemini-3.1-flash-lite',
        contents=prompt
    )
    
    return llm_response.text.strip()

# ==========================================
# 3. RUN THE SWEEP AND UPLOAD
# ==========================================
if __name__ == "__main__":
    target_year = "2025-2026"
    
    # By breaking the search into these sectors, we force the Vector DB to give us
    # high recall across the ENTIRE document, rather than just one section.
    sector_queries = {
        "Technology & AI": "What are the new projects, policies, or investments in Artificial Intelligence, IT, and Digitisation?",
        "Agriculture & Food": "What are the initiatives, grants, or policies for farmers, agriculture, and food security?",
        "Healthcare": "What are the infrastructure upgrades, new hospitals, or health policies being implemented?",
        "Education": "What are the new measures for schools, teachers, students, and tertiary education?",
        "Infrastructure": "What are the major public infrastructure, road construction, and transport projects?",
        "Social Support": "What are the changes to pensions, welfare, minimum wage, and support for vulnerable families?",
        "SME & Business": "What are the tax incentives, loans, and support schemes for Small and Medium Enterprises and businesses?",
        "Environment & Energy": "What are the green energy, solar, climate change, and sustainability measures?"
    }

    print(f"\nStarting Sector Sweep for Financial Year {target_year}\n" + "="*50)

    for sector, query in sector_queries.items():
        # Extract the bulleted list of measures
        measures_text = extract_sector_measures(sector_name=sector, search_query=query, year_filter=target_year)
        
        print(f"\nExtracted measures for {sector}:")
        print(measures_text[:150] + "...\n") # Print a snippet to console
        
        # Upload directly to the new database table
        record = {
            "financial_year": target_year,
            "sector": sector,
            "measures_list": measures_text
        }
        
        supabase.table("budget_key_measures").upsert(
            record, 
            on_conflict="financial_year, sector" # Upsert requires a composite unique key check
        ).execute()
        
        # Pause to respect Rate Limits
        time.sleep(4)

    print("="*50)
    print("✅ Sector Sweep complete! Key measures safely stored in the database.")