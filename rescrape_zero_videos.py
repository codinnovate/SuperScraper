#!/usr/bin/env python3
"""
Script to automatically re-scrape techniques that had zero videos in the previous scraping run.
Reads the scraping summary JSON file and re-scrapes all techniques with 'no_videos' status.
"""

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

def get_zero_video_techniques(summary_data):
    """Extract techniques that had zero videos."""
    zero_video_techniques = []
    
    if 'techniques_results' in summary_data:
        for technique, result in summary_data['techniques_results'].items():
            if result.get('videos_count', 0) == 0 and result.get('status') == 'no_videos':
                zero_video_techniques.append(technique)
    
    return zero_video_techniques

def rescrape_techniques(techniques):
    """Re-scrape the specified techniques."""
    if not techniques:
        print("No techniques with zero videos found.")
        return
    
    print(f"Found {len(techniques)} techniques with zero videos:")
    for i, technique in enumerate(techniques, 1):
        print(f"  {i}. {technique}")
    
    print("\nStarting re-scraping process...")
    
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
                
                # Scrape the technique directly (scraper handles URL construction)
                videos = scraper.scrape_technique_page(technique)
                
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
    # Default to the most recent summary file
    summary_file = 'scraping_summary_20250911_163745.json'
    
    # Allow custom summary file as argument
    if len(sys.argv) > 1:
        summary_file = sys.argv[1]
    
    if not os.path.exists(summary_file):
        print(f"Error: Summary file '{summary_file}' not found.")
        print("Usage: python3 rescrape_zero_videos.py [summary_file.json]")
        sys.exit(1)
    
    print(f"Loading scraping summary from: {summary_file}")
    
    # Load summary data
    summary_data = load_scraping_summary(summary_file)
    if not summary_data:
        sys.exit(1)
    
    # Get techniques with zero videos
    zero_video_techniques = get_zero_video_techniques(summary_data)
    
    if not zero_video_techniques:
        print("No techniques with zero videos found in the summary.")
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