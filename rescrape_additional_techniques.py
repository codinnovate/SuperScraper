#!/usr/bin/env python3
"""
Script to re-scrape additional empty techniques specified by user.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from main import EyecandyScraper
import json

class AdditionalTechniquesScraper(EyecandyScraper):
    """Scraper targeting additional specific techniques."""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
    def discover_pages(self):
        """Override to target only specific additional techniques."""
        # Additional techniques specified by user
        target_techniques = [
            'wierdcore',
            'wigglegram', 
            'worms-eye',
            'x-ray',
            'zoetrope',
            'zoom-in'
        ]
        
        pages = []
        for technique in target_techniques:
            page_url = f"https://eyecannndy.com/technique/{technique}"
            pages.append(page_url)
        
        return pages

def check_technique_files(techniques):
    """Check current status of technique files."""
    print("📋 Current status of technique files:")
    for technique in techniques:
        json_path = f"technique_files/{technique}.json"
        if os.path.exists(json_path):
            with open(json_path, 'r') as f:
                data = json.load(f)
                video_count = data.get('video_count', 0)
                status = "✅" if video_count > 0 else "❌"
                print(f"  {status} {technique}: {video_count} videos")
        else:
            print(f"  ❌ {technique}: file not found")
    print()

def main():
    """Main function to re-scrape additional techniques."""
    
    # Additional techniques specified by user
    target_techniques = [
        'wierdcore',
        'wigglegram', 
        'worms-eye',
        'x-ray',
        'zoetrope',
        'zoom-in'
    ]
    
    print("🎯 Targeting additional techniques specified by user:")
    for i, technique in enumerate(target_techniques, 1):
        print(f"  {i}. {technique}")
    print()
    
    # Check current status
    check_technique_files(target_techniques)
    
    print(f"🚀 Starting targeted re-scraping for {len(target_techniques)} additional techniques...")
    
    # Initialize and run scraper
    scraper = AdditionalTechniquesScraper()
    scraper.run_scraper(max_pages=len(target_techniques))
    
    print("\n✅ Re-scraping completed for additional techniques!")
    
    print("\n📊 Checking results for targeted techniques...")
    check_technique_files(target_techniques)

if __name__ == "__main__":
    main()