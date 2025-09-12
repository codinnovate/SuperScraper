#!/usr/bin/env python3
"""
Fast Eyecandy Scraper - Optimized Version
Combines speed of requests/BeautifulSoup with accurate data extraction
"""

import requests
from bs4 import BeautifulSoup
import json
import os
import time
import re
from urllib.parse import urljoin
from datetime import datetime
import logging
from typing import List, Dict, Optional
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

# Performance optimized constants
REQUEST_DELAY = 1.0  # Increased delay to avoid rate limiting
SELENIUM_TIMEOUT = 5  # Increased timeout for better reliability
MAX_RETRIES = 3

# Headers for requests with better anti-detection
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Cache-Control': 'max-age=0',
    'DNT': '1'
}

class FastEyecandyScraper:
    """Fast scraper combining BeautifulSoup speed with accurate extraction"""
    
    def __init__(self):
        self.setup_logging()
        self.session = requests.Session()
        self.session.headers.update(HEADERS)
        self.driver = None
        self.base_url = "https://eyecannndy.com/technique/"
        self.videos_data = []
        self.create_output_directories()
        
    def setup_logging(self):
        """Setup logging configuration"""
        logging.basicConfig(
            level=logging.DEBUG,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('fast_scraper.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
        
    def create_output_directories(self):
        """Create necessary output directories"""
        os.makedirs('data', exist_ok=True)
        
    def setup_selenium_fallback(self):
        """Setup Selenium WebDriver with comprehensive anti-detection (same as comprehensive scraper)"""
        if self.driver is None:
            chrome_options = Options()
            # Basic options
            chrome_options.add_argument('--no-sandbox')
            chrome_options.add_argument('--disable-dev-shm-usage')
            chrome_options.add_argument('--disable-blink-features=AutomationControlled')
            chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
            chrome_options.add_experimental_option('useAutomationExtension', False)
            chrome_options.add_argument('--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
            chrome_options.add_argument('--disable-web-security')
            chrome_options.add_argument('--allow-running-insecure-content')
            chrome_options.add_argument('--disable-extensions')
            
            # Performance optimizations
            chrome_options.add_argument('--headless')
            chrome_options.add_argument('--disable-images')
            chrome_options.add_argument('--disable-plugins')
            chrome_options.add_argument('--disable-java')
            chrome_options.add_argument('--disable-gpu')
            chrome_options.add_argument('--disable-software-rasterizer')
            chrome_options.add_argument('--disable-background-timer-throttling')
            chrome_options.add_argument('--disable-renderer-backgrounding')
            chrome_options.add_argument('--disable-backgrounding-occluded-windows')
            chrome_options.add_argument('--disable-ipc-flooding-protection')
            chrome_options.add_argument('--aggressive-cache-discard')
            chrome_options.add_argument('--memory-pressure-off')
            chrome_options.add_argument('--max_old_space_size=8192')
            chrome_options.add_argument('--disable-logging')
            chrome_options.add_argument('--disable-default-apps')
            chrome_options.add_argument('--disable-sync')
            chrome_options.add_argument('--disable-translate')
            chrome_options.add_argument('--hide-scrollbars')
            chrome_options.add_argument('--mute-audio')
            chrome_options.add_argument('--no-first-run')
            chrome_options.add_argument('--no-default-browser-check')
            chrome_options.add_argument('--disable-hang-monitor')
            chrome_options.add_argument('--disable-prompt-on-repost')
            
            try:
                self.driver = webdriver.Chrome(options=chrome_options)
                self.driver.set_page_load_timeout(10)  # Increased timeout
                
                # Execute script to remove webdriver property
                self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
                
                self.logger.info("Comprehensive anti-detection Selenium initialized")
            except Exception as e:
                self.logger.warning(f"Selenium setup failed: {e}")
                self.driver = None
    
    def get_techniques_list(self):
        """Get list of all techniques to scrape"""
        return [
            "aerial", "anthropomorphism", "arc-movement", "architexture", "as-object",
            "aspect-ratio-switch", "bolt-cam", "boomerang", "breakdown", "bullet-time",
            "camera-roll", "choreo", "cinemagraph", "close-up", "collage", "color-shift",
            "conveyor", "cut-ins", "datamosh", "distortions", "dolly-shot", "dolly-zoom",
            "dreamcore", "duplication", "dutch-angle", "dystopian", "falling", "fisheye",
            "flash-cut", "floating", "focal-focus", "focal-shift", "fourth-wall",
            "fpv-drone", "generative", "glitch", "ground-shot", "halation", "hard-light",
            "haze", "high-angle", "infinite", "interview", "jump-cut", "lazy-susan",
            "light-flash", "locked-on", "low-angle", "masking", "match-cut", "match-split",
            "maximalism", "model", "morphing", "overhead", "pan", "parallax", "pedestal",
            "pixel-art", "probe-lens", "product", "quick-cuts", "shadow-box", "shaky-cam",
            "silhouette", "slit-scan", "snorricam", "spotlight", "stutter", "surrealism",
            "thermal", "tilt-shift", "tilt", "tracking", "transition", "trip", "trucking",
            "two-shot", "typography", "underwater", "vhs", "video-game", "vignette",
            "void", "voyeur", "wandering", "whip-pan", "wide-shot", "wierdcore",
            "wigglegram", "worms-eye", "x-ray", "zoetrope", "zoom-in"
        ]
    
    def make_fast_request(self, url: str) -> Optional[str]:
        """Make fast HTTP request with anti-detection measures"""
        for attempt in range(MAX_RETRIES):
            try:
                # Add some randomization to avoid detection
                time.sleep(0.5 + (attempt * 0.5))  # Progressive delay
                
                response = self.session.get(url, timeout=10, allow_redirects=True)
                response.raise_for_status()
                return response.text
            except requests.exceptions.HTTPError as e:
                if e.response.status_code == 403:
                    self.logger.warning(f"403 Forbidden for {url}, attempt {attempt + 1}/{MAX_RETRIES}")
                    if attempt < MAX_RETRIES - 1:
                        time.sleep(2 ** attempt)  # Exponential backoff
                        continue
                else:
                    self.logger.warning(f"HTTP error for {url}: {e}")
                    break
            except Exception as e:
                self.logger.warning(f"Request failed for {url}: {e}")
                if attempt < MAX_RETRIES - 1:
                    time.sleep(1)
                    continue
                break
        return None
    
    def extract_videos_from_page(self, technique: str) -> List[Dict]:
        """Extract videos from a technique page using optimized Selenium"""
        url = f"{self.base_url}{technique}"
        self.logger.info(f"Scraping technique: {technique}")
        
        # Use Selenium directly since requests are being blocked
        page_content = self.get_page_with_selenium_optimized(url)
            
        if not page_content:
            self.logger.error(f"Failed to get content for {url}")
            return []
            
        soup = BeautifulSoup(page_content, 'html.parser')
        videos = []
        
        # Debug: Check page source length and title
        page_source_length = len(self.driver.page_source)
        page_title = self.driver.title
        self.logger.info(f"Page loaded - Title: '{page_title}', Source length: {page_source_length}")
        
        # Use Selenium to find video elements (same as comprehensive scraper)
        unique_elements = self.find_video_elements_with_selenium()
        
        self.logger.info(f"Found {len(unique_elements)} unique video elements for {technique}")
        
        # Debug: Log first few elements found by each selector
        if len(unique_elements) == 0:
            self.logger.warning(f"No elements found for {technique}. Debugging selectors...")
            debug_selectors = ["img", "video", ".lazy-img", "[data-src]"]
            for selector in debug_selectors:
                try:
                    elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                    self.logger.info(f"Selector '{selector}' found {len(elements)} elements")
                    if elements and len(elements) > 0:
                        first_elem = elements[0]
                        src = first_elem.get_attribute('src') or first_elem.get_attribute('data-src') or 'no-src'
                        self.logger.info(f"First element src: {src[:100]}...")
                except Exception as e:
                    self.logger.debug(f"Debug selector {selector} failed: {e}")
        
        # Convert Selenium elements to data for processing
        video_elements_data = []
        for element in unique_elements:
            try:
                src = element.get_attribute('src') or element.get_attribute('data-src')
                alt = element.get_attribute('alt') or ''
                if src:
                    video_elements_data.append({
                        'src': src,
                        'alt': alt,
                        'element': element
                    })
            except Exception as e:
                self.logger.debug(f"Error extracting element data: {e}")
                continue
        
        # Extract metadata for each video
        for element_data in video_elements_data:
            video_data = self.extract_video_metadata_fast(element_data, url, technique)
            if video_data:
                videos.append(video_data)
                
        return videos
    
    def get_page_with_selenium_optimized(self, url: str) -> Optional[str]:
        """Get page using Selenium with proper waiting for content"""
        try:
            self.setup_selenium_fallback()
            if self.driver is None:
                return None
                
            self.driver.get(url)
            
            # Wait for page to load and bypass any protection
            time.sleep(3)  # Give time for Cloudflare to pass
            
            # Check if we're still on a protection page
            if "Just a moment" in self.driver.title or "Checking your browser" in self.driver.page_source:
                self.logger.warning(f"Protection page detected for {url}, waiting longer...")
                time.sleep(5)  # Wait longer for protection to clear
            
            # Wait for page to load but with shorter timeout
            try:
                WebDriverWait(self.driver, 3).until(
                    lambda driver: driver.execute_script("return document.readyState") == "complete"
                )
            except TimeoutException:
                # Continue anyway, page might be partially loaded
                self.logger.warning(f"Page load timeout for {url}, continuing with partial content")
            
            return self.driver.page_source
            
        except Exception as e:
            self.logger.error(f"Selenium failed for {url}: {e}")
            return None
    
    def find_video_elements_with_selenium(self):
        """Find all video elements using Selenium (same selectors as comprehensive scraper)"""
        selectors = [
            "img[src*='.webp']",
            ".lazy-img",
            "[data-video-url]",
            "img[data-src*='.webp']",
            ".video-thumbnail",
            ".clip-item img"
        ]
        
        all_elements = []
        for selector in selectors:
            try:
                elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                all_elements.extend(elements)
            except Exception as e:
                self.logger.debug(f"Selector {selector} failed: {e}")
        
        # Remove duplicates based on src attribute
        unique_elements = []
        seen_srcs = set()
        
        for element in all_elements:
            try:
                src = element.get_attribute('src') or element.get_attribute('data-src')
                if src and src not in seen_srcs:
                    seen_srcs.add(src)
                    unique_elements.append(element)
            except Exception:
                continue
        
        return unique_elements
    
    def extract_video_metadata_fast(self, element_data: Dict, page_url: str, technique: str) -> Optional[Dict]:
        """Enhanced fast metadata extraction with better description and tags"""
        try:
            video_url = element_data['src']
            alt_text = element_data['alt']
            element = element_data['element']
            
            # Make URL absolute
            if video_url.startswith('//'):
                video_url = 'https:' + video_url
            elif video_url.startswith('/'):
                video_url = 'https://eyecannndy.com' + video_url
            
            # Extract enhanced metadata from surrounding elements
            description = self.extract_description_from_context(element)
            tags = self.extract_tags_from_context(element, technique)
            credits = self.extract_credits_from_context(element)
            
            # Create metadata structure similar to comprehensive scraper
            metadata = {
                'video_url': video_url,
                'alt_text': alt_text,
                'discovered_at': datetime.now().isoformat(),
                'title': alt_text,
                'description': description,
                'tags': tags,
                'technique_tags': [technique],
                'director': credits.get('director', ''),
                'dop': credits.get('dop', ''),
                'colorist': credits.get('colorist', ''),
                'page_url': page_url
            }
            
            return metadata
            
        except Exception as e:
            self.logger.error(f"Error extracting metadata: {e}")
            return None
    
    def extract_description_from_context(self, element) -> str:
        """Extract description from element's surrounding context"""
        try:
            # Look for description in parent elements
            parent = element.find_element(By.XPATH, '..')
            
            # Try to find text content near the video element
            description_selectors = [
                '.description', '.video-description', '.clip-description',
                'p', '.text', '.info', '.clip-info', '.video-info'
            ]
            
            for selector in description_selectors:
                try:
                    desc_element = parent.find_element(By.CSS_SELECTOR, selector)
                    text = desc_element.text.strip()
                    if len(text) > 20 and len(text) < 500:  # Reasonable description length
                        self.logger.debug(f"Found description via selector '{selector}': {text[:50]}...")
                        return text
                except:
                    continue
            
            # Try looking in grandparent and siblings
            try:
                grandparent = parent.find_element(By.XPATH, '..')
                grandparent_text = grandparent.text.strip()
                lines = [line.strip() for line in grandparent_text.split('\n') if line.strip()]
                
                for line in lines:
                    if len(line) > 40 and len(line) < 300:
                        # Skip lines that look like navigation, metadata, or alt text
                        skip_keywords = ['director', 'dop', 'colorist', 'technique', 'submit', 'login', 'view', 'like', 'share']
                        if not any(keyword in line.lower() for keyword in skip_keywords):
                            # Don't use the alt text as description
                            alt_text = element.get_attribute('alt') or ''
                            if line != alt_text and alt_text not in line:
                                self.logger.debug(f"Found description from grandparent: {line[:50]}...")
                                return line
            except:
                pass
            
            # Fallback: use any nearby text content from parent
            parent_text = parent.text.strip()
            lines = [line.strip() for line in parent_text.split('\n') if line.strip()]
            
            # Find the longest meaningful line as description
            for line in lines:
                if len(line) > 30 and len(line) < 300:
                    # Skip lines that look like navigation or metadata
                    skip_keywords = ['director', 'dop', 'colorist', 'technique', 'submit', 'login', 'view', 'like', 'share']
                    if not any(keyword in line.lower() for keyword in skip_keywords):
                        # Don't use the alt text as description
                        alt_text = element.get_attribute('alt') or ''
                        if line != alt_text and alt_text not in line:
                            self.logger.debug(f"Found description from parent fallback: {line[:50]}...")
                            return line
            
            self.logger.debug("No description found for element")
            return ''
            
        except Exception as e:
            self.logger.debug(f"Error extracting description: {e}")
            return ''
    
    def extract_tags_from_context(self, element, technique: str) -> List[str]:
        """Extract relevant tags from element context"""
        try:
            tags = [technique.upper()]  # Always include technique
            
            # Look for tags in parent elements
            parent = element.find_element(By.XPATH, '..')
            parent_text = parent.text.upper()
            
            # Common video/film tags to look for
            common_tags = [
                'COMMERCIAL', 'MUSIC VIDEO', 'SHORT FILM', 'DOCUMENTARY',
                'FASHION', 'AUTOMOTIVE', 'BEAUTY', 'LIFESTYLE', 'SPORTS',
                'CINEMATIC', 'CREATIVE', 'ARTISTIC', 'EXPERIMENTAL',
                'COLOR GRADING', 'VFX', 'ANIMATION', 'MOTION GRAPHICS'
            ]
            
            # Add tags found in the context
            for tag in common_tags:
                if tag in parent_text and tag not in tags:
                    tags.append(tag)
            
            # Look for brand names or artist names in alt text
            alt_text = element.get_attribute('alt') or ''
            if ' - ' in alt_text:
                # Likely format: "Artist - Song" or "Brand - Campaign"
                parts = alt_text.split(' - ')
                if len(parts) >= 2:
                    brand_or_artist = parts[0].strip().upper()
                    if len(brand_or_artist) > 2 and brand_or_artist not in tags:
                        tags.append(brand_or_artist)
            
            return tags[:5]  # Limit to 5 tags
            
        except Exception:
            return [technique.upper()]
    
    def extract_credits_from_context(self, element) -> Dict[str, str]:
        """Extract director, DOP, colorist from element context"""
        credits = {'director': '', 'dop': '', 'colorist': ''}
        
        try:
            # Look in parent elements for credit information
            parent = element.find_element(By.XPATH, '..')
            parent_text = parent.text
            
            lines = parent_text.split('\n')
            
            for line in lines:
                line = line.strip()
                line_lower = line.lower()
                
                # Director
                if 'director' in line_lower and ('-' in line or ':' in line):
                    if '-' in line:
                        credits['director'] = line.split('-', 1)[1].strip()
                    elif ':' in line:
                        credits['director'] = line.split(':', 1)[1].strip()
                
                # DOP
                elif 'dop' in line_lower and ('-' in line or ':' in line):
                    if '-' in line:
                        credits['dop'] = line.split('-', 1)[1].strip()
                    elif ':' in line:
                        credits['dop'] = line.split(':', 1)[1].strip()
                
                # Colorist
                elif 'colorist' in line_lower and ('-' in line or ':' in line):
                    if '-' in line:
                        credits['colorist'] = line.split('-', 1)[1].strip()
                    elif ':' in line:
                        credits['colorist'] = line.split(':', 1)[1].strip()
            
        except Exception:
            pass
        
        return credits
    
    def extract_video_metadata(self, element, page_url: str, soup: BeautifulSoup, technique: str) -> Optional[Dict]:
        """Extract metadata using patterns from successful popup scraper"""
        try:
            # Get video URL
            video_url = element.get('src') or element.get('data-src')
            if not video_url:
                return None
                
            # Make URL absolute
            if video_url.startswith('//'):
                video_url = 'https:' + video_url
            elif video_url.startswith('/'):
                video_url = 'https://eyecannndy.com' + video_url
            
            # Get alt text as title (as mentioned by user)
            alt_text = element.get('alt', '')
            
            # Extract metadata from surrounding elements
            metadata = {
                'video_url': video_url,
                'alt_text': alt_text,  # This serves as the title
                'discovered_at': datetime.now().isoformat(),
                'title': alt_text,  # Use alt_text as title as user specified
                'description': self.extract_description_fast(element, soup),
                'tags': self.extract_tags_fast(element, soup, technique),
                'technique_tags': [technique],  # Current technique
                'additional_info': self.extract_additional_info_fast(element, soup),
                'page_url': page_url
            }
            
            return metadata
            
        except Exception as e:
            self.logger.error(f"Error extracting metadata: {e}")
            return None
    
    def extract_description_fast(self, element, soup: BeautifulSoup) -> str:
        """Fast description extraction from nearby elements"""
        # Look for description in parent containers
        parent = element.parent
        if parent:
            # Look for text in sibling elements
            for sibling in parent.find_all(['p', 'div', 'span']):
                text = sibling.get_text(strip=True)
                if len(text) > 30 and len(text) < 500:  # Reasonable description length
                    return text
        
        # Look for meta description
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if meta_desc:
            return meta_desc.get('content', '')[:500]
            
        return ""
    
    def extract_tags_fast(self, element, soup: BeautifulSoup, technique: str) -> List[str]:
        """Fast tag extraction from various sources"""
        tags = []
        
        # Add technique as a tag
        tags.append(technique.upper())
        
        # Extract from CSS classes
        classes = element.get('class', [])
        for cls in classes:
            if len(cls) > 2 and cls not in ['lazy-img', 'img']:
                tags.append(cls.replace('-', ' ').upper())
        
        # Look for nearby text that might be tags (uppercase words)
        parent = element.parent
        if parent:
            text_content = parent.get_text()
            # Find uppercase words that might be tags
            uppercase_words = re.findall(r'\b[A-Z]{2,}\b', text_content)
            for word in uppercase_words[:5]:  # Limit to 5 tags
                if word not in ['EYECANDY', 'SUBMIT', 'SEARCH', 'LOGIN']:
                    tags.append(word)
        
        return list(set(tags))  # Remove duplicates
    
    def extract_additional_info_fast(self, element, soup: BeautifulSoup) -> str:
        """Extract additional contextual information"""
        info_parts = []
        
        # Get page title
        title_tag = soup.find('title')
        if title_tag:
            info_parts.append(f"Page: {title_tag.get_text(strip=True)}")
        
        # Get any nearby descriptive text
        parent = element.parent
        if parent:
            text = parent.get_text(strip=True)
            if len(text) > 20:
                info_parts.append(text[:200])  # First 200 chars
        
        return ' | '.join(info_parts)
    
    def save_data(self):
        """Save collected data to JSON file"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.output_file = f"data/fast_extracted_{timestamp}.json"
        
        output_data = {
            'scrape_info': {
                'timestamp': timestamp,
                'total_videos': len(self.videos),
                'scraper_type': 'fast_hybrid'
            },
            'videos': self.videos
        }
        
        with open(self.output_file, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)
            
        self.logger.info(f"Data saved to {self.output_file}")
        return self.output_file
    
    def run_scraper(self, max_techniques: Optional[int] = None):
        """Run the fast scraper with optional technique limit"""
        self.logger.info("Starting fast scraper...")
        
        techniques = self.get_techniques_list()
        if max_techniques:
            techniques = techniques[:max_techniques]
        
        self.logger.info(f"Processing {len(techniques)} techniques: {', '.join(techniques)}")
        
        all_videos = []
        
        for i, technique in enumerate(techniques, 1):
            self.logger.info(f"Processing technique {i}/{len(techniques)}: {technique}")
            
            videos = self.extract_videos_from_page(technique)
            all_videos.extend(videos)
            
            self.logger.info(f"Found {len(videos)} videos for {technique}. Total: {len(all_videos)}")
            
            # Add delay between requests
            if i < len(techniques):
                time.sleep(REQUEST_DELAY)
        
        # Save all collected data
        self.videos = all_videos
        self.save_data()
        
        self.logger.info(f"Scraping completed! Total videos: {len(all_videos)}")
        self.logger.info(f"Data saved to: {self.output_file}")
        
        # Clean up
        if self.driver:
            self.driver.quit()
            
        return self.output_file

def main():
    """Main function to run the scraper"""
    scraper = FastEyecandyScraper()
    
    # Run scraper with all techniques
    filename = scraper.run_scraper()  # Run with all techniques
    
    print(f"\nScraping completed successfully!")
    print(f"Data saved to: {filename}")
    print(f"Total videos found: {len(scraper.videos_data)}")

if __name__ == "__main__":
    main()