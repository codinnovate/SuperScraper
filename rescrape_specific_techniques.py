#!/usr/bin/env python3
"""
Script to re-scrape only the specific techniques mentioned by the user.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from main import EyecandyScraper
import json
from pathlib import Path
import logging

class TargetedEyecandyScraper(EyecandyScraper):
    """Extended scraper that targets only specific techniques."""
    
    def __init__(self, target_techniques, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.target_techniques = target_techniques
        
    def discover_pages(self):
        """Override to only return pages for target techniques."""
        pages = []
        for technique in self.target_techniques:
            url = f"{self.base_url}/technique/{technique}"
            pages.append(url)
            
        self.logger.info(f"Targeting {len(pages)} specific technique pages for re-scraping")
        return pages

def main():
    """Main function to re-scrape specific techniques mentioned by user."""
    
    # Specific techniques mentioned by the user (expanded to ~12 techniques)
    target_techniques = [
        'transformation',
        'transition', 
        'trucking',
        'typography',
        'tracking',
        'tilt',
        'tilt-shift',
        'zoom-in',
        'wide-shot',
        'whip-pan',
        'stop-motion',
        'slow-motion'
    ]
    
    print(f"🎯 Targeting specific techniques mentioned by user:")
    for i, technique in enumerate(target_techniques, 1):
        print(f"  {i}. {technique}")
    
    print(f"\n🚀 Starting targeted re-scraping for {len(target_techniques)} specific techniques...")
    
    # Initialize targeted scraper
    scraper = TargetedEyecandyScraper(
        target_techniques=target_techniques,
        base_url="https://eyecannndy.com",
        delay=2.0  # Slightly slower to be respectful
    )
    
    # Run scraper for specific techniques only
    scraper.run_scraper()
    
    print(f"\n✅ Re-scraping completed for specific techniques!")
    
    # Check results
    print(f"\n📊 Checking results for targeted techniques...")
    technique_dir = Path("technique_files")
    
    for technique in target_techniques:
        json_file = technique_dir / f"{technique}.json"
        if json_file.exists():
            try:
                with open(json_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                video_count = data.get('video_count', 0)
                print(f"  ✅ {technique}: {video_count} videos")
            except Exception as e:
                print(f"  ❌ {technique}: Error reading file - {e}")
        else:
            print(f"  ❌ {technique}: File not found")

if __name__ == "__main__":
    main()