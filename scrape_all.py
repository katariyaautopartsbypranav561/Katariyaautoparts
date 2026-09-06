import requests
import json
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE_URL = 'https://partonwheels.com/wp-json/wc/store/products'
PER_PAGE = 100
MAX_WORKERS = 10

def fetch_page(page):
    try:
        response = requests.get(f"{BASE_URL}?per_page={PER_PAGE}&page={page}", timeout=30)
        if response.status_code == 200:
            print(f"Fetched page {page}")
            return response.json()
        else:
            print(f"Failed to fetch page {page}: {response.status_code}")
            return []
    except Exception as e:
        print(f"Error fetching page {page}: {e}")
        return []

def main():
    print("Starting full product scrape from partonwheels.com...")
    # First, get the total number of pages
    try:
        resp = requests.get(f"{BASE_URL}?per_page={PER_PAGE}&page=1", timeout=30)
        total_pages = int(resp.headers.get('x-wp-totalpages', 1))
        total_products = int(resp.headers.get('x-wp-total', 0))
        print(f"Found {total_products} products across {total_pages} pages.")
    except Exception as e:
        print("Failed to get initial metadata:", e)
        return
        
    all_products = []
    
    # We already have page 1 data from the initial request
    if resp.status_code == 200:
        all_products.extend(resp.json())
        print("Fetched page 1")
    
    # Fetch remaining pages concurrently
    pages_to_fetch = list(range(2, total_pages + 1))
    
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {executor.submit(fetch_page, page): page for page in pages_to_fetch}
        for future in as_completed(futures):
            page_data = future.result()
            if page_data:
                all_products.extend(page_data)

    print(f"Successfully scraped {len(all_products)} products.")
    
    # Process products to a clean format for seeding
    clean_products = []
    
    for p in all_products:
        # Determine category (extract from categories array)
        category = 'Accessories'
        brand = 'Katariya Auto Parts'
        
        cats = p.get('categories', [])
        cat_names = [c.get('name', '') for c in cats]
        
        # User defined top-level brands/categories:
        top_level = ["Hero", "Bajaj", "Honda", "TVS", "Yamaha", "Royal Enfield", "KTM", "Suzuki", "Mahindra", "Accessories", "Engine Oil"]
        
        for c in cat_names:
            c_upper = c.upper()
            for t in top_level:
                if t.upper() in c_upper or c_upper in t.upper():
                    category = t.upper()
                    if t.upper() not in ["ACCESSORIES", "ENGINE OIL"]:
                        brand = t.upper()
                    break
        
        # Fallback if no top-level match
        if category == 'Accessories' and cat_names:
            category = cat_names[0].upper()
            
        # Get image
        img = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop'
        images = p.get('images', [])
        if images and len(images) > 0:
            img = images[0].get('src', img)
            
        prices = p.get('prices', {})
        price = float(prices.get('price', 199)) / 100 if prices.get('price') else 199.0
        mrp = float(prices.get('regular_price', price*100)) / 100 if prices.get('regular_price') else price
        
        # Avoid 0 price
        if price <= 0:
            price = 199.0
        if mrp <= 0 or mrp < price:
            mrp = price
            
        description = p.get('description', p.get('short_description', ''))
        
        clean_products.append({
            'name': p.get('name', 'Unknown Part'),
            'brand': brand,
            'price': price,
            'mrp': mrp,
            'rating': 4.5,
            'reviews': 12,
            'img': img,
            'tag': 'Genuine',
            'badge': 'In Stock',
            'category': category,
            'description': description
        })

    # Save to seed_data.json
    with open('server/seed_data_full.json', 'w', encoding='utf-8') as f:
        json.dump({"products": clean_products}, f, ensure_ascii=False, indent=2)
        
    print("Saved to server/seed_data_full.json")

if __name__ == "__main__":
    main()
