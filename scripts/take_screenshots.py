import os
import time
from playwright.sync_api import sync_playwright

output_dir = r"C:\Users\HP\.gemini\antigravity\brain\a115c25f-0f7c-4f8b-b26d-4538bf93f25c"
os.makedirs(output_dir, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 1440, 'height': 900})
    page = context.new_page()

    print("Navigating to http://localhost:5173/ ...")
    page.goto('http://localhost:5173/', wait_until='networkidle')
    # Click to dismiss splash loader and wait 2.5s
    time.sleep(0.5)
    page.mouse.click(500, 500)
    time.sleep(2.5)

    # Screenshot 1: Hero & Top Section
    page.screenshot(path=os.path.join(output_dir, "homepage_hero.png"))
    print("Saved homepage_hero.png")

    # Scroll down step by step to reveal sections
    page.evaluate("window.scrollTo(0, 700)")
    time.sleep(1.0)
    page.screenshot(path=os.path.join(output_dir, "homepage_categories.png"))
    print("Saved homepage_categories.png")

    page.evaluate("window.scrollTo(0, 1600)")
    time.sleep(1.0)
    page.screenshot(path=os.path.join(output_dir, "homepage_spices_and_nuts.png"))
    print("Saved homepage_spices_and_nuts.png")

    page.evaluate("window.scrollTo(0, 2800)")
    time.sleep(1.0)
    page.screenshot(path=os.path.join(output_dir, "homepage_ghee_and_gifts.png"))
    print("Saved homepage_ghee_and_gifts.png")

    # Full page screenshot
    page.screenshot(path=os.path.join(output_dir, "homepage_full.png"), full_page=True)
    print("Saved homepage_full.png")

    # Navigate to Catalogue page
    print("Navigating to Catalogue page...")
    page.goto('http://localhost:5173/category', wait_until='networkidle')
    time.sleep(0.5)
    page.mouse.click(500, 500)
    time.sleep(2.5)
    page.screenshot(path=os.path.join(output_dir, "catalogue_page.png"))
    print("Saved catalogue_page.png")

    # Navigate to Offers page
    print("Navigating to Offers page...")
    page.goto('http://localhost:5173/offers', wait_until='networkidle')
    time.sleep(0.5)
    page.mouse.click(500, 500)
    time.sleep(2.5)
    page.screenshot(path=os.path.join(output_dir, "offers_page.png"))
    print("Saved offers_page.png")

    browser.close()
    print("Visual screenshot capture complete!")
