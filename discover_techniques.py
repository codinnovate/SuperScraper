#!/usr/bin/env python3
"""
Script to discover all available techniques on eyecannndy.com
"""

import logging
import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import time

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class TechniqueDiscoverer:
    def __init__(self):
        self.driver = None
        self.base_url = "https://eyecannndy.com"
        self.techniques = []
        
    def setup_driver(self):
        """Initialize Chrome WebDriver with appropriate options"""
        chrome_options = Options()
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--window-size=1920,1080')
        chrome_options.add_argument('--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
        
        try:
            self.driver = webdriver.Chrome(options=chrome_options)
            logger.info("Chrome WebDriver initialized successfully")
            return True
        except Exception as e:
            logger.error(f"Failed to initialize WebDriver: {e}")
            return False
    
    def discover_techniques(self):
        """Discover all available techniques from the main page"""
        try:
            # Navigate to the main page
            logger.info(f"Navigating to {self.base_url}")
            self.driver.get(self.base_url)
            
            # Wait for page to load
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            
            # Look for technique links - try multiple selectors
            technique_selectors = [
                "a[href*='/technique/']",
                ".technique-link",
                "[data-technique]",
                "a[href^='/technique']"
            ]
            
            technique_elements = []
            for selector in technique_selectors:
                try:
                    elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                    if elements:
                        technique_elements.extend(elements)
                        logger.info(f"Found {len(elements)} elements with selector: {selector}")
                except Exception as e:
                    logger.debug(f"Selector {selector} failed: {e}")
            
            # If no specific technique links found, look for any links containing 'technique'
            if not technique_elements:
                all_links = self.driver.find_elements(By.TAG_NAME, "a")
                for link in all_links:
                    href = link.get_attribute("href")
                    if href and "/technique/" in href:
                        technique_elements.append(link)
                        
            logger.info(f"Total technique elements found: {len(technique_elements)}")
            
            # Extract technique information
            seen_techniques = set()
            for element in technique_elements:
                try:
                    href = element.get_attribute("href")
                    text = element.text.strip()
                    
                    if href and "/technique/" in href:
                        # Extract technique name from URL
                        technique_name = href.split("/technique/")[-1].rstrip("/")
                        
                        if technique_name and technique_name not in seen_techniques:
                            technique_info = {
                                "name": technique_name,
                                "url": href,
                                "display_text": text,
                                "discovered_at": time.strftime("%Y-%m-%d %H:%M:%S")
                            }
                            self.techniques.append(technique_info)
                            seen_techniques.add(technique_name)
                            logger.info(f"Discovered technique: {technique_name} - {text}")
                            
                except Exception as e:
                    logger.debug(f"Error processing technique element: {e}")
            
            # Also try to find techniques by navigating to /techniques page if it exists
            try:
                techniques_page_url = f"{self.base_url}/techniques"
                logger.info(f"Trying techniques page: {techniques_page_url}")
                self.driver.get(techniques_page_url)
                time.sleep(3)
                
                # Look for technique links on this page
                more_links = self.driver.find_elements(By.CSS_SELECTOR, "a[href*='/technique/']")
                for link in more_links:
                    href = link.get_attribute("href")
                    text = link.text.strip()
                    
                    if href and "/technique/" in href:
                        technique_name = href.split("/technique/")[-1].rstrip("/")
                        
                        if technique_name and technique_name not in seen_techniques:
                            technique_info = {
                                "name": technique_name,
                                "url": href,
                                "display_text": text,
                                "discovered_at": time.strftime("%Y-%m-%d %H:%M:%S")
                            }
                            self.techniques.append(technique_info)
                            seen_techniques.add(technique_name)
                            logger.info(f"Discovered technique from /techniques page: {technique_name} - {text}")
                            
            except Exception as e:
                logger.info(f"No /techniques page found or error accessing it: {e}")
            
            return self.techniques
            
        except Exception as e:
            logger.error(f"Error discovering techniques: {e}")
            return []
    
    def save_techniques(self, filename="discovered_techniques.json"):
        """Save discovered techniques to JSON file"""
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump({
                    "discovery_info": {
                        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
                        "total_techniques": len(self.techniques),
                        "base_url": self.base_url
                    },
                    "techniques": self.techniques
                }, f, indent=2, ensure_ascii=False)
            
            logger.info(f"Saved {len(self.techniques)} techniques to {filename}")
            return True
        except Exception as e:
            logger.error(f"Error saving techniques: {e}")
            return False
    
    def cleanup(self):
        """Clean up resources"""
        if self.driver:
            self.driver.quit()
            logger.info("WebDriver closed")

def main():
    discoverer = TechniqueDiscoverer()
    
    try:
        if not discoverer.setup_driver():
            logger.error("Failed to setup WebDriver")
            return
        
        techniques = discoverer.discover_techniques()
        
        if techniques:
            logger.info(f"\n=== DISCOVERED {len(techniques)} TECHNIQUES ===")
            for i, technique in enumerate(techniques, 1):
                logger.info(f"{i}. {technique['name']} - {technique['display_text']}")
                logger.info(f"   URL: {technique['url']}")
            
            discoverer.save_techniques()
            logger.info("\n=== TECHNIQUE DISCOVERY COMPLETED ===")
        else:
            logger.warning("No techniques discovered")
            
    except Exception as e:
        logger.error(f"Discovery failed: {e}")
    finally:
        discoverer.cleanup()

if __name__ == "__main__":
    main()