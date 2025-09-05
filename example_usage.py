#!/usr/bin/env python3
"""
Example Usage Scripts for SuperScraper - Eyecandy.com WebP Video Scraper

This file demonstrates different ways to use the EyecandyScraper class.
"""

from main import EyecandyScraper
import json


def basic_scraping_example():
    """
    Basic example: Scrape a limited number of pages.
    """
    print("=== Basic Scraping Example ===")
    
    # Initialize scraper with default settings
    scraper = EyecandyScraper()
    
    # Run scraper with a limit of 10 pages for quick testing
    scraper.run_scraper(max_pages=10)
    
    print(f"Found {len(scraper.videos_data)} WebP videos")
    print(f"Categories: {', '.join(scraper.categories)}")


def custom_configuration_example():
    """
    Example with custom configuration for slower, more thorough scraping.
    """
    print("\n=== Custom Configuration Example ===")
    
    # Initialize with custom settings
    scraper = EyecandyScraper(
        base_url="https://eyecannndy.zip",
        delay=2.0  # 2 second delay for more respectful scraping
    )
    
    # Run scraper with a limit of 5 pages
    scraper.run_scraper(max_pages=5)
    
    print(f"Found {len(scraper.videos_data)} WebP videos")
    print(f"Categories: {', '.join(scraper.categories)}")


def analyze_results_example():
    """
    Example of analyzing scraped results.
    """
    print("\n=== Results Analysis Example ===")
    
    # Load the most recent results
    try:
        import os
        import glob
        
        # Find the most recent JSON file
        json_files = glob.glob("data/eyecandy_videos_*.json")
        if not json_files:
            print("No data files found. Run the scraper first.")
            return
        
        latest_file = max(json_files, key=os.path.getctime)
        
        with open(latest_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print(f"Analyzing data from: {latest_file}")
        print(f"Total videos: {data['scrape_info']['total_videos']}")
        print(f"Categories found: {len(data['scrape_info']['categories'])}")
        
        if data['videos']:
            print("\nSample video data:")
            sample_video = data['videos'][0]
            print(f"  Title: {sample_video['title']}")
            print(f"  URL: {sample_video['video_url']}")
            print(f"  Category: {sample_video['category']}")
            print(f"  Page: {sample_video['page_url']}")
            
            # Analyze video sources
            domains = set()
            for video in data['videos']:
                from urllib.parse import urlparse
                domain = urlparse(video['video_url']).netloc
                domains.add(domain)
            
            print(f"\nVideo sources: {', '.join(domains)}")
        
    except Exception as e:
        print(f"Error analyzing results: {e}")


def targeted_scraping_example():
    """
    Example of scraping specific pages or categories.
    """
    print("\n=== Targeted Scraping Example ===")
    
    scraper = EyecandyScraper(delay=1.5)
    
    # You could modify this to target specific URLs
    # For demonstration, we'll just run a small scrape
    scraper.run_scraper(max_pages=3)
    
    # Filter results by category if needed
    if scraper.videos_data:
        categories = {}
        for video in scraper.videos_data:
            category = video['category']
            if category not in categories:
                categories[category] = []
            categories[category].append(video)
        
        print("Videos by category:")
        for category, videos in categories.items():
            print(f"  {category}: {len(videos)} videos")


def main():
    """
    Run all examples.
    """
    print("SuperScraper - Example Usage Demonstrations")
    print("=" * 50)
    
    # Run basic example
    basic_scraping_example()
    
    # Analyze any existing results
    analyze_results_example()
    
    # Run custom configuration example
    custom_configuration_example()
    
    # Run targeted scraping example
    targeted_scraping_example()
    
    print("\n=== All Examples Completed ===")
    print("Check the 'data/' directory for output files.")


if __name__ == "__main__":
    main()