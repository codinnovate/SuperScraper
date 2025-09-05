#!/usr/bin/env python3
"""
Technique File Generator
Generates separate CSV and JSON files for each technique from scraped metadata.

CSV files contain only video URLs.
JSON files contain complete metadata.
"""

import os
import json
import csv
from pathlib import Path
from collections import defaultdict
from urllib.parse import urlparse
import logging
from datetime import datetime

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def extract_technique_from_url(page_url: str) -> str:
    """
    Extract technique name from page URL.
    Example: https://eyecannndy.com/technique/aerial -> aerial
    """
    try:
        path = urlparse(page_url).path
        if '/technique/' in path:
            return path.split('/technique/')[-1].strip('/')
        return 'unknown'
    except Exception:
        return 'unknown'

def sanitize_filename(name: str) -> str:
    """
    Sanitize technique name for use as filename.
    """
    # Replace problematic characters
    sanitized = name.replace('#', '_').replace('/', '_').replace('\\', '_')
    sanitized = ''.join(c for c in sanitized if c.isalnum() or c in '-_.')
    return sanitized or 'unknown'

def load_latest_metadata(data_dir: str = "data") -> dict:
    """
    Load the latest metadata JSON file.
    """
    data_path = Path(data_dir)
    if not data_path.exists():
        raise FileNotFoundError(f"Data directory {data_dir} not found")
    
    # Find the latest eyecandy_videos JSON file
    json_files = list(data_path.glob("eyecandy_videos_*.json"))
    if not json_files:
        raise FileNotFoundError("No eyecandy_videos JSON files found")
    
    latest_file = max(json_files, key=lambda f: f.stat().st_mtime)
    logger.info(f"Loading metadata from: {latest_file}")
    
    with open(latest_file, 'r', encoding='utf-8') as f:
        return json.load(f)

def group_videos_by_technique(metadata: dict) -> dict:
    """
    Group videos by technique name.
    """
    technique_videos = defaultdict(list)
    
    for video in metadata.get('videos', []):
        page_url = video.get('page_url', '')
        technique = extract_technique_from_url(page_url)
        technique_videos[technique].append(video)
    
    return dict(technique_videos)

def generate_technique_files(output_dir: str = "technique_files"):
    """
    Generate separate CSV and JSON files for each technique.
    """
    # Create output directory
    output_path = Path(output_dir)
    output_path.mkdir(exist_ok=True)
    
    # Load metadata
    try:
        metadata = load_latest_metadata()
    except FileNotFoundError as e:
        logger.error(f"Error loading metadata: {e}")
        return
    
    # Group videos by technique
    technique_videos = group_videos_by_technique(metadata)
    
    logger.info(f"Found {len(technique_videos)} techniques")
    logger.info(f"Total videos: {sum(len(videos) for videos in technique_videos.values())}")
    
    # Generate files for each technique
    for technique, videos in technique_videos.items():
        if not videos:
            continue
            
        sanitized_name = sanitize_filename(technique)
        logger.info(f"Processing {technique} ({sanitized_name}): {len(videos)} videos")
        
        # Generate JSON file with complete metadata
        json_file = output_path / f"{sanitized_name}.json"
        json_data = {
            "technique": technique,
            "video_count": len(videos),
            "generated_at": datetime.now().isoformat(),
            "videos": videos
        }
        
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(json_data, f, indent=2, ensure_ascii=False)
        
        # Generate CSV file with only video URLs
        csv_file = output_path / f"{sanitized_name}.csv"
        with open(csv_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['video_url'])  # Header
            
            for video in videos:
                video_url = video.get('video_url', '')
                if video_url:
                    writer.writerow([video_url])
        
        logger.info(f"Generated: {json_file.name} and {csv_file.name}")
    
    # Generate summary file
    summary_file = output_path / "_summary.json"
    summary_data = {
        "generated_at": datetime.now().isoformat(),
        "total_techniques": len(technique_videos),
        "total_videos": sum(len(videos) for videos in technique_videos.values()),
        "techniques": {
            technique: {
                "video_count": len(videos),
                "sanitized_name": sanitize_filename(technique)
            }
            for technique, videos in technique_videos.items()
        }
    }
    
    with open(summary_file, 'w', encoding='utf-8') as f:
        json.dump(summary_data, f, indent=2, ensure_ascii=False)
    
    logger.info(f"Generated summary: {summary_file.name}")
    logger.info(f"All files saved to: {output_path.absolute()}")

if __name__ == "__main__":
    print("Technique File Generator")
    print("=" * 30)
    
    try:
        generate_technique_files()
        print("\n✅ Successfully generated technique files!")
    except Exception as e:
        logger.error(f"Error generating technique files: {e}")
        print(f"\n❌ Error: {e}")