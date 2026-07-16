import os
import requests
from bs4 import BeautifulSoup
from datetime import datetime

def download_mauritius_budget():
    # 1. Calculate the current and next year to construct the URL
    current_year = datetime.now().year
    next_year = current_year + 1
    
    # URL pattern observed from the National Assembly website
    budget_page_url = f"https://mauritiusassembly.govmu.org/mauritiusassembly/index.php/budget-{current_year}-{next_year}/"
    
    print(f"Checking for budget at: {budget_page_url}")
    
    # Use headers to mimic a browser request
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    try:
        # 2. Access the budget page
        response = requests.get(budget_page_url, headers=headers)
        response.raise_for_status()
        
        # 3. Parse the HTML content
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 4. Find the link to the actual Budget Speech document
        budget_link = None
        for a_tag in soup.find_all('a', href=True):
            if "Budget Speech" in a_tag.text:
                budget_link = a_tag['href']
                break
        
        if not budget_link:
            print("Could not find the 'Budget Speech' link on the page. The page structure might have changed or it hasn't been uploaded yet.")
            return

        # Ensure the extracted link is a full absolute URL
        if not budget_link.startswith("http"):
            budget_link = "https://mauritiusassembly.govmu.org" + budget_link

        print(f"Found Budget Speech link: {budget_link}")
        print("Downloading...")
        
        # 5. Download the PDF
        pdf_response = requests.get(budget_link, headers=headers)
        pdf_response.raise_for_status()
        
        # 6. Create a specific folder named 'PDFS' if it doesn't exist
        output_folder = os.path.join(os.getcwd(), "backend", "docs", "pdfs")
        if not os.path.exists(output_folder):
            os.makedirs(output_folder)
        
        filename = f"Mauritius_Budget_Speech_{current_year}_{next_year}.pdf"
        download_path = os.path.join(output_folder, filename)
        
        with open(download_path, 'wb') as file:
            file.write(pdf_response.content)
            
        print(f"Success! Budget saved to: {download_path}")
        
    except requests.exceptions.HTTPError as e:
        print(f"HTTP Error: The page for {current_year}-{next_year} might not exist yet. ({e})")
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    download_mauritius_budget()