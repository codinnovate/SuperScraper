#!/usr/bin/env python3
"""
Video Downloader for Eyecandy WebP Videos
Downloads videos from scraped metadata and organizes them by technique folders
"""

import os
import json
import requests
from pathlib import Path
import logging
from urllib.parse import urlparse
import time
from datetime import datetime

# USER CONFIGURABLE CONSTANTS
MAX_VIDEOS_TO_DOWNLOAD = 50  # Maximum number of videos to download (0 = unlimited)
DOWNLOAD_TIMEOUT = 30  # Timeout for each download in seconds
REQUEST_DELAY = 0.5  # Delay between requests in seconds
MAX_RETRIES = 3  # Maximum number of retry attempts for failed downloads
CHUNK_SIZE = 8192  # Download chunk size in bytes
LOG_LEVEL = logging.INFO  # Logging level (DEBUG, INFO, WARNING, ERROR)
VIDEOS_FOLDER = "videos"  # Base folder for downloaded videos
from typing import List, Dict

class VideoDownloader:
    def __init__(self, base_download_dir: str = VIDEOS_FOLDER):
        """
        Initialize the video downloader.
        
        Args:
            base_download_dir: Base directory for downloading videos
        """
        self.base_download_dir = Path(base_download_dir)
        self.base_download_dir.mkdir(exist_ok=True)
        
        # Setup logging
        logging.basicConfig(
            level=LOG_LEVEL,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('downloader.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
        
        # Setup session with headers
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'video/webp,video/*,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        })
        
        self.download_stats = {
            'total_videos': 0,
            'downloaded': 0,
            'failed': 0,
            'skipped': 0
        }
    
    def load_metadata(self, json_file: str) -> List[Dict]:
        """
        Load video metadata from JSON file.
        
        Args:
            json_file: Path to the JSON metadata file
            
        Returns:
            List of video metadata dictionaries
        """
        try:
            with open(json_file, 'r') as f:
                data = json.load(f)
                
            if 'videos' in data:
                videos = data['videos']
            else:
                videos = data if isinstance(data, list) else []
                
            self.logger.info(f"Loaded {len(videos)} videos from {json_file}")
            return videos
            
        except Exception as e:
            self.logger.error(f"Error loading metadata from {json_file}: {e}")
            return []
    
    def get_technique_from_url(self, page_url: str) -> str:
        """
        Extract technique name from page URL.
        
        Args:
            page_url: The page URL containing the video
            
        Returns:
            Technique name for folder organization
        """
        if '/technique/' in page_url:
            return page_url.split('/technique/')[-1].split('?')[0].split('#')[0]
        return 'unknown'
    
    def sanitize_filename(self, filename: str) -> str:
        """
        Sanitize filename for safe file system usage.
        
        Args:
            filename: Original filename
            
        Returns:
            Sanitized filename
        """
        # Remove or replace invalid characters
        invalid_chars = '<>:"/\\|?*'
        for char in invalid_chars:
            filename = filename.replace(char, '_')
        
        # Limit length and remove extra spaces
        filename = filename.strip()[:200]
        return filename
    
    def download_video(self, video_info: Dict, technique_dir: Path) -> bool:
        """
        Download a single video.
        
        Args:
            video_info: Video metadata dictionary
            technique_dir: Directory for the technique
            
        Returns:
            True if download successful, False otherwise
        """
        try:
            video_url = video_info.get('video_url') or video_info.get('url')
            if not video_url:
                self.logger.warning(f"No URL found for video: {video_info}")
                return False
            
            # Generate filename
            parsed_url = urlparse(video_url)
            original_filename = os.path.basename(parsed_url.path)
            
            if not original_filename or not original_filename.endswith('.webp'):
                # Generate filename from title or URL
                title = video_info.get('title', '').strip()
                if title:
                    filename = f"{self.sanitize_filename(title)}.webp"
                else:
                    filename = f"video_{hash(video_url) % 10000}.webp"
            else:
                filename = self.sanitize_filename(original_filename)
            
            file_path = technique_dir / filename
            
            # Skip if file already exists
            if file_path.exists():
                self.logger.info(f"Skipping existing file: {file_path}")
                self.download_stats['skipped'] += 1
                return True
            
            # Download the video
            self.logger.info(f"Downloading: {video_url} -> {file_path}")
            
            response = self.session.get(video_url, timeout=DOWNLOAD_TIMEOUT)
            response.raise_for_status()
            
            # Save the video
            with open(file_path, 'wb') as f:
                f.write(response.content)
            
            self.logger.info(f"Successfully downloaded: {file_path} ({len(response.content)} bytes)")
            self.download_stats['downloaded'] += 1
            
            # Add small delay to be respectful
            time.sleep(REQUEST_DELAY)
            
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to download {video_info.get('url', 'unknown')}: {e}")
            self.download_stats['failed'] += 1
            return False
    
    def download_all_videos(self, json_file: str, max_videos: int = None) -> None:
        """
        Download all videos from metadata file, organized by technique.
        
        Args:
            json_file: Path to the JSON metadata file
            max_videos: Maximum number of videos to download (None for all)
        """
        videos = self.load_metadata(json_file)
        if not videos:
            self.logger.error("No videos found to download")
            return
        
        # Limit videos if specified
        if max_videos and max_videos > 0:
            videos = videos[:max_videos]
            self.logger.info(f"Limited to {max_videos} videos")
        
        self.download_stats['total_videos'] = len(videos)
        
        # Group videos by technique
        technique_videos = {}
        for video in videos:
            technique = self.get_technique_from_url(video.get('page_url', ''))
            if technique not in technique_videos:
                technique_videos[technique] = []
            technique_videos[technique].append(video)
        
        self.logger.info(f"Found videos for {len(technique_videos)} techniques")
        
        # Download videos for each technique
        for technique, technique_video_list in technique_videos.items():
            self.logger.info(f"\nProcessing technique: {technique} ({len(technique_video_list)} videos)")
            
            # Create technique directory
            technique_dir = self.base_download_dir / technique
            technique_dir.mkdir(exist_ok=True)
            
            # Download videos for this technique
            for i, video in enumerate(technique_video_list, 1):
                self.logger.info(f"Downloading video {i}/{len(technique_video_list)} for {technique}")
                self.download_video(video, technique_dir)
        
        # Print final statistics
        self.print_download_stats()
    
    def print_download_stats(self) -> None:
        """
        Print download statistics.
        """
        stats = self.download_stats
        self.logger.info("\n" + "="*50)
        self.logger.info("DOWNLOAD STATISTICS")
        self.logger.info("="*50)
        self.logger.info(f"Total videos: {stats['total_videos']}")
        self.logger.info(f"Downloaded: {stats['downloaded']}")
        self.logger.info(f"Skipped (already exists): {stats['skipped']}")
        self.logger.info(f"Failed: {stats['failed']}")
        self.logger.info(f"Success rate: {(stats['downloaded'] / max(stats['total_videos'], 1)) * 100:.1f}%")
        self.logger.info("="*50)

def find_latest_json_file() -> str:
    """
    Find the latest eyecandy videos JSON file in the data directory.
    
    Returns:
        Path to the latest JSON file
    """
    data_dir = Path('data')
    if not data_dir.exists():
        raise FileNotFoundError("Data directory not found")
    
    json_files = list(data_dir.glob('eyecandy_videos_*.json'))
    if not json_files:
        raise FileNotFoundError("No eyecandy videos JSON files found")
    
    # Sort by modification time and get the latest
    latest_file = max(json_files, key=lambda f: f.stat().st_mtime)
    return str(latest_file)

def main():
    """
    Main function to run the video downloader.
    """
    print("Eyecandy Video Downloader")
    print("=" * 30)
    
    try:
        # Find the latest JSON file
        json_file = find_latest_json_file()
        print(f"Using metadata file: {json_file}")
        
        # Initialize downloader
        downloader = VideoDownloader()
        
        # Download all videos (you can limit with max_videos parameter)
        # For testing, you might want to start with a small number like max_videos=10
        max_videos = MAX_VIDEOS_TO_DOWNLOAD if MAX_VIDEOS_TO_DOWNLOAD > 0 else None
        downloader.download_all_videos(json_file, max_videos=max_videos)
        
    except Exception as e:
        print(f"Error: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())