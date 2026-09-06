from playwright.sync_api import sync_playwright
import time

pills = [
    '✨ Kashmiri Saffron',
    '🌰 Jumbo Almonds',
    '🥜 King Cashews',
    '🌿 Green Cardamom',
    '🍇 Afghan Anjeer',
    '💎 Salted Pistachios',
    '🫒 Pure A2 Ghee',
    '🌱 Chia & Flax Seeds',
    '🎁 Festive Gift Boxes'
]

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 900})

    for pill in pills:
        page.goto('http://localhost:5173/', wait_until='networkidle')
        time.sleep(0.3)
        page.mouse.click(500, 500)
        time.sleep(2.0)
        page.click(f'text="{pill}"')
        time.sleep(1.0)
        
        # Get count header text
        count_text = page.locator('h2').first.text_content() if page.locator('h2').count() > 0 else 'N/A'
        # Get product names
        items = page.locator('.product-card').all_text_contents()
        clean_names = []
        for it in items[:4]:
            lines = [l.strip() for l in it.split('\n') if l.strip()]
            name = lines[2] if len(lines) > 2 else (lines[0] if lines else '')
            clean_names.append(name)
        clean_pill = pill.encode('ascii', 'ignore').decode('ascii').strip()
        print(f"[{clean_pill}] -> Header: '{count_text.strip().encode('ascii', 'ignore').decode('ascii')}' | Found {len(items)} items: {[n.encode('ascii', 'ignore').decode('ascii') for n in clean_names]}")

    page.screenshot(path=r'C:\Users\HP\.gemini\antigravity\brain\a115c25f-0f7c-4f8b-b26d-4538bf93f25c\all_pills_test.png')
    browser.close()
