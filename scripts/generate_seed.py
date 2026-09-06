import pandas as pd
import json
import re

excel_path = r'C:\Users\HP\Downloads\CATEGORIES.xls'
df = pd.read_excel(excel_path)

# Category mapping
cat_map = {
    'DRY FRUIT': 'Dry Fruits',
    'DRIED FRUIT': 'Dried Fruits & Berries',
    'HEALTHY SNACKS': 'Healthy Snacks & Makhana',
    'SHARBAT': 'Sharbat & Beverages',
    'SEEDS': 'Healthy Seeds',
    'SPICES': 'Exotic Spices',
    'CHOCLATE': 'Chocolates & Sweets',
    'MUKHWAS': 'Mukhwas & Refreshers',
    'AYURVEDIC': 'Ayurvedic & Wellness',
    'OIL': 'Pure Ghee & Oils',
    'DAIRY': 'Pure Ghee & Oils',
    'BAKERY': 'Healthy Snacks & Makhana',
    'MILLETS': 'Millets & Supergrains'
}

# Image pools for different food types
image_pools = {
    'Saffron': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800',
    'Almond': 'https://images.unsplash.com/photo-1509358271058-acd01cc9386a?auto=format&fit=crop&q=80&w=800',
    'Cashew': 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=800',
    'Pistachio': 'https://images.unsplash.com/photo-1536591375315-1989565823e1?auto=format&fit=crop&q=80&w=800',
    'Dates': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
    'Fig': 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=800',
    'Walnut': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=800',
    'Ghee': 'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?auto=format&fit=crop&q=80&w=800',
    'Oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=800',
    'Spices': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800',
    'Seeds': 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&q=80&w=800',
    'Makhana': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800',
    'Sharbat': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800',
    'Chocolate': 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&q=80&w=800',
    'Dried Fruit': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800',
    'Default': 'https://images.unsplash.com/photo-1509358271058-acd01cc9386a?auto=format&fit=crop&q=80&w=800'
}

def clean_title(name):
    name = str(name).strip()
    # Replace GM, LTR, KG formatting nicely
    name = re.sub(r'(\d+)\s*GM\b', r'\1g', name, flags=re.IGNORECASE)
    name = re.sub(r'(\d+)\s*GM\b', r'\1g', name, flags=re.IGNORECASE)
    name = re.sub(r'(\d+)\s*KG\b', r'\1kg', name, flags=re.IGNORECASE)
    name = re.sub(r'(\d+)\s*ML\b', r'\1ml', name, flags=re.IGNORECASE)
    name = re.sub(r'(\d+)\s*LTR\b', r'\1L', name, flags=re.IGNORECASE)
    name = re.sub(r'(\d+)\s*PC\b', r'\1 Pcs', name, flags=re.IGNORECASE)
    
    # Capitalize title case nicely
    words = name.split()
    cleaned = []
    for w in words:
        if w.lower() in ['gm', 'ml', 'kg', 'ltr', 'pcs']:
            cleaned.append(w.lower())
        elif re.match(r'^\d+[a-zA-Z]+$', w):
            cleaned.append(w)
        else:
            cleaned.append(w.capitalize())
    return ' '.join(cleaned)

def get_image(name, cat):
    n = name.upper()
    if 'SAFFRON' in n or 'KESAR' in n: return image_pools['Saffron']
    if 'BADAM' in n or 'ALMOND' in n: return image_pools['Almond']
    if 'KAJU' in n or 'CASHEW' in n: return image_pools['Cashew']
    if 'PISTA' in n or 'PISTACHIO' in n: return image_pools['Pistachio']
    if 'DATE' in n or 'KHAJUR' in n or 'KHARIK' in n: return image_pools['Dates']
    if 'FIG' in n or 'ANJEER' in n: return image_pools['Fig']
    if 'AKHROT' in n or 'WALNUT' in n: return image_pools['Walnut']
    if 'GHEE' in n: return image_pools['Ghee']
    if 'OIL' in n: return image_pools['Oil']
    if 'SEEDS' in n or 'FLAX' in n or 'CHIA' in n or 'PUMPKIN' in n or 'SUNFLOWER' in n or 'JAVAS' in n: return image_pools['Seeds']
    if 'MAKHANA' in n or 'MURMURA' in n or 'PUFFS' in n or 'SNACK' in n: return image_pools['Makhana']
    if 'SYRUP' in n or 'CRUSH' in n or 'JUICE' in n or 'SQUASH' in n or 'SHARBAT' in n: return image_pools['Sharbat']
    if 'CHOC' in n or 'CHOCOLATE' in n or 'NUTTELA' in n or 'TRUFFLE' in n: return image_pools['Chocolate']
    if cat == 'SPICES': return image_pools['Spices']
    if cat in ['DRIED FRUIT', 'DRY FRUIT']: return image_pools['Dried Fruit']
    return image_pools['Default']

def estimate_price(name, cat):
    n = name.upper()
    if 'SAFFRON' in n or 'SHILAJIT' in n or 'MAMRA' in n:
        base = 650
    elif 'GHEE' in n or 'W180' in n or 'ANJEER' in n or 'WALNUT' in n:
        base = 499
    elif 'BADAM' in n or 'KAJU' in n or 'PISTA' in n or 'CHOC' in n or 'PINE' in n:
        base = 349
    elif '1KG' in n or '1LTR' in n:
        base = 450
    elif '500GM' in n or '500ML' in n:
        base = 299
    elif '250GM' in n or '200GM' in n:
        base = 189
    elif '100GM' in n or '50GM' in n or '150GM' in n:
        base = 120
    else:
        base = 199
    return float(base)

products = []
categories_set = set()

for idx, row in df.iterrows():
    raw_ptype = str(row['PRODUCTTYPE']).strip()
    raw_name = str(row['Item Name']).strip()
    
    category = cat_map.get(raw_ptype, 'Dry Fruits & Snacks')
    categories_set.add(category)
    
    clean_name = clean_title(raw_name)
    price = estimate_price(raw_name, raw_ptype)
    mrp = round(price * 1.22, 0)
    
    img = get_image(raw_name, raw_ptype)
    
    rating = round(4.5 + (idx % 5) * 0.1, 1)
    reviews = 40 + (idx * 7) % 180
    
    tag = "100% PURE" if "SAFFRON" in raw_name or "GHEE" in raw_name or "ORGANIC" in raw_name else "FRESH HARVEST"
    badge = "Top Seller" if idx % 4 == 0 else "Lab Certified"
    brand = "Fortune Harvest" if idx % 2 == 0 else "Fortune Pantry"
    
    p_obj = {
        "id": idx + 1,
        "name": clean_name,
        "brand": brand,
        "price": price,
        "mrp": mrp,
        "rating": rating,
        "reviews": reviews,
        "img": img,
        "images": json.dumps([img]),
        "tag": tag,
        "badge": badge,
        "category": category,
        "petType": category,
        "description": f"Directly sourced 100% pure organic {clean_name}. Tested for maximum aroma, natural nutrients, and farm fresh purity."
    }
    products.append(p_obj)

print(f"Generated {len(products)} products across {len(categories_set)} categories.")
print("Categories:", sorted(list(categories_set)))

# Save products list to json script for seed generator
with open('scripts/parsed_products.json', 'w') as f:
    json.dump(products, f, indent=2)
