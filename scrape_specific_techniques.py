#!/usr/bin/env python3
"""
Script to scrape specific techniques: transition, typography, and zoom-in
"""

import os
import sys
import json
import time
from comprehensive_popup_scraper import ComprehensivePopupScraper

# Configuration
MAX_VIDEOS_PER_TECHNIQUE = None  # No limit - scrape all available videos
TECHNIQUES_TO_SCRAPE = ['transition', 'typography', 'zoom-in']

def scrape_specific_techniques(techniques):
    """Scrape the specified techniques."""
    print(f"Starting to scrape {len(techniques)} specific techniques...")
    
    # Initialize scraper
    scraper = ComprehensivePopupScraper()
    
    # Load existing progress to avoid conflicts
    progress_file = 'production_progress.json'
    if os.path.exists(progress_file):
        with open(progress_file, 'r') as f:
            progress = json.load(f)
    else:
        progress = {}
    
    for i, technique in enumerate(techniques, 1):
        print(f"\n[{i}/{len(techniques)}] Scraping technique: {technique}")
        
        try:
            # Temporarily remove from progress to force re-scraping
            if technique in progress:
                print(f"Removing {technique} from progress to force re-scraping")
                del progress[technique]
                
                # Save updated progress
                with open(progress_file, 'w') as f:
                    json.dump(progress, f, indent=2)
            
            # Set max_videos based on configuration
            max_videos = MAX_VIDEOS_PER_TECHNIQUE
            if max_videos is None:
                print(f"Scraping all available videos for {technique}")
            else:
                print(f"Scraping up to {max_videos} videos for {technique}")
            
            # Scrape the technique
            videos = scraper.scrape_technique_page(technique, max_videos=max_videos)
            
            if videos:
                # Count videos with and without descriptions
                with_desc = sum(1 for v in videos if v.get('description'))
                without_desc = len(videos) - with_desc
                
                print(f"Successfully scraped {len(videos)} videos for {technique}")
                print(f"  - With descriptions: {with_desc}")
                print(f"  - Without descriptions: {without_desc}")
                
                # Save to technique file
                technique_file = f"technique_files/{technique}.json"
                os.makedirs('technique_files', exist_ok=True)
                
                technique_data = {
                    'technique': technique,
                    'total_videos': len(videos),
                    'videos': videos,
                    'scraped_at': time.strftime('%Y-%m-%d %H:%M:%S')
                }
                
                with open(technique_file, 'w') as f:
                    json.dump(technique_data, f, indent=2)
                
                print(f"Saved {len(videos)} videos to {technique_file}")
                
            else:
                print(f"No videos found for {technique}")
                
        except Exception as e:
            print(f"Error scraping {technique}: {e}")
            continue
        
        # Add delay between techniques
        if i < len(techniques):
            print("Waiting 3 seconds before next technique...")
            time.sleep(3)
    
    # Close scraper
    try:
        scraper.close()
    except:
        pass
    
    print("\nScraping completed!")

def main():
    """Main function."""
    print("Specific Technique Scraper")
    print("=" * 50)
    
    techniques = TECHNIQUES_TO_SCRAPE
    print(f"Techniques to scrape: {', '.join(techniques)}")
    
    # Confirm with user
    response = input(f"\nProceed to scrape {len(techniques)} techniques? (y/n): ")
    if response.lower() != 'y':
        print("Scraping cancelled.")
        return
    
    scrape_specific_techniques(techniques)

if __name__ == "__main__":
    main()