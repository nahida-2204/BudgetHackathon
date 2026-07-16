# import google.generativeai as genai
# from sentence_transformers import SentenceTransformer
# from supabase import create_client, Client

# # ==========================================
# # 1. SETUP & CONFIGURATION
# # ==========================================
# SUPABASE_URL = "https://yrwbupunkzlmnuksnmrh.supabase.co"
# SUPABASE_KEY = "SUPABASE_SECRET_KEY_REMOVED" 
# GEMINI_API_KEY = "GEMINI_API_KEY_REMOVED" # Paste your new key here

# # Initialize Supabase
# supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# # Initialize Gemini
# genai.configure(api_key=GEMINI_API_KEY)
# # We use gemini-1.5-flash as it is lightning fast and great for processing text context
# llm = genai.GenerativeModel('gemini-flash-latest') 

# # Initialize Local Embedding Model
# print("Loading models...")
# embedder = SentenceTransformer('all-MiniLM-L6-v2')

# # ==========================================
# # 2. THE RAG FUNCTION
# # ==========================================
# def ask_budget_assistant(question: str, keywords: str, year_filter: str = None):
#     print(f"\nThinking... Searching the budget for: '{keywords}'")
    
#     # --- RETRIEVAL PHASE ---
#     # 1. Convert the question into a vector
#     query_vector = embedder.encode(question).tolist()
    
#     # 2. Fetch the best matching chunks from Supabase
#     response = supabase.rpc(
#         "hybrid_search_budget",
#         {
#             "query_text": keywords,             
#             "query_embedding": query_vector,          
#             "match_count": 8, # 8 overlapping windows gives the AI plenty of context        
#             "filter_year": year_filter        
#         }
#     ).execute()
    
#     results = response.data
    
#     if not results:
#         print("I couldn't find any relevant information in the budget documents.")
#         return

#     # 3. Stitch the retrieved chunks together into one massive text block
#     context_blocks = []
#     for match in results:
#         theme = match['theme'] if match['theme'] else 'General'
#         para = match['paragraph_number'] if match['paragraph_number'] else 'N/A'
        
#         # We wrap each chunk in clear tags so Gemini knows exactly where it came from
#         block = f"[Source: {match['financial_year']} Budget | Section: {theme} | Paragraph: {para}]\n{match['embedded_content']}"
#         context_blocks.append(block)
        
#     full_context = "\n\n---\n\n".join(context_blocks)
    
#     # --- GENERATION PHASE ---
#     # 4. Build the prompt for Gemini, injecting the strict context
#     prompt = f"""You are a highly knowledgeable financial assistant specializing in the Mauritian National Budget.
#     Your goal is to answer the user's question comprehensively and accurately, using ONLY the context provided below.
    
#     Instructions:
#     - Synthesize the information into a clear, easy-to-read response.
#     - Use bullet points where appropriate.
#     - If the context mentions specific budget amounts, years, or paragraph numbers, include them to make your answer authoritative.
#     - If the answer is not contained in the provided context, gracefully state that you do not have that information. Do NOT make up facts.
    
#     ====================
#     CONTEXT FROM BUDGET DOCUMENTS:
#     {full_context}
#     ====================
    
#     USER QUESTION: 
#     {question}
#     """
    
#     print("Synthesizing answer with Gemini...\n")
#     print("=" * 80)
    
#     # 5. Call Gemini to generate the final answer
#     llm_response = llm.generate_content(prompt)
    
#     # Print the final result!
#     print(llm_response.text)
#     print("=" * 80)

# # ==========================================
# # 3. RUN THE APP
# # ==========================================
# if __name__ == "__main__":
#     # Test Question 1
#     q1 = "what are the measures implemented for the retirement pension of the elderly?"
#     k1 = "pension"
    
#     ask_budget_assistant(question=q1, keywords=k1, year_filter="2025-2026")


import os
from dotenv import load_dotenv
import google.generativeai as genai
from sentence_transformers import SentenceTransformer
from supabase import create_client, Client

load_dotenv()

# ==========================================
# 1. SETUP & CONFIGURATION
# ==========================================
SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_KEY"]
GEMINI_API_KEY = os.environ["GEMINI_API_KEY"]

# Initialize Supabase
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Initialize Gemini (Using Pro for high-quality synthesis)
genai.configure(api_key=GEMINI_API_KEY)
llm = genai.GenerativeModel('gemini-flash-latest') 

# Initialize Local Embedding Model
print("Loading models...")
embedder = SentenceTransformer('all-MiniLM-L6-v2')

# ==========================================
# 2. THE RAG FUNCTION
# ==========================================
def ask_budget_assistant(question: str, year_filter: str = None):
    print(f"\nThinking... Searching the budget for: '{question}'")
    
    # --- RETRIEVAL PHASE ---
    # 1. Convert the question into a vector
    query_vector = embedder.encode(question).tolist()
    
    # 2. Fetch the best matching chunks from Supabase
    # We pass the full question to both text and vector search, just like test.py
    response = supabase.rpc(
        "hybrid_search_budget",
        {
            "query_text": question,             
            "query_embedding": query_vector,          
            "match_count": 30, # Pulls 15 paragraphs to ensure full context        
            "filter_year": year_filter        
        }
    ).execute()
    
    results = response.data
    
    if not results:
        print("I couldn't find any relevant information in the budget documents.")
        return

    # 3. Stitch the retrieved chunks together into one massive text block
    context_blocks = []
    for match in results:
        theme = match['theme'] if match['theme'] else 'General'
        para = match['paragraph_number'] if match['paragraph_number'] else 'N/A'
        
        # Pulling strictly from the 'content' column to match your database
        block = f"[Source: {match['financial_year']} Budget | Section: {theme} | Paragraph: {para}]\n{match['content']}"
        context_blocks.append(block)
        
    full_context = "\n\n---\n\n".join(context_blocks)
    
    # --- GENERATION PHASE ---
    # 4. Build the prompt for Gemini, injecting the strict context
    prompt = f"""You are a highly knowledgeable financial assistant specializing in the Mauritian National Budget.
    Your goal is to answer the user's question comprehensively and accurately, using ONLY the context provided below.
    
    Instructions:
    - Synthesize the information into a clear, easy-to-read response.
    - Use bullet points where appropriate.
    - If the context mentions specific budget amounts, years, or paragraph numbers, include them to make your answer authoritative.
    - If the answer is not contained in the provided context, gracefully state that you do not have that information. Do NOT make up facts.
    
    ====================
    CONTEXT FROM BUDGET DOCUMENTS:
    {full_context}
    ====================
    
    USER QUESTION: 
    {question}
    """
    
    print("Synthesizing answer with Gemini...\n")
    print("=" * 80)
    
    # 5. Call Gemini to generate the final answer
    llm_response = llm.generate_content(prompt)
    
    # Print the final result!
    print(llm_response.text)
    print("=" * 80)

# ==========================================
# 3. RUN THE APP
# ==========================================
if __name__ == "__main__":
    # The full question string used for both vector and keyword search
    user_query = "what are the key public spendings in the budget. give the sectors?"
    
    # Run the assistant!
    ask_budget_assistant(question=user_query, year_filter="2025-2026")