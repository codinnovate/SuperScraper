#!/usr/bin/env python3
"""
Duplicate Checker for Technique Files
Checks for duplicate video URLs across all CSV and JSON files in technique_files directory.
"""

import os
import json
import csv
from pathlib import Path
from collections import defaultdict, Counter
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def check_csv_duplicates(technique_files_dir: str = "technique_files"):
    """
    Check for duplicate video URLs in CSV files.
    """
    csv_files = list(Path(technique_files_dir).glob("*.csv"))
    all_urls = []
    url_sources = defaultdict(list)
    
    logger.info(f"Checking {len(csv_files)} CSV files for duplicates...")
    
    for csv_file in csv_files:
        technique_name = csv_file.stem
        
        try:
            with open(csv_file, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                urls_in_file = []
                
                for row in reader:
                    url = row.get('video_url', '').strip()
                    if url:
                        all_urls.append(url)
                        url_sources[url].append(technique_name)
                        urls_in_file.append(url)
                
                # Check for duplicates within this file
                url_counts = Counter(urls_in_file)
                duplicates_in_file = {url: count for url, count in url_counts.items() if count > 1}
                
                if duplicates_in_file:
                    logger.warning(f"Duplicates within {csv_file.name}:")
                    for url, count in duplicates_in_file.items():
                        logger.warning(f"  {url}: {count} times")
                else:
                    logger.info(f"✅ {csv_file.name}: No internal duplicates ({len(urls_in_file)} unique URLs)")
                    
        except Exception as e:
            logger.error(f"Error reading {csv_file}: {e}")
    
    # Check for duplicates across files
    cross_file_duplicates = {url: sources for url, sources in url_sources.items() if len(sources) > 1}
    
    if cross_file_duplicates:
        logger.warning(f"\nFound {len(cross_file_duplicates)} URLs appearing in multiple CSV files:")
        for url, sources in cross_file_duplicates.items():
            logger.warning(f"  {url}")
            logger.warning(f"    Appears in: {', '.join(sources)}")
    else:
        logger.info(f"\n✅ No cross-file duplicates found in CSV files")
    
    return len(cross_file_duplicates), len(all_urls)

def check_json_duplicates(technique_files_dir: str = "technique_files"):
    """
    Check for duplicate video URLs in JSON files.
    """
    json_files = list(Path(technique_files_dir).glob("*.json"))
    # Exclude summary file
    json_files = [f for f in json_files if not f.name.startswith('_')]
    
    all_urls = []
    url_sources = defaultdict(list)
    
    logger.info(f"\nChecking {len(json_files)} JSON files for duplicates...")
    
    for json_file in json_files:
        technique_name = json_file.stem
        
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                videos = data.get('videos', [])
                urls_in_file = []
                
                for video in videos:
                    url = video.get('video_url', '').strip()
                    if url:
                        all_urls.append(url)
                        url_sources[url].append(technique_name)
                        urls_in_file.append(url)
                
                # Check for duplicates within this file
                url_counts = Counter(urls_in_file)
                duplicates_in_file = {url: count for url, count in url_counts.items() if count > 1}
                
                if duplicates_in_file:
                    logger.warning(f"Duplicates within {json_file.name}:")
                    for url, count in duplicates_in_file.items():
                        logger.warning(f"  {url}: {count} times")
                else:
                    logger.info(f"✅ {json_file.name}: No internal duplicates ({len(urls_in_file)} unique URLs)")
                    
        except Exception as e:
            logger.error(f"Error reading {json_file}: {e}")
    
    # Check for duplicates across files
    cross_file_duplicates = {url: sources for url, sources in url_sources.items() if len(sources) > 1}
    
    if cross_file_duplicates:
        logger.warning(f"\nFound {len(cross_file_duplicates)} URLs appearing in multiple JSON files:")
        for url, sources in cross_file_duplicates.items():
            logger.warning(f"  {url}")
            logger.warning(f"    Appears in: {', '.join(sources)}")
    else:
        logger.info(f"\n✅ No cross-file duplicates found in JSON files")
    
    return len(cross_file_duplicates), len(all_urls)

def check_csv_json_consistency(technique_files_dir: str = "technique_files"):
    """
    Check if CSV and JSON files for each technique contain the same URLs.
    """
    logger.info(f"\nChecking CSV-JSON consistency...")
    
    technique_files = {}
    
    # Collect all technique files
    for file_path in Path(technique_files_dir).iterdir():
        if file_path.suffix in ['.csv', '.json'] and not file_path.name.startswith('_'):
            technique = file_path.stem
            if technique not in technique_files:
                technique_files[technique] = {}
            technique_files[technique][file_path.suffix[1:]] = file_path
    
    inconsistencies = []
    
    for technique, files in technique_files.items():
        if 'csv' not in files or 'json' not in files:
            logger.warning(f"Missing file for {technique}: {list(files.keys())}")
            continue
        
        # Get URLs from CSV
        csv_urls = set()
        try:
            with open(files['csv'], 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    url = row.get('video_url', '').strip()
                    if url:
                        csv_urls.add(url)
        except Exception as e:
            logger.error(f"Error reading CSV for {technique}: {e}")
            continue
        
        # Get URLs from JSON
        json_urls = set()
        try:
            with open(files['json'], 'r', encoding='utf-8') as f:
                data = json.load(f)
                for video in data.get('videos', []):
                    url = video.get('video_url', '').strip()
                    if url:
                        json_urls.add(url)
        except Exception as e:
            logger.error(f"Error reading JSON for {technique}: {e}")
            continue
        
        # Compare URLs
        if csv_urls == json_urls:
            logger.info(f"✅ {technique}: CSV and JSON are consistent ({len(csv_urls)} URLs)")
        else:
            inconsistencies.append(technique)
            logger.warning(f"❌ {technique}: CSV and JSON are inconsistent")
            logger.warning(f"  CSV has {len(csv_urls)} URLs, JSON has {len(json_urls)} URLs")
            
            only_in_csv = csv_urls - json_urls
            only_in_json = json_urls - csv_urls
            
            if only_in_csv:
                logger.warning(f"  URLs only in CSV ({len(only_in_csv)}): {list(only_in_csv)[:3]}{'...' if len(only_in_csv) > 3 else ''}")
            if only_in_json:
                logger.warning(f"  URLs only in JSON ({len(only_in_json)}): {list(only_in_json)[:3]}{'...' if len(only_in_json) > 3 else ''}")
    
    return len(inconsistencies)

def main():
    """
    Main function to run all duplicate checks.
    """
    print("Duplicate Checker for Technique Files")
    print("=" * 40)
    
    technique_files_dir = "technique_files"
    
    if not Path(technique_files_dir).exists():
        logger.error(f"Directory {technique_files_dir} not found")
        return
    
    # Check CSV duplicates
    csv_cross_duplicates, csv_total_urls = check_csv_duplicates(technique_files_dir)
    
    # Check JSON duplicates
    json_cross_duplicates, json_total_urls = check_json_duplicates(technique_files_dir)
    
    # Check CSV-JSON consistency
    inconsistent_techniques = check_csv_json_consistency(technique_files_dir)
    
    # Summary
    print("\n" + "=" * 40)
    print("SUMMARY")
    print("=" * 40)
    print(f"CSV files: {csv_total_urls} total URLs, {csv_cross_duplicates} cross-file duplicates")
    print(f"JSON files: {json_total_urls} total URLs, {json_cross_duplicates} cross-file duplicates")
    print(f"CSV-JSON inconsistencies: {inconsistent_techniques} techniques")
    
    if csv_cross_duplicates == 0 and json_cross_duplicates == 0 and inconsistent_techniques == 0:
        print("\n✅ All checks passed! No duplicates or inconsistencies found.")
    else:
        print("\n❌ Issues found. Please review the warnings above.")

if __name__ == "__main__":
    main()