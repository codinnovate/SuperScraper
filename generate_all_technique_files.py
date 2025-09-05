#!/usr/bin/env python3
"""
Complete Technique File Generator
Generates separate CSV and JSON files for ALL 136 techniques from main.py.
Creates empty files for techniques without scraped data.
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

# Complete list of all 136 techniques from main.py
ALL_TECHNIQUES = [
    'aerial', 'trip', 'traditional', 'anthropomorphism', 'arc-movement', 'architexture', 
    'bolt-cam', 'boomerang', 'breakdown', 'bullet-time', 'camera-roll', 'central-framing', 
    'choreo', 'cinemagraph', 'close-up', 'collage', 'color-shift', 'conveyor', 
    'crash-transition', 'cut-ins', 'datamosh', 'model', 'distortions', 'dolly-shot', 
    'dolly-zoom', 'double-dolly', 'double-exposure', 'dreamcore', 'duplication', 
    'dutch-angle', 'dystopian', 'echo-printing', 'epiphany-shot', 'falling', 
    'undercranking', 'glitch', 'first-person-pov', 'fisheye', 'fixed-camera', 
    'flash-cut', 'digital-overlay', 'focal-shift', 'fourth-wall', 'fpv-drone', 
    'freeze-frame', 'generative', 'digital-gesture', 'ground-shot', 'halation', 
    'shaky-cam', 'hard-light', 'haze', 'high-angle', 'infinite', 'interview', 
    'jump-cut', 'kaleidoscope', 'lazy-susan', 'floating', 'light-flash', 'locked-on', 
    'low-angle', 'surrealism', 'magnification', 'masking', 'match-cut', 'match-motion', 
    'match-split', 'maximalism', 'mixed-media', 'morphing', 'motion-blur', 
    'night-vision', 'object-portal', 'as-object', 'omnidirectional', 'overhead', 
    'over-the-shoulder', 'pan', 'parallax', 'pass-through', 'pedestal', 
    'photogrammetry', 'photography', 'pixel-art', 'probe-lens', 'product', 
    'profile-shot', 'projections', 'quick-cuts', 'aspect-ratio-switch', 'reflections', 
    'scale-shift', 'screen-in-screen', 'set-transition', 'shadow-box', 'focal-focus', 
    'silhouette', 'slit-scan', 'slow-motion', 'snorricam', 'speed-ramping', 
    'split-diopter', 'split-screen', 'spotlight', 'step-printing', 'stop-motion', 
    'stutter', 'stylistic-suck', 'tableau-shots', 'thermal', 'tilt', 'tilt-shift', 
    'tracking', 'transformation', 'transition', 'trucking', 'two-shot', 'typography', 
    'ultra-wide-zero-d', 'underwater', 'video-game', 'video-portraits', 'vignette', 
    'vhs', 'void', 'voyeur', 'wandering', 'wierdcore', 'whip-pan', 'wide-shot', 
    'wigglegram', 'worms-eye', 'x-ray', 'zoetrope', 'zoom-in'
]

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
        logger.warning(f"Data directory {data_dir} not found, will create empty files")
        return {'videos': []}
    
    # Find the latest eyecandy_videos JSON file
    json_files = list(data_path.glob("eyecandy_videos_*.json"))
    if not json_files:
        logger.warning("No eyecandy_videos JSON files found, will create empty files")
        return {'videos': []}
    
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
        if technique in ALL_TECHNIQUES:
            technique_videos[technique].append(video)
    
    return dict(technique_videos)

def load_technique_links(links_file: str = "discovered_technique_links.json") -> dict:
    """
    Load technique links with display text and URLs.
    
    Returns:
        Dictionary mapping technique names to their metadata
    """
    try:
        with open(links_file, 'r', encoding='utf-8') as f:
            links_data = json.load(f)
        
        # Convert list to dictionary keyed by technique name
        technique_links = {}
        sub_categories = {}
        
        for link in links_data:
            technique_name = link.get('name', '')
            if technique_name:
                # Handle sub-categories (techniques with # in name)
                if '#' in technique_name:
                    base_technique, sub_category = technique_name.split('#', 1)
                    if base_technique not in sub_categories:
                        sub_categories[base_technique] = {}
                    # Use dictionary to automatically deduplicate by sub_category name
                    sub_categories[base_technique][sub_category] = {
                        'name': sub_category,
                        'url': link.get('url', ''),
                        'text': link.get('text', sub_category.replace('-', ' ').title())
                    }
                else:
                    technique_links[technique_name] = {
                        'display_text': link.get('text', technique_name),
                        'url': link.get('url', f'https://eyecannndy.com/technique/{technique_name}'),
                        'name': technique_name
                    }
        
        # Add sub-categories to their parent techniques
        for base_technique, subs in sub_categories.items():
            if base_technique in technique_links:
                # Convert dictionary values to list to maintain original structure
                technique_links[base_technique]['sub_categories'] = list(subs.values())
        
        logger.info(f"Loaded {len(technique_links)} technique links with {len(sub_categories)} having sub-categories")
        return technique_links
    except FileNotFoundError:
        logger.warning(f"Technique links file {links_file} not found. Using default URLs.")
        return {}
    except Exception as e:
        logger.error(f"Error loading technique links: {e}")
        return {}

def generate_all_technique_files(output_dir: str = "technique_files"):
    """
    Generate separate CSV and JSON files for ALL 136 techniques.
    Creates empty files for techniques without scraped data.
    """
    # Create output directory
    output_path = Path(output_dir)
    output_path.mkdir(exist_ok=True)
    
    # Load metadata
    metadata = load_latest_metadata()
    
    # Group existing videos by technique
    existing_technique_videos = group_videos_by_technique(metadata)
    
    # Load technique links with display text and URLs
    technique_links = load_technique_links()
    
    logger.info(f"Found existing data for {len(existing_technique_videos)} techniques")
    logger.info(f"Will generate files for all {len(ALL_TECHNIQUES)} techniques")
    
    total_videos = 0
    techniques_with_data = 0
    techniques_without_data = 0
    
    # Generate files for ALL techniques
    for technique in ALL_TECHNIQUES:
        videos = existing_technique_videos.get(technique, [])
        sanitized_name = sanitize_filename(technique)
        
        if videos:
            logger.info(f"Processing {technique} ({sanitized_name}): {len(videos)} videos")
            techniques_with_data += 1
            total_videos += len(videos)
        else:
            logger.info(f"Creating empty files for {technique} ({sanitized_name}): 0 videos")
            techniques_without_data += 1
        
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
    
    # Generate summary file
    summary_file = output_path / "_summary.json"
    summary_data = {
        "generated_at": datetime.now().isoformat(),
        "total_techniques": len(ALL_TECHNIQUES),
        "techniques_with_data": techniques_with_data,
        "techniques_without_data": techniques_without_data,
        "total_videos": total_videos,
        "techniques": {
            technique: {
                "video_count": len(existing_technique_videos.get(technique, [])),
                "sanitized_name": sanitize_filename(technique),
                "has_data": technique in existing_technique_videos,
                "display_text": technique_links.get(technique, {}).get('display_text', technique.replace('-', ' ').title()),
                "url": technique_links.get(technique, {}).get('url', f'https://eyecannndy.com/technique/{technique}'),
                "sub_categories": technique_links.get(technique, {}).get('sub_categories', [])
            }
            for technique in ALL_TECHNIQUES
        }
    }
    
    with open(summary_file, 'w', encoding='utf-8') as f:
        json.dump(summary_data, f, indent=2, ensure_ascii=False)
    
    logger.info(f"Generated summary: {summary_file.name}")
    logger.info(f"All files saved to: {output_path.absolute()}")
    
    print(f"\n=== GENERATION SUMMARY ===")
    print(f"Total techniques: {len(ALL_TECHNIQUES)}")
    print(f"Techniques with data: {techniques_with_data}")
    print(f"Techniques without data: {techniques_without_data}")
    print(f"Total videos: {total_videos}")
    print(f"Files generated: {len(ALL_TECHNIQUES) * 2} ({len(ALL_TECHNIQUES)} CSV + {len(ALL_TECHNIQUES)} JSON)")

if __name__ == "__main__":
    print("Complete Technique File Generator")
    print("=" * 40)
    print(f"Generating files for all {len(ALL_TECHNIQUES)} techniques...")
    
    try:
        generate_all_technique_files()
        print("\n✅ Successfully generated all technique files!")
    except Exception as e:
        logger.error(f"Error generating technique files: {e}")
        print(f"\n❌ Error: {e}")