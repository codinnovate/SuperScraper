#!/usr/bin/env python3
"""
SuperScraper - Eyecandy.com WebP Video Scraper

A comprehensive scraper for collecting WebP videos and metadata from eyecandy.com.
This scraper organizes content by categories and extracts detailed metadata.
"""

import requests
from bs4 import BeautifulSoup
import json
import csv
import os
import time
import re
from urllib.parse import urljoin, urlparse
from datetime import datetime
import logging
from typing import List, Dict, Optional
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service


class EyecandyScraper:
    """Main scraper class for eyecandy.com WebP videos."""
    
    def __init__(self, base_url: str = "https://eyecannndy.com", delay: float = 1.0):
        """
        Initialize the scraper.
        
        Args:
            base_url: Base URL of the website
            delay: Delay between requests in seconds
        """
        self.base_url = base_url
        self.delay = delay
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        })
        
        # Setup logging
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('scraper.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
        
        # Data storage
        self.videos_data = []
        self.categories = set()
        
        # Selenium driver (initialized when needed)
        self.driver = None
        
        # Create output directories
        self.create_output_directories()
    
    def create_output_directories(self):
        """Create necessary output directories."""
        directories = ['data', 'videos', 'metadata']
        for directory in directories:
            os.makedirs(directory, exist_ok=True)
    
    def setup_selenium(self):
        """Setup Selenium WebDriver for handling JavaScript and Cloudflare protection."""
        if self.driver is None:
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
                self.driver = webdriver.Chrome(service=service, options=chrome_options)
                self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
                self.logger.info("Selenium WebDriver initialized successfully")
            except Exception as e:
                self.logger.error(f"Failed to initialize Selenium: {e}")
                self.driver = None
    
    def get_page_with_selenium(self, url: str) -> Optional[str]:
        """Get page content using Selenium to handle JavaScript and Cloudflare."""
        try:
            self.setup_selenium()
            if self.driver is None:
                return None
                
            self.driver.get(url)
            
            # Wait for page to load and check for Cloudflare challenge
            WebDriverWait(self.driver, 10).until(
                lambda driver: driver.execute_script("return document.readyState") == "complete"
            )
            
            # Additional wait for potential Cloudflare challenge
            time.sleep(3)
            
            return self.driver.page_source
            
        except TimeoutException:
            self.logger.error(f"Timeout waiting for page to load: {url}")
            return None
        except Exception as e:
            self.logger.error(f"Selenium request failed for {url}: {e}")
            return None
    
    def make_request(self, url: str) -> Optional[requests.Response]:
        """
        Make a safe HTTP request with error handling.
        
        Args:
            url: URL to request
            
        Returns:
            Response object or None if failed
        """
        try:
            time.sleep(self.delay)  # Rate limiting
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            return response
        except requests.RequestException as e:
            self.logger.error(f"Request failed for {url}: {e}")
            return None
    
    def discover_pages(self) -> List[str]:
        """
        Discover all technique pages to scrape using hardcoded discovered technique names.
        
        Returns:
            List of page URLs to scrape
        """
        # All 136 technique names discovered from eyecannndy.com
        techniques = [
            'aerial', 'trip', 'traditional', 'anthropomorphism', 'arc-movement', 'architexture', 
            'bolt-cam', 'boomerang', 'breakdown', 'bullet-time', 'camera-roll', 'central-framing', 
            'choreo', 'cinemagraph', 'close-up', 'collage', 'color-shift', 'conveyor', 
            'crash-transition', 'cut-ins', 'datamosh', 'model', 'distortions', 'dolly-shot', 
            'dolly-zoom', 'double-dolly', 'double-exposure', 'dreamcore', 'duplication', 
            'dutch-angle', 'dystopian', 'echo-printing', 'epiphany-shot', 'falling', 
            'undercranking', 'glitch', 'first-person-pov', 'fisheye', 'fixed-camera', 
            'flash-cut', 'digital-overlay', 'focal-shift', 'fourth-wall', 'fpv-drone', 
            'freeze-frame', 'generative', 'digital-gesture', 'ground-shot', 'halation', 
            'shaky-cam', 'hard-light', 'haze', 'high-angle', 'infinite', 'interview', 
            'jump-cut', 'kaleidoscope', 'lazy-susan', 'floating', 'light-flash', 'locked-on', 
            'low-angle', 'surrealism', 'magnification', 'masking', 'match-cut', 'match-motion', 
            'match-split', 'maximalism', 'mixed-media', 'morphing', 'motion-blur', 
            'night-vision', 'object-portal', 'as-object', 'omnidirectional', 'overhead', 
            'over-the-shoulder', 'pan', 'parallax', 'pass-through', 'pedestal', 
            'photogrammetry', 'photography', 'pixel-art', 'probe-lens', 'product', 
            'profile-shot', 'projections', 'quick-cuts', 'aspect-ratio-switch', 'reflections', 
            'scale-shift', 'screen-in-screen', 'set-transition', 'shadow-box', 'focal-focus', 
            'silhouette', 'slit-scan', 'slow-motion', 'snorricam', 'speed-ramping', 
            'split-diopter', 'split-screen', 'spotlight', 'step-printing', 'stop-motion', 
            'stutter', 'stylistic-suck', 'tableau-shots', 'thermal', 'tilt', 'tilt-shift', 
            'tracking', 'transformation', 'transition', 'trucking', 'two-shot', 'typography', 
            'ultra-wide-zero-d', 'underwater', 'video-game', 'video-portraits', 'vignette', 
            'vhs', 'void', 'voyeur', 'wandering', 'wierdcore', 'whip-pan', 'wide-shot', 
            'wigglegram', 'worms-eye', 'x-ray', 'zoetrope', 'zoom-in'
        ]
        
        pages = []
        for technique in techniques:
            url = f"{self.base_url}/technique/{technique}"
            pages.append(url)
            
        # Also add the main page itself
        pages.append(self.base_url)
            
        self.logger.info(f"Generated {len(pages)} technique pages for scraping")
        return pages
    
    def is_valid_page_url(self, url: str) -> bool:
        """
        Check if a URL is valid for scraping.
        
        Args:
            url: URL to validate
            
        Returns:
            True if URL should be scraped
        """
        parsed = urlparse(url)
        
        # Only scrape pages from the same domain
        if parsed.netloc and parsed.netloc not in self.base_url:
            return False
        
        # Skip certain file types and external links
        skip_extensions = ['.pdf', '.zip', '.exe', '.dmg']
        if any(url.lower().endswith(ext) for ext in skip_extensions):
            return False
        
        # Skip social media and external links
        skip_domains = ['facebook.com', 'twitter.com', 'instagram.com', 'youtube.com']
        if any(domain in url.lower() for domain in skip_domains):
            return False
        
        return True
    
    def extract_webp_videos(self, url: str) -> List[Dict]:
        """
        Extract WebP videos and metadata from a single page.
        
        Args:
            url: URL of the page to scrape
            
        Returns:
            List of video data dictionaries
        """
        videos = []
        
        # Try requests first, then Selenium if it fails
        response = self.make_request(url)
        page_content = None
        
        if response:
            page_content = response.text
        else:
            # If requests fails, try with Selenium
            page_content = self.get_page_with_selenium(url)
            
        if not page_content:
            return videos
            
        soup = BeautifulSoup(page_content, 'html.parser')
        
        # Look for WebP videos in various HTML elements
        webp_elements = [
            soup.find_all('video', src=re.compile(r'\.webp$', re.I)),
            soup.find_all('source', src=re.compile(r'\.webp$', re.I)),
            soup.find_all('img', src=re.compile(r'\.webp$', re.I)),
            soup.find_all('a', href=re.compile(r'\.webp$', re.I)),
        ]
        
        # Also look for WebP references in data attributes and CSS
        data_webp = soup.find_all(attrs={"data-src": re.compile(r'\.webp$', re.I)})
        webp_elements.append(data_webp)
        
        for element_list in webp_elements:
            for element in element_list:
                video_data = self.extract_video_metadata(element, url, soup)
                if video_data:
                    videos.append(video_data)
        
        self.logger.info(f"Found {len(videos)} WebP videos on {url}")
        return videos
    
    def extract_video_metadata(self, element, page_url: str, soup: BeautifulSoup) -> Optional[Dict]:
        """
        Extract metadata for a single WebP video.
        
        Args:
            element: HTML element containing the video
            page_url: URL of the page containing the video
            soup: BeautifulSoup object of the page
            
        Returns:
            Dictionary with video metadata or None
        """
        try:
            # Get video URL
            video_url = None
            for attr in ['src', 'href', 'data-src']:
                if element.get(attr) and '.webp' in element.get(attr).lower():
                    video_url = urljoin(page_url, element.get(attr))
                    break
            
            if not video_url:
                return None
            
            # Extract metadata
            metadata = {
                'video_url': video_url,
                'page_url': page_url,
                'discovered_at': datetime.now().isoformat(),
                'element_tag': element.name,
                'title': self.extract_title(element, soup),
                'description': self.extract_description(element, soup),
                'category': self.extract_category(page_url, soup),
                'alt_text': element.get('alt', ''),
                'css_classes': ' '.join(element.get('class', [])),
                'file_size': None,  # Will be populated when downloading
                'dimensions': self.extract_dimensions(element),
                'tags': self.extract_tags(element, soup)
            }
            
            # Add category to our set
            if metadata['category']:
                self.categories.add(metadata['category'])
            
            return metadata
            
        except Exception as e:
            self.logger.error(f"Error extracting metadata: {e}")
            return None
    
    def extract_title(self, element, soup: BeautifulSoup) -> str:
        """Extract title for the video."""
        # Try multiple strategies to find a title
        title_sources = [
            element.get('title'),
            element.get('alt'),
            element.get('data-title')
        ]
        
        # Look for nearby heading elements
        parent = element.parent
        if parent:
            for heading in parent.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']):
                if heading.get_text(strip=True):
                    title_sources.append(heading.get_text(strip=True))
        
        # Use page title as fallback
        page_title = soup.find('title')
        if page_title:
            title_sources.append(page_title.get_text(strip=True))
        
        for title in title_sources:
            if title and title.strip():
                return title.strip()[:200]  # Limit length
        
        return "Untitled"
    
    def extract_description(self, element, soup: BeautifulSoup) -> str:
        """Extract description for the video."""
        # Look for nearby text content
        parent = element.parent
        if parent:
            # Look for paragraph or div elements near the video
            for text_elem in parent.find_all(['p', 'div', 'span']):
                text = text_elem.get_text(strip=True)
                if text and len(text) > 20:  # Meaningful description
                    return text[:500]  # Limit length
        
        return ""
    
    def extract_category(self, page_url: str, soup: BeautifulSoup) -> str:
        """Extract category from page URL or content."""
        # Try to extract from URL path
        path_parts = urlparse(page_url).path.strip('/').split('/')
        if len(path_parts) > 1:
            return path_parts[0].replace('-', ' ').title()
        
        # Look for category in page content
        category_selectors = [
            'nav .active',
            '.breadcrumb .active',
            '.category',
            '[data-category]'
        ]
        
        for selector in category_selectors:
            elem = soup.select_one(selector)
            if elem:
                return elem.get_text(strip=True)
        
        return "General"
    
    def extract_dimensions(self, element) -> Optional[Dict[str, int]]:
        """Extract video dimensions if available."""
        width = element.get('width')
        height = element.get('height')
        
        if width and height:
            try:
                return {
                    'width': int(width),
                    'height': int(height)
                }
            except ValueError:
                pass
        
        return None
    
    def extract_tags(self, element, soup: BeautifulSoup) -> List[str]:
        """Extract relevant tags for the video."""
        tags = []
        
        # Extract from CSS classes
        classes = element.get('class', [])
        tags.extend([cls.replace('-', ' ') for cls in classes if len(cls) > 2])
        
        # Look for meta keywords
        meta_keywords = soup.find('meta', attrs={'name': 'keywords'})
        if meta_keywords:
            keywords = meta_keywords.get('content', '').split(',')
            tags.extend([kw.strip() for kw in keywords if kw.strip()])
        
        return list(set(tags))  # Remove duplicates
    
    def save_data(self):
        """Save collected data to files."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Save as JSON
        json_file = f"data/eyecandy_videos_{timestamp}.json"
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump({
                'scrape_info': {
                    'timestamp': timestamp,
                    'total_videos': len(self.videos_data),
                    'categories': list(self.categories),
                    'base_url': self.base_url
                },
                'videos': self.videos_data
            }, f, indent=2, ensure_ascii=False)
        
        # Save as CSV
        csv_file = f"data/eyecandy_videos_{timestamp}.csv"
        if self.videos_data:
            with open(csv_file, 'w', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=self.videos_data[0].keys())
                writer.writeheader()
                for video in self.videos_data:
                    # Convert lists to strings for CSV
                    row = video.copy()
                    if 'tags' in row and isinstance(row['tags'], list):
                        row['tags'] = ', '.join(row['tags'])
                    if 'dimensions' in row and isinstance(row['dimensions'], dict):
                        row['dimensions'] = f"{row['dimensions'].get('width', 'N/A')}x{row['dimensions'].get('height', 'N/A')}"
                    writer.writerow(row)
        
        self.logger.info(f"Data saved to {json_file} and {csv_file}")
        
        # Save categories summary
        categories_file = f"data/categories_{timestamp}.json"
        with open(categories_file, 'w', encoding='utf-8') as f:
            json.dump({
                'categories': list(self.categories),
                'count': len(self.categories)
            }, f, indent=2)
    
    def run_scraper(self, max_pages: Optional[int] = None):
        """
        Run the complete scraping process.
        
        Args:
            max_pages: Maximum number of pages to scrape (None for all)
        """
        self.logger.info("Starting Eyecandy scraper...")
        
        # Discover pages to scrape
        pages = self.discover_pages()
        
        if max_pages:
            pages = pages[:max_pages]
        
        self.logger.info(f"Scraping {len(pages)} pages...")
        
        # Scrape each page
        for i, page_url in enumerate(pages, 1):
            self.logger.info(f"Scraping page {i}/{len(pages)}: {page_url}")
            
            videos = self.extract_webp_videos(page_url)
            self.videos_data.extend(videos)
            
            # Save progress periodically
            if i % 10 == 0:
                self.save_data()
                self.logger.info(f"Progress saved. Total videos found: {len(self.videos_data)}")
        
        # Final save
        self.save_data()
        
        self.logger.info(f"Scraping completed! Found {len(self.videos_data)} WebP videos across {len(self.categories)} categories.")
        
        # Cleanup Selenium driver
        self.cleanup()
        
        # Print summary
        print(f"\n=== SCRAPING SUMMARY ===")
        print(f"Total WebP videos found: {len(self.videos_data)}")
        print(f"Categories discovered: {len(self.categories)}")
        print(f"Categories: {', '.join(sorted(self.categories))}")
        print(f"Data saved to 'data/' directory")
    
    def cleanup(self):
        """Clean up resources, especially Selenium driver."""
        if self.driver:
            try:
                self.driver.quit()
                self.logger.info("Selenium driver closed successfully")
            except Exception as e:
                self.logger.error(f"Error closing Selenium driver: {e}")
            finally:
                self.driver = None


def main():
    """Main function to run the scraper."""
    # Initialize scraper
    scraper = EyecandyScraper(
        base_url="https://eyecannndy.com",
        delay=1.0  # 1 second delay between requests
    )
    
    # Run scraper (limit to 50 pages for testing)
    scraper.run_scraper(max_pages=50)


if __name__ == "__main__":
    main()