#!/usr/bin/env python3
"""
Example usage of SuperScaper with custom headers for different devices.

This demonstrates how to customize User-Agent and other headers to match
your specific device/browser for better scraping compatibility.
"""

from main import EyecandyScraper
from video_downloader import VideoDownloader

# Example 1: Windows Chrome user
windows_chrome_headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1'
}

# Example 2: iPhone Safari user
iphone_safari_headers = {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1'
}

# Example 3: Android Chrome user
android_chrome_headers = {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1'
}

# Example 4: Firefox on Windows
firefox_headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1'
}

def main():
    """Demonstrate custom header usage."""
    
    print("SuperScaper Custom Headers Examples")
    print("===================================\n")
    
    # Example 1: Using default headers (Mac Chrome)
    print("1. Using default headers (Mac Chrome):")
    scraper_default = EyecandyScraper(delay=2.0)
    print(f"   User-Agent: {scraper_default.session.headers['User-Agent']}\n")
    
    # Example 2: Using Windows Chrome headers
    print("2. Using Windows Chrome headers:")
    scraper_windows = EyecandyScraper(delay=2.0, custom_headers=windows_chrome_headers)
    print(f"   User-Agent: {scraper_windows.session.headers['User-Agent']}\n")
    
    # Example 3: Using iPhone Safari headers
    print("3. Using iPhone Safari headers:")
    scraper_iphone = EyecandyScraper(delay=2.0, custom_headers=iphone_safari_headers)
    print(f"   User-Agent: {scraper_iphone.session.headers['User-Agent']}\n")
    
    # Example 4: Using Android Chrome headers
    print("4. Using Android Chrome headers:")
    scraper_android = EyecandyScraper(delay=2.0, custom_headers=android_chrome_headers)
    print(f"   User-Agent: {scraper_android.session.headers['User-Agent']}\n")
    
    # Example 5: Using Firefox headers
    print("5. Using Firefox headers:")
    scraper_firefox = EyecandyScraper(delay=2.0, custom_headers=firefox_headers)
    print(f"   User-Agent: {scraper_firefox.session.headers['User-Agent']}\n")
    
    print("To use any of these configurations, simply pass the headers dictionary")
    print("to the EyecandyScraper or VideoDownloader constructor as the 'custom_headers' parameter.")
    print("\nExample usage for scraping:")
    print("scraper = EyecandyScraper(custom_headers=windows_chrome_headers)")
    print("scraper.run_scraper(max_pages=5)")
    print("\nExample usage for downloading:")
    print("downloader = VideoDownloader(custom_headers=android_chrome_headers)")
    print("downloader.download_all_videos('data/videos_metadata.json', max_videos=100)")

if __name__ == "__main__":
    main()