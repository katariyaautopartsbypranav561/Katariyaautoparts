import pandas as pd
import json
import re
import os
import subprocess

excel_path = r'C:\Users\HP\Downloads\CATEGORIES.xls'
df = pd.read_excel(excel_path)

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

INITIAL_CATEGORIES = [
  { "id": 1, "label": "Dry Fruits", "emoji": "🌰", "img": "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=120&h=120&fit=crop", "bg": "#fef3c7" },
  { "id": 2, "label": "Dried Fruits & Berries", "emoji": "🍇", "img": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=120&h=120&fit=crop", "bg": "#fdf2f8" },
  { "id": 3, "label": "Healthy Snacks & Makhana", "emoji": "🍿", "img": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=120&h=120&fit=crop", "bg": "#fff7ed" },
  { "id": 4, "label": "Sharbat & Beverages", "emoji": "🥤", "img": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=120&h=120&fit=crop", "bg": "#eff6ff" },
  { "id": 5, "label": "Healthy Seeds", "emoji": "🌱", "img": "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?w=120&h=120&fit=crop", "bg": "#f0fdf4" },
  { "id": 6, "label": "Exotic Spices", "emoji": "🌿", "img": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=120&h=120&fit=crop", "bg": "#ecfdf5" },
  { "id": 7, "label": "Chocolates & Sweets", "emoji": "🍫", "img": "https://images.unsplash.com/photo-1511381939415-e44015466834?w=120&h=120&fit=crop", "bg": "#faf5ff" },
  { "id": 8, "label": "Mukhwas & Refreshers", "emoji": "🍃", "img": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=120&h=120&fit=crop", "bg": "#f0fdf4" },
  { "id": 9, "label": "Ayurvedic & Wellness", "emoji": "🧘", "img": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=120&h=120&fit=crop", "bg": "#ecfdf5" },
  { "id": 10, "label": "Pure Ghee & Oils", "emoji": "🧈", "img": "https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=120&h=120&fit=crop", "bg": "#fffbeb" },
  { "id": 11, "label": "Millets & Supergrains", "emoji": "🌾", "img": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=120&h=120&fit=crop", "bg": "#fefce8" },
  { "id": 12, "label": "Festive Gift Boxes", "emoji": "🎁", "img": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=120&h=120&fit=crop", "bg": "#fdf2f8" }
]

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
    'Gift': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800',
    'Default': 'https://images.unsplash.com/photo-1509358271058-acd01cc9386a?auto=format&fit=crop&q=80&w=800'
}

def clean_title(name):
    name = str(name).strip()
    name = re.sub(r'(\d+)\s*GM\b', r'\1g', name, flags=re.IGNORECASE)
    name = re.sub(r'(\d+)\s*KG\b', r'\1kg', name, flags=re.IGNORECASE)
    name = re.sub(r'(\d+)\s*ML\b', r'\1ml', name, flags=re.IGNORECASE)
    name = re.sub(r'(\d+)\s*LTR\b', r'\1L', name, flags=re.IGNORECASE)
    name = re.sub(r'(\d+)\s*PC\b', r'\1 Pcs', name, flags=re.IGNORECASE)
    
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
    if 'GIFT' in n or 'HAMPER' in n or 'BOX' in n: return image_pools['Gift']
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
for idx, row in df.iterrows():
    raw_ptype = str(row['PRODUCTTYPE']).strip()
    raw_name = str(row['Item Name']).strip()
    category = cat_map.get(raw_ptype, 'Dry Fruits')
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
        "images": None,
        "tag": tag,
        "badge": badge,
        "category": category,
        "petType": category,
        "description": f"Directly sourced 100% pure organic {clean_name}. Tested for maximum aroma, natural nutrients, and farm fresh purity."
    }
    products.append(p_obj)

# Add Festive Gift Boxes items
gift_boxes = [
  { "id": 247, "name": "Royal Shahi Kashmiri Saffron & Nuts Wooden Chest", "brand": "Fortune Foodz", "price": 2499, "mrp": 3199, "rating": 5.0, "reviews": 420, "img": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&h=500&fit=crop", "images": None, "tag": "22% OFF", "badge": "👑 Royal Gift Chest", "category": "Festive Gift Boxes", "petType": "FestiveGift", "description": "Handcrafted solid teak wooden chest packed with 2g Kashmiri Mongra Saffron, Jumbo Almonds, King Cashews & Pistachios." },
  { "id": 248, "name": "Grand Festive Harvest Dry Fruit Celebration Hamper", "brand": "Fortune Foodz", "price": 1899, "mrp": 2399, "rating": 4.9, "reviews": 280, "img": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&h=500&fit=crop", "images": None, "tag": "20% OFF", "badge": "🎉 Bestseller Hamper", "category": "Festive Gift Boxes", "petType": "FestiveGift", "description": "Luxury gold-foiled festive basket with California Almonds, Iranian Pistachios, Afghan Figs, and Black Raisins." },
  { "id": 249, "name": "Maharajah Velvet Dry Fruit & Spices Luxury Trunk", "brand": "Fortune Foodz", "price": 3499, "mrp": 4499, "rating": 5.0, "reviews": 195, "img": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&h=500&fit=crop", "images": None, "tag": "22% OFF", "badge": "👑 Velvet Edition", "category": "Festive Gift Boxes", "petType": "FestiveGift", "description": "Deep crimson velvet lined royal brass trunk with Mongra Saffron, Wayanad Elaichi, Cinnamon, Pecans, and Cashews." },
  { "id": 250, "name": "Organic Wellness & Seeds Golden Gourmet Tray", "brand": "Fortune Foodz", "price": 1299, "mrp": 1699, "rating": 4.8, "reviews": 150, "img": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&h=500&fit=crop", "images": None, "tag": "24% OFF", "badge": "🌿 Superfood Gift", "category": "Festive Gift Boxes", "petType": "FestiveGift", "description": "Brass hammered gourmet serving tray featuring Chia seeds, Flax seeds, Roasted Makhana, and Dried Cranberries." },
  { "id": 251, "name": "Corporate Platinum Gourmet Dry Fruit Gift Box", "brand": "Fortune Foodz", "price": 1499, "mrp": 1899, "rating": 4.9, "reviews": 210, "img": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&h=500&fit=crop", "images": None, "tag": "21% OFF", "badge": "💼 Corporate Special", "category": "Festive Gift Boxes", "petType": "FestiveGift", "description": "Sleek eco-friendly magnetic gift box filled with roasted gourmet nuts, pumpkin seeds, and chia crunch snacks." },
  { "id": 252, "name": "Shahi Saffron & Wooden Spice Treasury Box", "brand": "Fortune Foodz", "price": 2999, "mrp": 3899, "rating": 5.0, "reviews": 190, "img": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&h=500&fit=crop", "images": None, "tag": "23% OFF", "badge": "✨ Heritage Edition", "category": "Festive Gift Boxes", "petType": "FestiveGift", "description": "Hand-carved Rosewood brass-fitted chest featuring 5g Mongra Saffron, Green Elaichi, Ceylon Cinnamon, and King Cashews." }
]
products.extend(gift_boxes)

# Read existing seed.js to preserve slides, banners, deals, settings
with open('server/seed.js', 'r', encoding='utf-8') as f:
    seed_content = f.read()

# Replace INITIAL_CATEGORIES and INITIAL_PRODUCTS
slides_part = seed_content.split('const INITIAL_SLIDES =')[1].split('const INITIAL_BANNERS =')[0]
banners_part = seed_content.split('const INITIAL_BANNERS =')[1].split('const INITIAL_CATEGORIES =')[0]
deals_part = seed_content.split('const INITIAL_DEALS =')[1].split('const INITIAL_PRODUCTS =')[0]
settings_part = seed_content.split('const INITIAL_SETTINGS =')[1].split('async function main()')[0]
main_part = seed_content.split('async function main()')[1]

new_seed_code = f"""const {{ PrismaClient }} = require('@prisma/client');
const path = require('path');
require('dotenv').config({{ path: path.resolve(__dirname, '.env') }});
process.env.DATABASE_URL = process.env.DATABASE_URL || "file:./dev.db";

const prisma = new PrismaClient();

const INITIAL_SLIDES ={slides_part}const INITIAL_BANNERS ={banners_part}const INITIAL_CATEGORIES = {json.dumps(INITIAL_CATEGORIES, indent=2)};

const INITIAL_DEALS ={deals_part}const INITIAL_PRODUCTS = {json.dumps(products, indent=2)};

const INITIAL_SETTINGS ={settings_part}async function main(){main_part}"""

with open('server/seed.js', 'w', encoding='utf-8') as f:
    f.write(new_seed_code)

print(f"Updated server/seed.js with {len(products)} total products and {len(INITIAL_CATEGORIES)} categories!")
