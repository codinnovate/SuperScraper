#!/usr/bin/env python3
"""
Simple script to discover all technique links from eyecannndy.com main page
"""

import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time
import json
from urllib.parse import urljoin, urlparse

def setup_selenium():
    """Setup Selenium WebDriver for handling JavaScript and Cloudflare protection."""
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-blink-features=AutomationControlled')
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option('useAutomationExtension', False)
    chrome_options.add_argument('--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    
    try:
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)
        driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        return driver
    except Exception as e:
        print(f"Failed to initialize Selenium: {e}")
        return None

def get_page_content(url):
    """Get page content using Selenium to handle Cloudflare protection."""
    driver = setup_selenium()
    if not driver:
        return None
        
    try:
        print(f"Loading page: {url}")
        driver.get(url)
        
        # Wait for page to load
        time.sleep(5)
        
        return driver.page_source
        
    except Exception as e:
        print(f"Error loading page: {e}")
        return None
    finally:
        if driver:
            driver.quit()

def discover_technique_links(base_url):
    """Discover all technique links from the main page."""
    page_content = get_page_content(base_url)
    if not page_content:
        print("Failed to get page content")
        return []
        
    soup = BeautifulSoup(page_content, 'html.parser')
    
    # Find all links
    links = soup.find_all('a', href=True)
    technique_links = []
    
    for link in links:
        href = link['href']
        full_url = urljoin(base_url, href)
        
        # Check if it's a technique link
        if '/technique/' in full_url:
            technique_name = full_url.split('/technique/')[-1]
            if technique_name and technique_name != '':
                technique_links.append({
                    'name': technique_name,
                    'url': full_url,
                    'text': link.get_text(strip=True)
                })
    
    # Remove duplicates
    seen_urls = set()
    unique_links = []
    for link in technique_links:
        if link['url'] not in seen_urls:
            seen_urls.add(link['url'])
            unique_links.append(link)
    
    return unique_links

def main():
    base_url = "https://eyecannndy.com"
    
    print("Discovering technique links from eyecannndy.com...")
    technique_links = discover_technique_links(base_url)
    
    print(f"\nFound {len(technique_links)} technique links:")
    print("=" * 50)
    
    for i, link in enumerate(technique_links, 1):
        print(f"{i:3d}. {link['name']:<25} | {link['text']:<30} | {link['url']}")
    
    # Save to JSON file
    with open('discovered_technique_links.json', 'w') as f:
        json.dump(technique_links, f, indent=2)
    
    print(f"\nSaved {len(technique_links)} technique links to 'discovered_technique_links.json'")
    
    # Extract just the technique names for easy copying
    technique_names = [link['name'] for link in technique_links]
    print("\nTechnique names for code:")
    print(technique_names)

if __name__ == "__main__":
    main()