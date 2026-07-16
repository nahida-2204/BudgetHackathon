import os
import re
from dotenv import load_dotenv
from pypdf import PdfReader
from sentence_transformers import SentenceTransformer
from supabase import create_client, Client

load_dotenv()

# Setup Clients
SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_PUBLISHABLE_KEY"]
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

print("Loading local embedding model...")
model = SentenceTransformer('all-MiniLM-L6-v2')

def ingest_by_clean_paragraphs(file_path: str, financial_year: str, document_type: str):
    print(f"Reading {file_path}...")
    reader = PdfReader(file_path)
    
    # 1. Extract the entire text of the document into one clean string
    full_text = ""
    for page in reader.pages:
        full_text += page.extract_text() + "\n"
    
    # 2. Split the document cleanly using the paragraph numbers (e.g., "\n1. ", "\n45. ")
    # This lookahead splits the text right before a number followed by a dot and a space
    raw_paragraphs = re.split(r'\n(?=\d+\.\s+)', full_text)
    
    rows_to_insert = []
    current_theme = "Introduction"
    
    # Regex to capture the theme headers embedded in the text (e.g., "A. ECONOMIC RENEWAL" or "Pillar 1")
    theme_pattern = re.compile(r'([A-E]\.\s+[A-Z\s]{4,}|Pillar\s+\d+\s+[-–]\s+[A-Za-z\s&]{4,})')

    print(f"Found {len(raw_paragraphs)} raw segments. Processing...")

    for segment in raw_paragraphs:
        segment_clean = segment.strip()
        if not segment_clean:
            continue
            
        # Track if a theme header is inside this text block before the paragraph starts
        theme_match = theme_pattern.search(segment_clean)
        if theme_match:
            current_theme = theme_match.group(1).replace('\n', ' ').strip()
        
        # Check if this segment starts with a paragraph number
        para_match = re.match(r'^(\d+)\.\s+', segment_clean)
        
        if para_match:
            paragraph_number = int(para_match.group(1))
            # Remove the paragraph number prefix from the actual content body
            content_body = re.sub(r'^\d+\.\s+', '', segment_clean)
        else:
            paragraph_number = None
            content_body = segment_clean

        # Clean up double line breaks and messy text noise
        content_body = re.sub(r'\s+', ' ', content_body).strip()
        
        if len(content_body) < 10: 
            continue # Skip empty header remnants
            
        # Generate embedding directly on the clean text content
        # (We skip the heavy metadata prefix to keep the vector focus pure)
        embedding = model.encode(content_body).tolist()
        
        rows_to_insert.append({
            "financial_year": financial_year,
            "document_type": document_type,
            "theme": current_theme,
            "section_title": None,
            "paragraph_number": paragraph_number,
            "page_number": None, # Paragraph index is now our absolute tracking anchor
            "content": content_body,
            "embedding": embedding
        })

    # 3. Batch Upload to Supabase
    if rows_to_insert:
        print(f"Uploading {len(rows_to_insert)} pure paragraphs to Supabase...")
        batch_size = 50
        for i in range(0, len(rows_to_insert), batch_size):
            batch = rows_to_insert[i:i + batch_size]
            supabase.table("budget_documents").insert(batch).execute()
        print("Ingestion complete! Database successfully structuralized.")
    else:
        print("Parsing failed to find structural paragraphs.")

if __name__ == "__main__":
    # Test with the 2025-2026 Speech file
    ingest_by_clean_paragraphs(
        file_path="./pdf/MCCI2026.pdf",
        financial_year="2026-2027",
        document_type="MCCI Highlights"
    )