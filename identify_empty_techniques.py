#!/usr/bin/env python3
"""
Script to identify and list all empty technique files.
"""

import json
import os
from pathlib import Path

def identify_empty_techniques():
    """Identify all technique files with no video data."""
    technique_dir = Path("technique_files")
    
    if not technique_dir.exists():
        print(f"Directory {technique_dir} does not exist")
        return
    
    # Get all JSON files except _summary.json
    json_files = [f for f in technique_dir.glob("*.json") if f.name != "_summary.json"]
    
    empty_techniques = []
    populated_techniques = []
    
    for json_file in json_files:
        technique_name = json_file.stem
        
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            video_count = data.get('video_count', 0)
            
            if video_count == 0:
                empty_techniques.append(technique_name)
            else:
                populated_techniques.append((technique_name, video_count))
                
        except Exception as e:
            print(f"❌ Error reading {json_file.name}: {e}")
    
    print(f"\n📊 TECHNIQUE FILES ANALYSIS")
    print(f"="*50)
    print(f"Total technique files: {len(json_files)}")
    print(f"Empty techniques: {len(empty_techniques)}")
    print(f"Populated techniques: {len(populated_techniques)}")
    
    print(f"\n📋 EMPTY TECHNIQUES ({len(empty_techniques)}):")
    print("-" * 30)
    for i, technique in enumerate(sorted(empty_techniques), 1):
        print(f"{i:2d}. {technique}")
    
    print(f"\n✅ POPULATED TECHNIQUES ({len(populated_techniques)}):")
    print("-" * 40)
    for technique, count in sorted(populated_techniques, key=lambda x: x[1], reverse=True):
        print(f"{technique:20s} - {count:3d} videos")
    
    # Check corresponding CSV files for empty techniques
    print(f"\n📄 CSV FILE STATUS FOR EMPTY TECHNIQUES:")
    print("-" * 45)
    empty_csv_count = 0
    for technique in sorted(empty_techniques):
        csv_file = technique_dir / f"{technique}.csv"
        if csv_file.exists():
            try:
                with open(csv_file, 'r') as f:
                    lines = f.readlines()
                    # Check if CSV has only header or is truly empty
                    if len(lines) <= 1:  # Only header or empty
                        print(f"  {technique:25s} - CSV empty (header only)")
                        empty_csv_count += 1
                    else:
                        print(f"  {technique:25s} - CSV has {len(lines)-1} entries")
            except Exception as e:
                print(f"  {technique:25s} - CSV read error: {e}")
        else:
            print(f"  {technique:25s} - CSV missing")
    
    print(f"\n🔍 SUMMARY:")
    print(f"- {len(empty_techniques)} techniques have no video data")
    print(f"- {empty_csv_count} techniques have empty CSV files")
    print(f"- These techniques may need to be re-scraped or may not exist on the source website")
    
    # Save empty techniques list for potential re-scraping
    empty_list_file = "empty_techniques_list.txt"
    with open(empty_list_file, 'w') as f:
        for technique in sorted(empty_techniques):
            f.write(f"{technique}\n")
    
    print(f"\n💾 Empty techniques list saved to: {empty_list_file}")
    
    return empty_techniques, populated_techniques

if __name__ == "__main__":
    identify_empty_techniques()