import urllib.request
import json
import time

products = []
page = 1
while True:
    print(f"Fetching page {page}...")
    url = f"https://partonwheels.com/wp-json/wc/store/products?per_page=100&page={page}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        res = urllib.request.urlopen(req)
        data = json.loads(res.read().decode('utf-8'))
        if not data:
            break
        for item in data:
            price = int(float(item['prices']['price']) / 100) if item['prices']['price'] else 0
            mrp = int(float(item['prices']['regular_price']) / 100) if item['prices']['regular_price'] else price
            if mrp == 0: mrp = price
            
            # extract category
            category = "Parts"
            if item.get('categories'):
                category = item['categories'][0]['name']
                
            img = "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&h=500&fit=crop"
            if item.get('images') and len(item['images']) > 0:
                img = item['images'][0]['src']
                
            products.append({
                "id": item['id'],
                "name": item['name'],
                "brand": "Katariya Auto Parts",
                "price": price,
                "mrp": mrp,
                "rating": 4.5,
                "reviews": 12,
                "img": img,
                "tag": "Genuine",
                "badge": "In Stock" if item.get('is_in_stock') else "Out of Stock",
                "category": category,
                "description": item.get('short_description', '').replace('<p>','').replace('</p>','').strip() or item['name']
            })
        page += 1
        # To avoid overloading the server and timing out, let's just fetch up to 3 pages (300 products)
        if page > 3:
            break
        time.sleep(1)
    except Exception as e:
        print(f"Error or end of pages: {e}")
        break

# Read the existing seed_data.json
try:
    with open('server/seed_data.json', 'r', encoding='utf-8') as f:
        seed = json.load(f)
except FileNotFoundError:
    seed = {"categories": [], "products": []}

seed['products'] = products

# Extract unique categories
cat_names = list(set([p['category'] for p in products]))
categories = []
for i, name in enumerate(cat_names):
    categories.append({
        "id": i + 1,
        "label": name,
        "emoji": "🔧",
        "img": products[[p['category'] for p in products].index(name)]['img']
    })
seed['categories'] = categories

with open('server/seed_data.json', 'w', encoding='utf-8') as f:
    json.dump(seed, f, indent=2)

print(f"Successfully fetched {len(products)} products and saved to seed_data.json")
