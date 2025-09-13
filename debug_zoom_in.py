#!/usr/bin/env python3

import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

def debug_zoom_in_page():
    """Debug the zoom-in page to see what elements are present"""
    
    # Setup Chrome options
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--window-size=1920,1080')
    chrome_options.add_argument('--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    
    driver = webdriver.Chrome(options=chrome_options)
    
    try:
        # Test multiple URLs to see if it's a site-wide issue
        test_urls = [
            "https://eyecannndy.com/technique/zoom-in",
            "https://eyecannndy.com/technique/aerial",
            "https://eyecannndy.com"
        ]
        
        for url in test_urls:
            print(f"\n=== Testing {url} ===")
            print(f"Loading page: {url}")
            driver.get(url)
            time.sleep(3)  # Wait for page to load
            
            print(f"Page title: {driver.title}")
            print(f"Current URL: {driver.current_url}")
            
            # Check if page loaded successfully
            if "404" in driver.title or "not found" in driver.title.lower():
                print("❌ Page appears to be 404 or not found")
                continue
            
            if "can't be reached" in driver.page_source.lower() or "err_timed_out" in driver.page_source.lower():
                print("❌ Page timed out or can't be reached")
                continue
            
            print("✅ Page loaded successfully")
            break
        else:
            print("\n❌ All test URLs failed - eyecannndy.com appears to be down")
            return
        
        print(f"\n=== Analyzing successful page: {url} ===")
        
        # Test all the selectors we use
        selectors = [
            "img[src*='.webp']",
            ".lazy-img",
            "[data-video-url]",
            "img[data-src*='.webp']",
            ".video-thumbnail",
            ".clip-item img",
            "img",  # All images
            "video",  # Video elements
            "[class*='video']",  # Any element with 'video' in class
            "[class*='clip']",   # Any element with 'clip' in class
        ]
        
        print("\n=== Testing selectors ===")
        for selector in selectors:
            try:
                elements = driver.find_elements(By.CSS_SELECTOR, selector)
                print(f"{selector}: {len(elements)} elements found")
                
                # Show first few elements for debugging
                if elements and len(elements) <= 5:
                    for i, elem in enumerate(elements[:3]):
                        try:
                            src = elem.get_attribute('src') or elem.get_attribute('data-src')
                            alt = elem.get_attribute('alt')
                            class_name = elem.get_attribute('class')
                            print(f"  [{i+1}] src: {src[:80] if src else 'None'}...")
                            print(f"      alt: {alt}")
                            print(f"      class: {class_name}")
                        except Exception as e:
                            print(f"  [{i+1}] Error getting attributes: {e}")
            except Exception as e:
                print(f"{selector}: Error - {e}")
        
        # Check page source for clues
        print("\n=== Page source analysis ===")
        page_source = driver.page_source.lower()
        
        keywords = ['webp', 'video', 'clip', 'thumbnail', 'lazy', 'data-src']
        for keyword in keywords:
            count = page_source.count(keyword)
            print(f"'{keyword}' appears {count} times in page source")
        
        # Check if there are any error messages or redirects
        body_text = driver.find_element(By.TAG_NAME, "body").text
        if "no videos" in body_text.lower() or "not found" in body_text.lower():
            print(f"\n❌ Page contains error message: {body_text[:200]}...")
        
        # Save page source for manual inspection
        with open('zoom_in_debug.html', 'w', encoding='utf-8') as f:
            f.write(driver.page_source)
        print("\n📄 Page source saved to zoom_in_debug.html")
        
    except Exception as e:
        print(f"❌ Error during debugging: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    debug_zoom_in_page()