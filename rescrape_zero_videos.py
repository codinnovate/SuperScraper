#!/usr/bin/env python3
"""
Script to automatically re-scrape techniques that had zero videos in the previous scraping run.
Reads the scraping summary JSON file and re-scrapes all techniques with 'no_videos' status.
"""

# Configuration: Set the maximum number of videos to scrape per technique
# Options: 'full' (all videos), or a specific number like 30, 40, etc.
MAX_VIDEOS_PER_TECHNIQUE = 30  # Change to 30, 40, or any number to limit videos

import json
import sys
import os
from comprehensive_popup_scraper import ComprehensivePopupScraper

def load_scraping_summary(summary_file):
    """Load the scraping summary JSON file."""
    try:
        with open(summary_file, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: Summary file '{summary_file}' not found.")
        return None
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON in '{summary_file}'.")
        return None

def get_zero_video_techniques_from_files():
    """Find techniques that have zero videos by comparing discovered techniques with existing files."""
    zero_video_techniques = []
    
    # Load discovered techniques
    discovered_file = 'discovered_techniques.json'
    if not os.path.exists(discovered_file):
        print(f"Error: '{discovered_file}' not found.")
        return []
    
    try:
        with open(discovered_file, 'r') as f:
            discovered_data = json.load(f)
    except Exception as e:
        print(f"Error reading {discovered_file}: {e}")
        return []
    
    # Get all discovered technique names
    discovered_techniques = set()
    for technique in discovered_data.get('techniques', []):
        technique_name = technique.get('name')
        if technique_name:
            discovered_techniques.add(technique_name)
    
    # Get existing technique files
    technique_files_dir = 'technique_files'
    existing_techniques = set()
    
    if os.path.exists(technique_files_dir):
        json_files = [f for f in os.listdir(technique_files_dir) if f.endswith('.json')]
        for json_file in json_files:
            technique_name = json_file.replace('.json', '')
            existing_techniques.add(technique_name)
    
    # Find techniques that were discovered but don't have files (zero videos)
    zero_video_techniques = list(discovered_techniques - existing_techniques)
    
    # Also check existing files for empty videos arrays
    for technique_name in existing_techniques:
        file_path = os.path.join(technique_files_dir, f"{technique_name}.json")
        try:
            with open(file_path, 'r') as f:
                data = json.load(f)
            
            # Check if videos array exists and has content
            videos = data.get('videos', [])
            if len(videos) == 0:
                zero_video_techniques.append(technique_name)
                
        except Exception as e:
            print(f"Warning: Could not read {technique_name}.json: {e}")
            continue
    
    # Sort in reverse alphabetical order (Z to A) to start from the end
    zero_video_techniques.sort(reverse=True)
    
    return zero_video_techniques

def rescrape_techniques(techniques):
    """Re-scrape the specified techniques."""
    if not techniques:
        print("No techniques with zero videos found.")
        return
    
    print(f"Found {len(techniques)} techniques with zero videos:")
    for i, technique in enumerate(techniques, 1):
        print(f"  {i}. {technique}")
    
    print(f"\nStarting re-scraping process...")
    if MAX_VIDEOS_PER_TECHNIQUE == 'full':
        print("Configuration: Scraping ALL videos per technique")
    else:
        print(f"Configuration: Limiting to {MAX_VIDEOS_PER_TECHNIQUE} videos per technique")
    
    # Initialize the scraper
    scraper = ComprehensivePopupScraper()
    scraper.setup_selenium()
    scraper.setup_logging()
    
    # Load progress data
    progress_file = 'production_progress.json'
    original_progress = {}
    if os.path.exists(progress_file):
        try:
            with open(progress_file, 'r') as f:
                original_progress = json.load(f)
        except:
            original_progress = {}
    
    successful_rescrapes = 0
    failed_rescrapes = 0
    
    try:
        for i, technique in enumerate(techniques, 1):
            print(f"\n[{i}/{len(techniques)}] Re-scraping '{technique}'...")
            
            try:
                # Temporarily remove from progress to force re-scraping
                if technique in original_progress:
                    del original_progress[technique]
                    with open(progress_file, 'w') as f:
                        json.dump(original_progress, f, indent=2)
                
                # Determine max_videos based on configuration
                max_videos = None if MAX_VIDEOS_PER_TECHNIQUE == 'full' else MAX_VIDEOS_PER_TECHNIQUE
                
                # Scrape the technique directly (scraper handles URL construction)
                videos = scraper.scrape_technique_page(technique, max_videos=max_videos)
                
                if videos:
                    # Count videos with descriptions
                    videos_with_descriptions = [v for v in videos if v.get('description') and len(v['description'].strip()) > 20]
                    videos_without_descriptions = len(videos) - len(videos_with_descriptions)
                    
                    print(f"  ✓ Successfully scraped {len(videos)} videos for '{technique}'")
                    if videos_without_descriptions > 0:
                        print(f"    ⚠ {videos_without_descriptions} videos were skipped due to missing descriptions")
                    print(f"    ✓ {len(videos_with_descriptions)} videos have valid descriptions")
                    
                    # Save the data
                    scraper.save_technique_data(technique, videos)
                    successful_rescrapes += 1
                else:
                    print(f"  ⚠ No videos found for '{technique}' (may still be unavailable)")
                    failed_rescrapes += 1
                    
            except Exception as e:
                print(f"  ✗ Error scraping '{technique}': {str(e)}")
                failed_rescrapes += 1
    
    finally:
        # Cleanup
        try:
            scraper.driver.quit()
        except:
            pass
        
        # Restore original progress
        if original_progress:
            with open(progress_file, 'w') as f:
                json.dump(original_progress, f, indent=2)
    
    # Summary
    print(f"\n=== Re-scraping Summary ===")
    print(f"Total techniques processed: {len(techniques)}")
    print(f"Successful re-scrapes: {successful_rescrapes}")
    print(f"Failed re-scrapes: {failed_rescrapes}")
    
    if successful_rescrapes > 0:
        print(f"\n✓ Successfully found videos for {successful_rescrapes} previously empty techniques!")
    if failed_rescrapes > 0:
        print(f"⚠ {failed_rescrapes} techniques still have no videos available.")

def main():
    print("Checking technique files for zero videos...")
    
    # Get techniques with zero videos from actual files
    zero_video_techniques = get_zero_video_techniques_from_files()
    
    if not zero_video_techniques:
        print("No techniques with zero videos found in technique_files directory.")
        sys.exit(0)
    
    # Confirm before proceeding
    print(f"\nFound {len(zero_video_techniques)} techniques with zero videos.")
    response = input("Do you want to re-scrape all of them? (y/N): ").strip().lower()
    
    if response in ['y', 'yes']:
        rescrape_techniques(zero_video_techniques)
    else:
        print("Re-scraping cancelled.")

if __name__ == "__main__":
    main()