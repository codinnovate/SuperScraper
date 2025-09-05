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
    html_content = get_page_content(base_url)
    if not html_content:
        print("Failed to get page content")
        return []
        
    soup = BeautifulSoup(html_content, 'html.parser')
    
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

def discover_sub_categories(technique_url):
    """Discover sub-categories for a specific technique page"""
    html_content = get_page_content(technique_url)
    if not html_content:
        return []
    
    soup = BeautifulSoup(html_content, 'html.parser')
    sub_categories = []
    
    # Look for <li> elements containing <a> tags with scroll-link class
    li_elements = soup.find_all('li')
    
    for li in li_elements:
        # Find <a> tag with scroll-link class within this <li>
        scroll_link = li.find('a', class_='scroll-link')
        
        if scroll_link:
            # Extract sub-category identifier from href or data-target
            sub_cat_id = None
            if scroll_link.get('data-target'):
                sub_cat_id = scroll_link.get('data-target')
            elif scroll_link.get('href') and '#' in scroll_link.get('href'):
                sub_cat_id = scroll_link.get('href').split('#')[-1]
            
            if sub_cat_id and sub_cat_id != '#':  # Ignore empty or just # hrefs
                # Get the technique name from the URL
                technique_name = technique_url.split('/technique/')[-1]
                
                # Create sub-category entry
                sub_category = {
                    'name': f"{technique_name}#{sub_cat_id}",
                    'url': f"{technique_url}#{sub_cat_id}",
                    'text': scroll_link.get_text().strip()
                }
                sub_categories.append(sub_category)
    
    return sub_categories

def main():
    base_url = "https://eyecannndy.com"
    
    print("Discovering technique links from eyecannndy.com...")
    technique_links = discover_technique_links(base_url)
    
    print(f"\nFound {len(technique_links)} technique links:")
    print("=" * 50)
    
    for i, link in enumerate(technique_links, 1):
        print(f"{i:3d}. {link['name']:<25} | {link['text']:<30} | {link['url']}")
    
    # Check specific techniques for sub-categories
    techniques_to_check = ['traditional', 'zoom-in']  # Add more as needed
    all_links = technique_links.copy()
    
    print("\nChecking for sub-categories...")
    for technique in techniques_to_check:
        technique_url = f"{base_url}/technique/{technique}"
        print(f"Checking {technique_url} for sub-categories...")
        sub_cats = discover_sub_categories(technique_url)
        if sub_cats:
            print(f"Found {len(sub_cats)} sub-categories for {technique}")
            all_links.extend(sub_cats)
        else:
            print(f"No sub-categories found for {technique}")
    
    # Save to JSON file
    with open('discovered_technique_links.json', 'w') as f:
        json.dump(all_links, f, indent=2)
    
    print(f"\nSaved {len(all_links)} total links to 'discovered_technique_links.json'")
    
    # Extract just the technique names for easy copying
    technique_names = [link['name'] for link in all_links]
    print("\nTechnique names for code:")
    print(technique_names)

if __name__ == "__main__":
    main()