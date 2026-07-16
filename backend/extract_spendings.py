# import google.generativeai as genai
# from sentence_transformers import SentenceTransformer
# from supabase import create_client, Client

# # ==========================================
# # 1. SETUP & CONFIGURATION
# # ==========================================
# SUPABASE_URL = "https://yrwbupunkzlmnuksnmrh.supabase.co"
# SUPABASE_KEY = "SUPABASE_SECRET_KEY_REMOVED" 
# GEMINI_API_KEY = "GEMINI_API_KEY_REMOVED"

# supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
# genai.configure(api_key=GEMINI_API_KEY)

# # Use flash-latest for speed and to stay within free tier limits
# llm = genai.GenerativeModel('gemini-flash-latest') 

# print("Loading embedding model...")
# embedder = SentenceTransformer('all-MiniLM-L6-v2')

# # ==========================================
# # 2. DATA EXTRACTION FUNCTION
# # ==========================================
# def extract_sector_spending(sector: str, query: str, year_filter: str) -> str:
#     print(f"Searching allocations for: {sector}...")
    
#     query_vector = embedder.encode(query).tolist()
    
#     response = supabase.rpc(
#         "hybrid_search_budget",
#         {
#             "query_text": query,             
#             "query_embedding": query_vector,          
#             "match_count": 10, # 10 is enough for highly specific sector queries      
#             "filter_year": year_filter        
#         }
#     ).execute()
    
#     results = response.data
    
#     if not results:
#         return "Not specified in retrieved text."

#     context_blocks = [match['content'] for match in results]
#     full_context = "\n---\n".join(context_blocks)
    
#     # We change the prompt to act strictly as a data extractor
#     prompt = f"""You are a financial data extraction bot.
#     Look at the Mauritian Budget context below and find the total spending/allocation amount for: {sector}.
    
#     Context:
#     {full_context}
    
#     Question: {query}
    
#     Reply ONLY with the extracted total amount and a very brief summary (Max 2 sentences). 
#     If the total allocated amount is not found in the context, reply exactly with: "Not specified."
#     Do not make up facts.
#     """
    
#     llm_response = llm.generate_content(prompt)
#     return llm_response.text.strip()

# # ==========================================
# # 3. BUILD THE RECORD AND UPLOAD
# # ==========================================
# if __name__ == "__main__":
#     target_year = "2025-2026"
    
#     # Define the exact questions needed to find the data for each column
#     extraction_queries = {
#         "total_revenue": "What is the total estimated budget revenue or total government revenue?",
#         "total_expenditure": "What is the total estimated budget expenditure or total government spending?",
#         "social_security": "What is the total budget allocated to social security, pensions, and welfare?",
#         "education": "What is the total budget allocated to the education sector, schools, and higher learning?",
#         "health": "What is the total budget allocated to health, medical services, and hospitals?",
#         "infrastructure": "What is the total budget allocated to public infrastructure, roads, and drains?",
#         "public_order": "What is the total budget allocated to public order, police, security, and defense?",
#         "ict": "What is the total budget allocated to ICT, digitisation, and artificial intelligence?",
#         "tourism": "What is the total budget allocated to the tourism sector and MTPA?",
#         "others": "What is the total budget allocated to sports, arts, and culture?"
#     }

#     # Initialize the dictionary that will become our database row
#     db_record = {
#         "financial_year": target_year
#     }

#     print(f"\nStarting data extraction for Financial Year {target_year}\n" + "="*50)

#     # Loop through our dictionary and extract the data one by one
#     for column_name, query in extraction_queries.items():
#         result = extract_sector_spending(sector=column_name.replace("_", " ").title(), query=query, year_filter=target_year)
#         db_record[column_name] = result
#         print(f"Result for {column_name}: {result}\n")

#     print("="*50)
#     print("Uploading compiled record to Supabase...")
    
#     # Use upsert so if you run it again, it updates the row instead of throwing an error
#     supabase.table("public_spendings").upsert(db_record).execute()
    
#     print("✅ Extraction complete and saved to the database!")





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

# 2. NEW CLIENT INITIALIZATION
client = genai.Client(api_key=GEMINI_API_KEY)

print("Loading embedding model...")
embedder = SentenceTransformer('all-MiniLM-L6-v2')

# ==========================================
# 2. DATA EXTRACTION FUNCTION
# ==========================================
def extract_sector_spending(sector: str, query: str, year_filter: str) -> str:
    print(f"Searching allocations for: {sector}...")
    
    query_vector = embedder.encode(query).tolist()
    
    response = supabase.rpc(
        "hybrid_search_budget",
        {
            "query_text": query,             
            "query_embedding": query_vector,          
            "match_count": 10,       
            "filter_year": year_filter        
        }
    ).execute()
    
    results = response.data
    
    if not results:
        return "Not specified in retrieved text."

    context_blocks = [match['content'] for match in results]
    full_context = "\n---\n".join(context_blocks)
    
    prompt = f"""You are a financial data extraction bot.
    Look at the Mauritian Budget context below and find the total spending/allocation amount for: {sector}.
    
    Context:
    {full_context}
    
    Question: {query}
    
    Reply ONLY with the extracted total amount only without rupees.If the amount is in words,convert it to full integer, including all the zeroes. 
    If the total allocated amount is not found in the context, reply exactly with: "-1"
    Do not make up facts.
    """
    
    # 3. NEW GENERATION SYNTAX
    llm_response = client.models.generate_content(
        # model='gemini-3.5-flash',
        model='gemini-3.1-flash-lite',
        contents=prompt
    )
    
    return llm_response.text.strip()

# ==========================================
# 3. BUILD THE RECORD AND UPLOAD
# ==========================================
if __name__ == "__main__":
    target_year = "2025-2026"
    
    extraction_queries = {
        "total_revenue": "What is the total estimated budget revenue or total government revenue?",
        "total_expenditure": "What is the total estimated budget expenditure or total government spending?",
        "social_security": "What is the total budget allocated to social security, pensions, and welfare?",
        "education": "What is the total budget allocated to the education sector, schools, and higher learning?",
        "health": "What is the total budget allocated to health, medical services, and hospitals?",
        "infrastructure": "What is the total budget allocated to public infrastructure, roads, and drains?",
        "public_order": "What is the total budget allocated to public order, police, security, and defense?",
        "ict": "What is the total budget allocated to ICT, digitisation, and artificial intelligence?",
        "tourism": "What is the total budget allocated to the tourism sector and MTPA?",
        "others": "What is the total budget allocated to sports, arts, and culture?"
    }

    db_record = {
        "financial_year": target_year
    }

    print(f"\nStarting data extraction for Financial Year {target_year}\n" + "="*50)

    for column_name, query in extraction_queries.items():
        result = extract_sector_spending(sector=column_name.replace("_", " ").title(), query=query, year_filter=target_year)
        db_record[column_name] = result
        print(f"Result for {column_name}: {result}\n")
        
        # RATE LIMIT SAVER: Pause for 4 seconds before asking the next question
        time.sleep(4)

    print("="*50)
    print("Uploading compiled record to Supabase...")
    
    supabase.table("public_spendings").upsert(
    db_record, 
    on_conflict="financial_year"
).execute()
    
    print("✅ Extraction complete and saved to the database!")