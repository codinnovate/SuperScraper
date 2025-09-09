#!/usr/bin/env python3
"""
Script to populate individual technique CSV and JSON files from scraped data.
"""

import json
import csv
import os
from datetime import datetime
from collections import defaultdict

def load_latest_scraped_data():
    """Load the most recent scraped data file."""
    data_dir = 'data'
    json_files = [f for f in os.listdir(data_dir) if f.startswith('eyecandy_videos_') and f.endswith('.json')]
    
    if not json_files:
        print("❌ No scraped data files found!")
        return None
    
    # Get the latest file
    latest_file = sorted(json_files)[-1]
    file_path = os.path.join(data_dir, latest_file)
    
    print(f"📂 Loading data from: {latest_file}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def extract_technique_from_url(page_url):
    """Extract technique name from page URL."""
    # URL format: https://eyecannndy.com/technique/transformation
    if '/technique/' in page_url:
        return page_url.split('/technique/')[-1]
    return None

def group_videos_by_technique(data):
    """Group videos by technique."""
    technique_videos = defaultdict(list)
    
    for video in data['videos']:
        technique = extract_technique_from_url(video['page_url'])
        if technique:
            technique_videos[technique].append(video)
    
    return technique_videos

def update_technique_files(technique_videos):
    """Update individual technique CSV and JSON files."""
    technique_files_dir = 'technique_files'
    
    if not os.path.exists(technique_files_dir):
        os.makedirs(technique_files_dir)
    
    updated_count = 0
    
    for technique, videos in technique_videos.items():
        # Update CSV file
        csv_path = os.path.join(technique_files_dir, f'{technique}.csv')
        with open(csv_path, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(['video_url'])  # Header
            for video in videos:
                writer.writerow([video['video_url']])
        
        # Update JSON file
        json_data = {
            "technique": technique,
            "video_count": len(videos),
            "generated_at": datetime.now().isoformat(),
            "videos": videos
        }
        
        json_path = os.path.join(technique_files_dir, f'{technique}.json')
        with open(json_path, 'w', encoding='utf-8') as jsonfile:
            json.dump(json_data, jsonfile, indent=2, ensure_ascii=False)
        
        print(f"  ✅ {technique}: {len(videos)} videos")
        updated_count += 1
    
    return updated_count

def main():
    """Main function to populate technique files from scraped data."""
    print("🔄 Populating technique files from scraped data...\n")
    
    # Load scraped data
    data = load_latest_scraped_data()
    if not data:
        return
    
    print(f"📊 Total videos in dataset: {data['scrape_info']['total_videos']}\n")
    
    # Group videos by technique
    technique_videos = group_videos_by_technique(data)
    
    print(f"🎯 Found {len(technique_videos)} techniques:\n")
    
    # Update technique files
    updated_count = update_technique_files(technique_videos)
    
    print(f"\n✅ Successfully updated {updated_count} technique files!")
    
    # Show summary
    print("\n📋 Summary:")
    for technique, videos in sorted(technique_videos.items()):
        print(f"  • {technique}: {len(videos)} videos")

if __name__ == "__main__":
    main()