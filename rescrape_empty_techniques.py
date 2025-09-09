#!/usr/bin/env python3
"""
Script to re-scrape only the empty technique files.
This will target the 86 techniques that currently have no video data.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from main import EyecandyScraper
import json
from pathlib import Path
import logging

def get_empty_techniques():
    """Get list of techniques that have no video data."""
    technique_dir = Path("technique_files")
    empty_techniques = []
    
    if not technique_dir.exists():
        print(f"Directory {technique_dir} does not exist")
        return empty_techniques
    
    # Get all JSON files except _summary.json
    json_files = [f for f in technique_dir.glob("*.json") if f.name != "_summary.json"]
    
    for json_file in json_files:
        technique_name = json_file.stem
        
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            video_count = data.get('video_count', 0)
            
            if video_count == 0:
                empty_techniques.append(technique_name)
                
        except Exception as e:
            print(f"❌ Error reading {json_file.name}: {e}")
            empty_techniques.append(technique_name)  # Include problematic files
    
    return sorted(empty_techniques)

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
            
        self.logger.info(f"Targeting {len(pages)} empty technique pages for re-scraping")
        return pages

def main():
    """Main function to re-scrape empty techniques."""
    print("🔍 Identifying empty techniques...")
    empty_techniques = get_empty_techniques()
    
    if not empty_techniques:
        print("✅ No empty techniques found! All techniques have video data.")
        return
    
    print(f"\n📋 Found {len(empty_techniques)} empty techniques:")
    for i, technique in enumerate(empty_techniques[:10], 1):  # Show first 10
        print(f"  {i:2d}. {technique}")
    
    if len(empty_techniques) > 10:
        print(f"  ... and {len(empty_techniques) - 10} more")
    
    print(f"\n🚀 Starting targeted re-scraping for {len(empty_techniques)} techniques...")
    
    # Initialize targeted scraper
    scraper = TargetedEyecandyScraper(
        target_techniques=empty_techniques,
        base_url="https://eyecannndy.com",
        delay=2.0  # Slightly slower to be respectful
    )
    
    # Run scraper for empty techniques only
    scraper.run_scraper()
    
    print(f"\n✅ Re-scraping completed!")
    
    # Check results
    print("\n📊 Checking results...")
    still_empty = get_empty_techniques()
    
    populated_count = len(empty_techniques) - len(still_empty)
    
    print(f"\n📈 RESULTS:")
    print(f"- Originally empty: {len(empty_techniques)} techniques")
    print(f"- Successfully populated: {populated_count} techniques")
    print(f"- Still empty: {len(still_empty)} techniques")
    
    if still_empty:
        print(f"\n❌ Techniques that are still empty:")
        for technique in still_empty[:20]:  # Show first 20
            print(f"  - {technique}")
        if len(still_empty) > 20:
            print(f"  ... and {len(still_empty) - 20} more")
        
        print(f"\n💡 These techniques may not exist on the source website or may have been removed.")
    else:
        print(f"\n🎉 All techniques now have video data!")

if __name__ == "__main__":
    main()