#!/usr/bin/env python3
"""
Deduplicate videos within each technique while preserving videos that appear across different techniques.
This script removes duplicate video URLs within the same technique's CSV and JSON files.
"""

import json
import csv
import os
from collections import defaultdict

def deduplicate_technique_files(technique_files_dir):
    """
    Remove duplicates within each technique's files while keeping cross-technique videos.
    """
    if not os.path.exists(technique_files_dir):
        print(f"Directory {technique_files_dir} does not exist")
        return
    
    # Get all technique names (excluding _summary)
    techniques = set()
    for filename in os.listdir(technique_files_dir):
        if filename.endswith('.csv') and not filename.startswith('_'):
            technique = filename[:-4]  # Remove .csv extension
            techniques.add(technique)
    
    print(f"Found {len(techniques)} techniques to process")
    
    stats = {
        'techniques_processed': 0,
        'total_duplicates_removed': 0,
        'technique_stats': {}
    }
    
    for technique in sorted(techniques):
        csv_file = os.path.join(technique_files_dir, f"{technique}.csv")
        json_file = os.path.join(technique_files_dir, f"{technique}.json")
        
        if not os.path.exists(csv_file) or not os.path.exists(json_file):
            print(f"Missing files for technique: {technique}")
            continue
        
        print(f"\nProcessing technique: {technique}")
        
        # Read CSV file and remove duplicates
        unique_urls = set()
        csv_rows = []
        
        with open(csv_file, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            header = next(reader, None)
            if header:
                csv_rows.append(header)
            
            original_count = 0
            for row in reader:
                original_count += 1
                if row and row[0] not in unique_urls:
                    unique_urls.add(row[0])
                    csv_rows.append(row)
        
        # Read JSON file and remove duplicates
        with open(json_file, 'r', encoding='utf-8') as f:
            json_data = json.load(f)
        
        # Handle nested structure with 'videos' array
        if 'videos' in json_data:
            videos_list = json_data['videos']
        else:
            videos_list = json_data if isinstance(json_data, list) else []
        
        unique_json_entries = []
        seen_urls = set()
        
        for entry in videos_list:
            video_url = entry.get('video_url', '')
            if video_url and video_url not in seen_urls:
                seen_urls.add(video_url)
                unique_json_entries.append(entry)
        
        # Calculate duplicates removed
        csv_duplicates = original_count - (len(csv_rows) - 1)  # -1 for header
        original_json_count = len(videos_list) if videos_list else 0
        json_duplicates = original_json_count - len(unique_json_entries)
        
        # Write back deduplicated CSV
        with open(csv_file, 'w', encoding='utf-8', newline='') as f:
            writer = csv.writer(f)
            writer.writerows(csv_rows)
        
        # Write back deduplicated JSON with original structure
        if 'videos' in json_data:
            json_data['videos'] = unique_json_entries
            json_data['video_count'] = len(unique_json_entries)
            final_json_data = json_data
        else:
            final_json_data = unique_json_entries
        
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(final_json_data, f, indent=2, ensure_ascii=False)
        
        # Update stats
        technique_duplicates = max(csv_duplicates, json_duplicates)
        stats['technique_stats'][technique] = {
            'original_count': original_json_count,
            'final_count': len(unique_json_entries),
            'duplicates_removed': technique_duplicates
        }
        stats['total_duplicates_removed'] += technique_duplicates
        stats['techniques_processed'] += 1
        
        print(f"  Original: {original_json_count} videos")
        print(f"  Final: {len(unique_json_entries)} videos")
        print(f"  Duplicates removed: {technique_duplicates}")
    
    # Update summary file
    summary_file = os.path.join(technique_files_dir, '_summary.json')
    if os.path.exists(summary_file):
        with open(summary_file, 'r', encoding='utf-8') as f:
            summary = json.load(f)
        
        # Update summary with new counts
        total_videos = 0
        for technique, technique_stats in stats['technique_stats'].items():
            if technique in summary['techniques']:
                summary['techniques'][technique] = technique_stats['final_count']
                total_videos += technique_stats['final_count']
        
        summary['total_videos'] = total_videos
        summary['deduplication_stats'] = {
            'total_duplicates_removed': stats['total_duplicates_removed'],
            'techniques_processed': stats['techniques_processed']
        }
        
        with open(summary_file, 'w', encoding='utf-8') as f:
            json.dump(summary, f, indent=2, ensure_ascii=False)
        
        print(f"\nUpdated summary file: {summary_file}")
    
    print(f"\n=== DEDUPLICATION SUMMARY ===")
    print(f"Techniques processed: {stats['techniques_processed']}")
    print(f"Total duplicates removed: {stats['total_duplicates_removed']}")
    print(f"\nNote: Videos appearing in multiple techniques are preserved.")
    
    return stats

if __name__ == "__main__":
    technique_files_dir = "technique_files"
    
    print("Starting deduplication within techniques...")
    print("This will remove duplicate URLs within each technique while preserving cross-technique videos.")
    
    stats = deduplicate_technique_files(technique_files_dir)
    
    if stats:
        print("\nDeduplication completed successfully!")
    else:
        print("\nDeduplication failed or no files to process.")