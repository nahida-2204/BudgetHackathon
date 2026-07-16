import os
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
from supabase import create_client, Client

load_dotenv()

# 1. Setup Supabase Configuration
SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_KEY"]

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# 2. Load the same local embedding model
print("Loading local embedding model...")
model = SentenceTransformer("all-MiniLM-L6-v2")


def query_budget(search_text: str, year_filter: str = None):
    print(f"\nSearching for: '{search_text}'...")

    # 3. Generate the vector embedding for the query string locally
    query_vector = model.encode(search_text).tolist()

    # 4. Invoke the Supabase Hybrid Search RPC function
    response = supabase.rpc(
        "hybrid_search_budget",
        {
            "query_text": search_text,  # Feeds the Full-Text Search
            "query_embedding": query_vector,  # Feeds the Semantic Vector Search
            "match_count": 15,  # Return the top 3 closest matches
            "filter_year": year_filter,  # Optional string filter (e.g., "2026-2027")
        },
    ).execute()

    # 5. Display the results nicely
    results = response.data

    if not results:
        print("No matching results found.")
        return

    print(f"\nFound {len(results)} matches:")
    print("=" * 80)
    for idx, match in enumerate(results, start=1):
        print(f"Match #{idx} | Score: {match['combined_score']:.4f}")
        print(
            f"Financial Year: {match['financial_year']} | Document: {match['document_type']}"
        )

        theme_str = match["theme"] if match["theme"] else "N/A"
        para_str = (
            match["paragraph_number"] if match["paragraph_number"] else "Intro/Unknown"
        )
        print(
            f"Theme/Pillar: {theme_str} | Paragraph: {para_str} | Page: {match['page_number']}"
        )
        print("-" * 80)
        print(match["content"].strip())
        print("=" * 80)


if __name__ == "__main__":
    # Test Question based on common Mauritius Budget themes (e.g., AI, inflation, or growth)
    # You can change this text to test different queries!
    user_question = "outline policies for our construction industry."

    # Run the query
    query_budget(search_text=user_question, year_filter="2026-2027")
