#!/usr/bin/env python3
"""
Comprehensive Popup Modal Scraper for All Eyecandy Techniques
Extracts detailed metadata from video popup modals for all techniques
"""

import time
import json
import logging
import os
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException, ElementClickInterceptedException

# Timeout constants - balanced for speed and reliability
MAIN_WAIT_TIMEOUT = 2.0   # Main WebDriverWait timeout
POPUP_WAIT_TIMEOUT = 2.0  # Popup detection timeout (increased for better detection)
VIDEO_CLICK_DELAY = 0.5   # Delay after clicking video (allow popup to load)
POPUP_CLOSE_DELAY = 0.2   # Delay after closing popup
VIDEO_PROCESSING_DELAY = 0.1  # Delay between videos
TECHNIQUE_PROCESSING_DELAY = 0.5  # Delay between techniques

# RESUME FUNCTIONALITY CONSTANTS
PROGRESS_FILE = 'scraper_progress.json'
CHECKPOINT_INTERVAL = 5  # Save progress every 5 videos

class ComprehensivePopupScraper:
    def __init__(self):
        self.setup_logging()
        self.driver = None
        self.wait = None
        self.base_url = "https://eyecannndy.com/technique/"
        self.progress_data = self.load_progress()
        self.processed_videos = 0
        
    def setup_logging(self):
        """Setup logging configuration"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('comprehensive_popup_scraper.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
        
    def load_progress(self):
        """Load progress from checkpoint file"""
        try:
            if os.path.exists(PROGRESS_FILE):
                with open(PROGRESS_FILE, 'r') as f:
                    progress = json.load(f)
                    self.logger.info(f"Loaded progress: {progress.get('completed_techniques', 0)} techniques completed")
                    return progress
        except Exception as e:
            self.logger.warning(f"Could not load progress file: {e}")
        return {'completed_techniques': [], 'current_technique': None, 'current_video_index': 0}
    
    def save_progress(self, technique=None, video_index=0, completed=False):
        """Save current progress to checkpoint file"""
        try:
            if completed and technique:
                if technique not in self.progress_data['completed_techniques']:
                    self.progress_data['completed_techniques'].append(technique)
                self.progress_data['current_technique'] = None
                self.progress_data['current_video_index'] = 0
            else:
                self.progress_data['current_technique'] = technique
                self.progress_data['current_video_index'] = video_index
            
            with open(PROGRESS_FILE, 'w') as f:
                json.dump(self.progress_data, f, indent=2)
                
        except Exception as e:
            self.logger.error(f"Could not save progress: {e}")
    
    def should_skip_technique(self, technique):
        """Check if technique should be skipped based on progress"""
        return technique in self.progress_data.get('completed_techniques', [])
    
    def get_resume_video_index(self, technique):
        """Get the video index to resume from for current technique"""
        if (self.progress_data.get('current_technique') == technique and 
            not self.should_skip_technique(technique)):
            return self.progress_data.get('current_video_index', 0)
        return 0
        
    def setup_selenium(self):
        """Setup Selenium WebDriver with enhanced anti-detection and performance optimizations"""
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
        
        # ULTRA Performance optimizations for 1 second per video
        chrome_options.add_argument('--headless')  # Run in headless mode for maximum speed
        chrome_options.add_argument('--disable-images')  # Don't load images
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
        chrome_options.add_argument('--max_old_space_size=8192')  # Increased memory
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
        chrome_options.add_argument('--disable-domain-reliability')
        chrome_options.add_argument('--disable-component-extensions-with-background-pages')
        
        # Network and loading optimizations - ULTRA FAST
        chrome_options.add_argument('--aggressive')
        chrome_options.add_argument('--disable-background-networking')
        chrome_options.add_argument('--disable-background-media-suspend')
        chrome_options.add_argument('--disable-client-side-phishing-detection')
        chrome_options.add_argument('--disable-default-apps')
        chrome_options.add_argument('--disable-hang-monitor')
        chrome_options.add_argument('--disable-popup-blocking')
        chrome_options.add_argument('--disable-prompt-on-repost')
        chrome_options.add_argument('--disable-sync')
        chrome_options.add_argument('--disable-translate')
        chrome_options.add_argument('--disable-domain-reliability')
        chrome_options.add_argument('--disable-features=TranslateUI')
        chrome_options.add_argument('--disable-component-extensions-with-background-pages')
        
        # Ultra-fast loading
        chrome_options.add_argument('--hide-scrollbars')
        chrome_options.add_argument('--metrics-recording-only')
        chrome_options.add_argument('--mute-audio')
        chrome_options.add_argument('--no-first-run')
        chrome_options.add_argument('--safebrowsing-disable-auto-update')
        chrome_options.add_argument('--disable-logging')
        chrome_options.add_argument('--disable-notifications')
        chrome_options.add_argument('--disable-permissions-api')
        chrome_options.add_argument('--disable-web-security')
        chrome_options.add_argument('--ignore-certificate-errors')
        chrome_options.add_argument('--ignore-ssl-errors')
        chrome_options.add_argument('--ignore-certificate-errors-spki-list')
        chrome_options.add_argument('--ignore-certificate-errors-ssl-errors')
        chrome_options.add_argument('--disable-features=VizDisplayCompositor')
        chrome_options.add_argument('--disable-threaded-animation')
        chrome_options.add_argument('--disable-threaded-scrolling')
        chrome_options.add_argument('--disable-checker-imaging')
        chrome_options.add_argument('--disable-new-bookmark-apps')
        chrome_options.add_argument('--disable-chromium-updater')
        chrome_options.add_argument('--disable-search-engine-choice-screen')
        
        # Page load strategy for speed - MAXIMUM SPEED
        chrome_options.page_load_strategy = 'none'  # Don't wait for any resources
        
        self.driver = webdriver.Chrome(options=chrome_options)
        self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        self.wait = WebDriverWait(self.driver, MAIN_WAIT_TIMEOUT)
        self.logger.info("Chrome WebDriver initialized successfully")
        
    def get_techniques_list(self):
        """Get list of all techniques from predefined list"""
        # Always use the full predefined list
        techniques = [
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
        
        self.logger.info(f"Using predefined list of {len(techniques)} techniques")
        return techniques
    
    def get_page_with_selenium(self, url):
        """Navigate to page with Selenium"""
        try:
            self.driver.get(url)
            time.sleep(3)  # Wait for page load
            return True
        except Exception as e:
            self.logger.error(f"Error loading page {url}: {e}")
            return False
    
    def find_video_elements(self):
        """Find all video elements on the page using multiple selectors"""
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
    
    def click_video_and_extract_popup(self, video_element):
        """Click video element and extract popup content with strict description validation"""
        try:
            # Get video URL before clicking
            video_url = video_element.get_attribute('src') or video_element.get_attribute('data-src')
            alt_text = video_element.get_attribute('alt') or ""
            
            self.logger.info(f"Attempting to click video: {video_url[:50]}...")
            
            # Scroll to element and wait for it to be properly positioned
            self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", video_element)
            time.sleep(0.2)  # Allow scroll to complete
            
            # Try multiple times to get a description - be strict about it
            max_description_attempts = 3
            popup_data = None
            
            for attempt in range(max_description_attempts):
                # Direct JavaScript click for reliability
                self.driver.execute_script("arguments[0].click();", video_element)
                time.sleep(VIDEO_CLICK_DELAY * (attempt + 1))  # Increase wait time with each attempt
                
                # Extract popup content
                popup_data = self.extract_popup_content()
                
                # Close popup
                self.close_popup()
                
                # Check if we got a meaningful description
                if popup_data and popup_data.get('description') and len(popup_data['description'].strip()) > 20:
                    self.logger.info(f"Successfully extracted description on attempt {attempt + 1}: {popup_data['description'][:50]}...")
                    break
                else:
                    if attempt < max_description_attempts - 1:
                        self.logger.warning(f"No meaningful description found on attempt {attempt + 1}, retrying...")
                        time.sleep(1)  # Wait before retry
                    else:
                        self.logger.warning(f"Failed to extract meaningful description after {max_description_attempts} attempts")
                        # Return None to skip this video - be strict about descriptions
                        return None
            
            self.logger.info(f"Successfully processed video: {video_url[:50]}...")
            
            return {
                'video_url': video_url,
                'alt_text': alt_text,
                'discovered_at': datetime.now().isoformat(),
                **popup_data
            }
            
        except Exception as e:
            self.logger.error(f"Error clicking video element: {e}")
            # Try to close any open popup before continuing
            try:
                self.close_popup()
            except:
                pass
            return None
    
    def extract_popup_content(self):
        """Extract content from popup modal"""
        popup_data = {
            'title': '',
            'description': '',
            'tags': [],
            'technique_tags': [],
            'director': '',
            'dop': '',
            'colorist': '',
            'original_source': '',
            'additional_info': ''
        }
        
        try:
            # Wait for popup to be visible with longer timeout for better detection
            popup_selectors = [
                ".grid-popup", ".grid-popup.active", ".popup_click", 
                ".info-popup", ".video-info", ".overlay", "#popup", "#modal",
                ".popup", ".modal", "[role='dialog']", ".video-details",
                ".modal-content", ".popup-content", ".dialog-content",
                ".video-popup", ".clip-popup", ".technique-popup"
            ]
            
            popup_element = None
            # Use longer wait time for better popup detection
            popup_wait = WebDriverWait(self.driver, 2.0)  # Increased from 0.1 to 2 seconds
            
            for selector in popup_selectors:
                try:
                    popup_element = popup_wait.until(
                        EC.visibility_of_element_located((By.CSS_SELECTOR, selector))
                    )
                    self.logger.info(f"Found popup with selector: {selector}")
                    break
                except TimeoutException:
                    continue
            
            # If popup found, wait for content to load (spinner to disappear)
            if popup_element:
                self.logger.info("Waiting for popup content to load...")
                try:
                    # Wait for spinner to disappear or content to appear
                    WebDriverWait(self.driver, 10).until(
                        lambda driver: not driver.find_elements(By.CSS_SELECTOR, ".htmx-indicator") or 
                                      not any(spinner.is_displayed() for spinner in driver.find_elements(By.CSS_SELECTOR, ".htmx-indicator"))
                    )
                    time.sleep(2)  # Additional wait for content to fully render
                    self.logger.info("Popup content loaded")
                except TimeoutException:
                    self.logger.warning("Timeout waiting for popup content to load")
                    time.sleep(3)  # Fallback wait
            
            if not popup_element:
                self.logger.warning("No popup found - video may not have opened a modal")
                # Return empty data instead of using body element
                return popup_data
            
            # Try to extract title from specific element first
            try:
                title_element = popup_element.find_element(By.CSS_SELECTOR, ".title.mt-2")
                popup_data['title'] = title_element.text.strip()
                self.logger.debug(f"Found title: {popup_data['title']}")
            except NoSuchElementException:
                # Try alternative title selectors
                title_selectors = [".title", "h1", "h2", "h3", ".video-title"]
                for selector in title_selectors:
                    try:
                        title_element = popup_element.find_element(By.CSS_SELECTOR, selector)
                        popup_data['title'] = title_element.text.strip()
                        self.logger.debug(f"Found title with selector {selector}: {popup_data['title']}")
                        break
                    except NoSuchElementException:
                        continue
            
            # Extract all text content from popup
            popup_text = popup_element.text
            
            # Parse the popup text to extract structured data
            lines = popup_text.split('\n')
            
            # Look for specific patterns
            for i, line in enumerate(lines):
                line = line.strip()
                
                # Director (also check for Editor as alternative)
                if 'Director -' in line or 'director -' in line.lower():
                    popup_data['director'] = line.split('-', 1)[1].strip()
                elif 'Editor -' in line or 'editor -' in line.lower():
                    popup_data['director'] = line.split('-', 1)[1].strip()  # Use editor as director
                elif line.startswith('Director:') or line.startswith('director:'):
                    popup_data['director'] = line.split(':', 1)[1].strip()
                elif line.startswith('Editor:') or line.startswith('editor:'):
                    popup_data['director'] = line.split(':', 1)[1].strip()
                
                # DOP
                elif 'DOP -' in line or 'dop -' in line.lower():
                    popup_data['dop'] = line.split('-', 1)[1].strip()
                elif line.startswith('DOP:') or line.startswith('dop:'):
                    popup_data['dop'] = line.split(':', 1)[1].strip()
                
                # Colorist
                elif 'Colorist -' in line or 'colorist -' in line.lower():
                    popup_data['colorist'] = line.split('-', 1)[1].strip()
                elif line.startswith('Colorist:') or line.startswith('colorist:'):
                    popup_data['colorist'] = line.split(':', 1)[1].strip()
                
                # Technique tags
                elif 'Technique -' in line or 'technique -' in line.lower():
                    technique_text = line.split('-', 1)[1].strip()
                    popup_data['technique_tags'] = [tag.strip() for tag in technique_text.split(',')]
                
                # Description (usually longer lines) - always update to get the most relevant description
                elif len(line) > 30 and not any(keyword in line.lower() for keyword in ['director', 'dop', 'colorist', 'technique', 'editor', 'original source', 'submit', 'login', 'signup', 'search']):
                    # Take the longest meaningful line as description, or first substantial one
                    if not popup_data['description'] or len(line) > len(popup_data['description']):
                        popup_data['description'] = line
                
                # Tags (uppercase words) - filter out common website navigation
                elif line.isupper() and len(line.split()) <= 5:
                    # Skip common website navigation elements
                    navigation_terms = {'EYECANDY', 'SUBMIT', 'TERMS', 'BADGE', 'RESOURCES', 'LEADERBOARD', 'SEARCH', 'LOGIN', 'SIGNUP'}
                    if line not in navigation_terms:
                        popup_data['tags'].append(line)
            
            # If no description found through text parsing, try alternative methods
            if not popup_data['description']:
                self.logger.warning("No description found through text parsing, trying alternative selectors...")
                
                # Try specific description selectors
                description_selectors = [
                    ".description", ".video-description", ".content", ".info", 
                    "p", ".text", ".details", ".summary", ".about",
                    "[class*='desc']", "[class*='info']", "[class*='content']"
                ]
                
                for selector in description_selectors:
                    try:
                        desc_elements = popup_element.find_elements(By.CSS_SELECTOR, selector)
                        for desc_element in desc_elements:
                            desc_text = desc_element.text.strip()
                            # Look for substantial text that's not navigation
                            if (len(desc_text) > 30 and 
                                not any(nav_term in desc_text.upper() for nav_term in ['SUBMIT', 'LOGIN', 'SIGNUP', 'SEARCH', 'EYECANDY']) and
                                not desc_text.isupper()):
                                popup_data['description'] = desc_text
                                self.logger.info(f"Found description with selector {selector}: {desc_text[:50]}...")
                                break
                        if popup_data['description']:
                            break
                    except Exception:
                        continue
                
                # If still no description, try getting any substantial text from the popup
                if not popup_data['description']:
                    # Look for any text elements with substantial content
                    try:
                        all_text_elements = popup_element.find_elements(By.CSS_SELECTOR, "*")
                        for element in all_text_elements:
                            element_text = element.text.strip()
                            # Check if this element has unique text (not just inherited from parent)
                            if (len(element_text) > 40 and 
                                element_text not in popup_text and  # Not duplicate of full popup text
                                not any(nav_term in element_text.upper() for nav_term in ['SUBMIT', 'LOGIN', 'SIGNUP', 'SEARCH', 'EYECANDY']) and
                                not element_text.isupper() and
                                element_text.count(' ') > 5):  # Has multiple words
                                popup_data['description'] = element_text
                                self.logger.info(f"Found description from element text: {element_text[:50]}...")
                                break
                    except Exception:
                        pass
            
            # Store full popup text as additional info
            popup_data['additional_info'] = popup_text[:1000]  # Limit to first 1000 chars
            
        except Exception as e:
            self.logger.error(f"Error extracting popup content: {e}")
        
        return popup_data
    
    def close_popup(self):
        """Close the popup modal with verification"""
        try:
            # Try multiple methods to close popup (updated with actual website selectors)
            close_selectors = [
                ".close-popup", "#close_me", ".close", ".close-btn", "[aria-label='Close']", ".modal-close",
                "button[type='button']", ".overlay", "#popup", ".popup",
                ".modal-backdrop", "[data-dismiss='modal']", ".fa-times",
                ".fa-close", ".fa-x", "button[title='Close']", ".btn-close",
                ".close-modal", ".close-overlay"
            ]
            
            popup_closed = False
            
            # Try clicking close buttons first
            for selector in close_selectors:
                try:
                    close_elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                    for close_element in close_elements:
                        if close_element.is_displayed():
                            close_element.click()
                            self.logger.debug(f"Closed popup using selector: {selector}")
                            time.sleep(POPUP_CLOSE_DELAY)
                            popup_closed = True
                            break
                    if popup_closed:
                        break
                except Exception:
                    continue
            
            if not popup_closed:
                # Fallback: press ESC key
                from selenium.webdriver.common.keys import Keys
                self.driver.find_element(By.TAG_NAME, "body").send_keys(Keys.ESCAPE)
                self.logger.debug("Closed popup using ESC key")
                time.sleep(POPUP_CLOSE_DELAY)
                
                # Additional fallback: click outside popup area
                try:
                    self.driver.execute_script("document.body.click();")
                    time.sleep(POPUP_CLOSE_DELAY)
                except:
                    pass
            
            # Verify popup is closed by checking if any popup elements are still visible
            popup_selectors = [
                ".info-popup", ".video-info", ".overlay", "#popup", "#modal",
                ".popup", ".modal", "[role='dialog']", ".video-details"
            ]
            
            for selector in popup_selectors:
                try:
                    popup_elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                    for popup_element in popup_elements:
                        if popup_element.is_displayed():
                            self.logger.warning(f"Popup still visible with selector: {selector}")
                            # Try one more ESC press
                            self.driver.find_element(By.TAG_NAME, "body").send_keys(Keys.ESCAPE)
                            time.sleep(POPUP_CLOSE_DELAY)
                            break
                except Exception:
                    continue
            
        except Exception as e:
            self.logger.error(f"Error closing popup: {e}")
            # Force refresh if popup won't close - last resort
            try:
                self.driver.refresh()
                time.sleep(3)
            except:
                pass
    
    def scrape_technique_page(self, technique, max_videos=None):
        """Scrape a single technique page with popup extraction and resume functionality"""
        url = f"{self.base_url}{technique}"
        
        # Initialize selenium driver if not already done
        if not self.driver:
            self.setup_selenium()
        
        # Check if technique should be skipped
        if self.should_skip_technique(technique):
            self.logger.info(f"Skipping already completed technique: {technique}")
            return []
        
        # Get resume index
        resume_index = self.get_resume_video_index(technique)
        if resume_index > 0:
            self.logger.info(f"Resuming technique {technique} from video {resume_index + 1}")
        else:
            self.logger.info(f"Starting technique: {technique} - {url}")
        
        max_retries = 3
        for attempt in range(max_retries):
            try:
                if not self.get_page_with_selenium(url):
                    if attempt < max_retries - 1:
                        self.logger.warning(f"Failed to load page, retrying... ({attempt + 1}/{max_retries})")
                        time.sleep(2)
                        continue
                    return []
                break
            except Exception as e:
                self.logger.error(f"Error loading page (attempt {attempt + 1}): {e}")
                if attempt < max_retries - 1:
                    time.sleep(5)  # Wait longer on error
                    continue
                return []
        
        # Find video elements
        video_elements = self.find_video_elements()
        self.logger.info(f"Found {len(video_elements)} unique video elements for {technique}")
        
        if not video_elements:
            return []
        
        # Process videos (all videos if max_videos is None)
        videos_to_process = video_elements[:max_videos] if max_videos else video_elements
        
        # Resume from specific index
        if resume_index > 0:
            videos_to_process = videos_to_process[resume_index:]
            self.logger.info(f"Resuming from video {resume_index + 1}, processing {len(videos_to_process)} remaining videos")
        else:
            self.logger.info(f"Processing all {len(videos_to_process)} videos")
        
        extracted_videos = []
        
        for i, video_element in enumerate(videos_to_process):
            current_video_index = resume_index + i
            self.logger.info(f"Processing video {current_video_index + 1}/{len(video_elements)} for {technique}")
            
            # Save progress every CHECKPOINT_INTERVAL videos
            if i % CHECKPOINT_INTERVAL == 0:
                self.save_progress(technique, current_video_index)
            
            max_video_retries = 2
            video_data = None
            
            for video_attempt in range(max_video_retries):
                try:
                    video_data = self.click_video_and_extract_popup(video_element)
                    if video_data:
                        video_data['page_url'] = url
                        extracted_videos.append(video_data)
                        self.processed_videos += 1
                        
                        # Save incrementally after each video
                        self.save_technique_data_incremental(technique, extracted_videos)
                    break
                except Exception as e:
                    self.logger.error(f"Error processing video {current_video_index + 1} (attempt {video_attempt + 1}): {e}")
                    if video_attempt < max_video_retries - 1:
                        time.sleep(1)
                        continue
                    self.logger.warning(f"Skipping video {current_video_index + 1} after {max_video_retries} failed attempts")
            
            # Minimal delay between videos for extreme speed
            time.sleep(VIDEO_PROCESSING_DELAY)
        
        # Mark technique as completed and save final data
        self.save_progress(technique, 0, completed=True)
        if extracted_videos:
            # Update final save with completed status
            self.save_technique_data_final(technique, extracted_videos)
        self.logger.info(f"Completed technique {technique}: extracted data from {len(extracted_videos)} videos")
        return extracted_videos
    
    def save_technique_data(self, technique, videos):
        """Save technique data to JSON and CSV files"""
        output_dir = "technique_files"
        os.makedirs(output_dir, exist_ok=True)
        
        # Create JSON file
        json_data = {
            "technique": technique,
            "scrape_info": {
                "timestamp": datetime.now().strftime("%Y%m%d_%H%M%S"),
                "total_videos": len(videos),
                "scraper_type": "comprehensive_popup_modal"
            },
            "videos": videos
        }
        
        json_file = os.path.join(output_dir, f"{technique}.json")
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(json_data, f, indent=2, ensure_ascii=False)
        
        # Create CSV file
        csv_file = os.path.join(output_dir, f"{technique}.csv")
        with open(csv_file, 'w', encoding='utf-8') as f:
            f.write("video_url,alt_text,title,description,director,dop,colorist,tags,technique_tags\n")
            for video in videos:
                # Clean and format fields for CSV
                video_url = video.get('video_url', '').replace('"', '""')
                alt_text = video.get('alt_text', '').replace('"', '""')
                title = video.get('title', '').replace('"', '""')
                description = video.get('description', '').replace('"', '""').replace('\n', ' ')
                director = video.get('director', '').replace('"', '""')
                dop = video.get('dop', '').replace('"', '""')
                colorist = video.get('colorist', '').replace('"', '""')
                
                # Handle arrays
                tags = ' | '.join(video.get('tags', [])).replace('"', '""').replace('\n', ' ')
                technique_tags = ' | '.join(video.get('technique_tags', [])).replace('"', '""')
                
                f.write(f'"{video_url}","{alt_text}","{title}","{description}","{director}","{dop}","{colorist}","{tags}","{technique_tags}"\n')
        
        self.logger.info(f"Saved {len(videos)} videos for {technique} to {json_file} and {csv_file}")
    
    def save_technique_data_incremental(self, technique, videos):
        """Save technique data incrementally in real-time as videos are processed"""
        output_dir = "technique_files"
        os.makedirs(output_dir, exist_ok=True)
        
        # Create JSON file with current videos
        json_data = {
            "technique": technique,
            "scrape_info": {
                "timestamp": datetime.now().strftime("%Y%m%d_%H%M%S"),
                "total_videos": len(videos),
                "scraper_type": "comprehensive_popup_modal",
                "status": "in_progress"
            },
            "videos": videos
        }
        
        json_file = os.path.join(output_dir, f"{technique}.json")
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(json_data, f, indent=2, ensure_ascii=False)
        
        # Create CSV file with current videos
        csv_file = os.path.join(output_dir, f"{technique}.csv")
        with open(csv_file, 'w', encoding='utf-8') as f:
            f.write("video_url,alt_text,title,description,director,dop,colorist,tags,technique_tags\n")
            for video in videos:
                # Clean and format fields for CSV
                video_url = video.get('video_url', '').replace('"', '""')
                alt_text = video.get('alt_text', '').replace('"', '""')
                title = video.get('title', '').replace('"', '""')
                description = video.get('description', '').replace('"', '""').replace('\n', ' ')
                director = video.get('director', '').replace('"', '""')
                dop = video.get('dop', '').replace('"', '""')
                colorist = video.get('colorist', '').replace('"', '""')
                
                # Handle arrays
                tags = ' | '.join(video.get('tags', [])).replace('"', '""').replace('\n', ' ')
                technique_tags = ' | '.join(video.get('technique_tags', [])).replace('"', '""')
                
                f.write(f'"{video_url}","{alt_text}","{title}","{description}","{director}","{dop}","{colorist}","{tags}","{technique_tags}"\n')
    
    def save_technique_data_final(self, technique, videos):
        """Save final technique data with completed status"""
        output_dir = "technique_files"
        os.makedirs(output_dir, exist_ok=True)
        
        # Create JSON file with completed status
        json_data = {
            "technique": technique,
            "scrape_info": {
                "timestamp": datetime.now().strftime("%Y%m%d_%H%M%S"),
                "total_videos": len(videos),
                "scraper_type": "comprehensive_popup_modal",
                "status": "completed"
            },
            "videos": videos
        }
        
        json_file = os.path.join(output_dir, f"{technique}.json")
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(json_data, f, indent=2, ensure_ascii=False)
        
        self.logger.info(f"Final save: {len(videos)} videos for {technique} marked as completed")
    
    def cleanup(self):
        """Clean up resources"""
        if self.driver:
            self.driver.quit()
            self.logger.info("WebDriver closed")

def main():
    scraper = ComprehensivePopupScraper()
    
    try:
        scraper.setup_selenium()
        
        # Get list of techniques to process
        techniques = scraper.get_techniques_list()
        scraper.logger.info(f"Found {len(techniques)} techniques to scrape")
        
        # Filter out already completed techniques
        remaining_techniques = [t for t in techniques if not scraper.should_skip_technique(t)]
        completed_count = len(techniques) - len(remaining_techniques)
        
        if completed_count > 0:
            scraper.logger.info(f"Resuming: {completed_count} techniques already completed, {len(remaining_techniques)} remaining")
        
        total_videos = 0
        start_time = time.time()
        
        # Process each remaining technique
        for i, technique in enumerate(remaining_techniques, 1):
            scraper.logger.info(f"Processing technique {completed_count + i}/{len(techniques)}: {technique}")
            
            max_technique_retries = 3
            videos = None
            
            for attempt in range(max_technique_retries):
                try:
                    videos = scraper.scrape_technique_page(technique, max_videos=None)  # Process ALL videos
                    break
                except Exception as e:
                    scraper.logger.error(f"Error processing technique {technique} (attempt {attempt + 1}): {e}")
                    if attempt < max_technique_retries - 1:
                        scraper.logger.info(f"Retrying technique {technique} in 10 seconds...")
                        time.sleep(10)
                        # Reinitialize selenium if needed
                        try:
                            scraper.cleanup()
                            scraper.setup_selenium()
                        except:
                            pass
                        continue
                    else:
                        scraper.logger.error(f"Failed to process technique {technique} after {max_technique_retries} attempts")
                        videos = []
            
            if videos:
                try:
                    scraper.save_technique_data(technique, videos)
                    total_videos += len(videos)
                    
                    # Performance logging
                    elapsed_time = time.time() - start_time
                    avg_time_per_video = elapsed_time / max(scraper.processed_videos, 1)
                    scraper.logger.info(f"Performance: {scraper.processed_videos} videos processed in {elapsed_time:.1f}s (avg: {avg_time_per_video:.2f}s/video)")
                    
                except Exception as e:
                    scraper.logger.error(f"Error saving data for {technique}: {e}")
            else:
                scraper.logger.warning(f"No videos extracted for {technique}")
            
            # Minimal delay between techniques for extreme speed
            time.sleep(TECHNIQUE_PROCESSING_DELAY)
        
        total_time = time.time() - start_time
        scraper.logger.info(f"COMPLETED! Total videos scraped: {total_videos} in {total_time:.1f} seconds")
        scraper.logger.info(f"Average speed: {total_videos/max(total_time/60, 1):.1f} videos/minute")
        
        # Clean up progress file on successful completion
        try:
            if os.path.exists(PROGRESS_FILE):
                os.remove(PROGRESS_FILE)
                scraper.logger.info("Progress file cleaned up")
        except:
            pass
        
    except KeyboardInterrupt:
        scraper.logger.info("Scraping interrupted by user. Progress has been saved.")
    except Exception as e:
        scraper.logger.error(f"Critical error in main execution: {e}")
        scraper.logger.info("Progress has been saved. You can resume by running the script again.")
    finally:
        scraper.cleanup()

if __name__ == "__main__":
    main()