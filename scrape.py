import urllib.request
import re
import json

req = urllib.request.Request('https://partonwheels.com/shop/', headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    titles = re.findall(r'<h[23][^>]*class="[^"]*product__title[^"]*"[^>]*><a[^>]*>(.*?)</a></h[23]>', html, re.IGNORECASE)
    if not titles:
        # maybe another class
        titles = re.findall(r'<a href="[^"]*" class="woocommerce-LoopProduct-link woocommerce-loop-product__link"><h2 class="woocommerce-loop-product__title">(.*?)</h2>', html, re.IGNORECASE)
    
    prices = re.findall(r'<span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">[^<]*</span>([0-9,.]+)</bdi></span>', html, re.IGNORECASE)
    
    images = re.findall(r'<img[^>]*src="([^"]+)"[^>]*class="[^"]*attachment-woocommerce_thumbnail[^"]*"', html, re.IGNORECASE)
    
    print("Titles:", len(titles))
    print("Prices:", len(prices))
    print("Images:", len(images))
    print("Sample titles:", titles[:5])
    print("Sample prices:", prices[:5])
    print("Sample images:", images[:5])
except Exception as e:
    print(e)
