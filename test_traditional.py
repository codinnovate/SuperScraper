#!/usr/bin/env python3
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def get_page_content_selenium(url):
    """Get page content using Selenium to handle Cloudflare protection"""
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--window-size=1920,1080')
    chrome_options.add_argument('--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
    
    driver = webdriver.Chrome(options=chrome_options)
    
    try:
        print(f"Loading page: {url}")
        driver.get(url)
        
        # Wait for page to load
        time.sleep(5)
        
        # Wait for content to be present
        WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        
        return driver.page_source
    except Exception as e:
        print(f"Error loading page: {e}")
        return None
    finally:
        driver.quit()

def analyze_traditional_page():
    url = "https://eyecannndy.com/technique/traditional"
    
    # Get page content
    html_content = get_page_content_selenium(url)
    if not html_content:
        print("Failed to get page content")
        return
    
    soup = BeautifulSoup(html_content, 'html.parser')
    
    print("=== Analyzing Traditional Page Structure ===")
    
    # Look for scroll-link elements
    scroll_links = soup.find_all(class_='scroll-link')
    print(f"\nFound {len(scroll_links)} elements with 'scroll-link' class:")
    for i, link in enumerate(scroll_links, 1):
        print(f"{i}. Tag: {link.name}, Text: '{link.get_text().strip()}', href: {link.get('href')}, data-target: {link.get('data-target')}")
    
    # Look for any links with # in href
    hash_links = soup.find_all('a', href=lambda x: x and '#' in x)
    print(f"\nFound {len(hash_links)} links with '#' in href:")
    for i, link in enumerate(hash_links, 1):
        if i <= 20:  # Limit output
            print(f"{i}. Text: '{link.get_text().strip()}', href: {link.get('href')}")
    
    # Look for any elements with data-target
    data_target_elements = soup.find_all(attrs={'data-target': True})
    print(f"\nFound {len(data_target_elements)} elements with 'data-target' attribute:")
    for i, elem in enumerate(data_target_elements, 1):
        if i <= 10:  # Limit output
            print(f"{i}. Tag: {elem.name}, Text: '{elem.get_text().strip()}', data-target: {elem.get('data-target')}")
    
    # Look for navigation or tab-like structures
    nav_elements = soup.find_all(['nav', 'ul', 'div'], class_=lambda x: x and any(word in str(x).lower() for word in ['nav', 'tab', 'menu', 'category']))
    print(f"\nFound {len(nav_elements)} potential navigation elements:")
    for i, elem in enumerate(nav_elements, 1):
        if i <= 5:  # Limit output
            print(f"{i}. Tag: {elem.name}, Class: {elem.get('class')}, Text preview: '{elem.get_text().strip()[:100]}...'")

if __name__ == "__main__":
    analyze_traditional_page()