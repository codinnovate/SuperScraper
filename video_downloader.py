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
MAX_VIDEOS_TO_DOWNLOAD = 2000  # Maximum number of videos to download (0 = unlimited)
DOWNLOAD_TIMEOUT = 30  # Timeout for each download in seconds
REQUEST_DELAY = 0.5  # Delay between requests in seconds
MAX_RETRIES = 3  # Maximum number of retry attempts for failed downloads
CHUNK_SIZE = 8192  # Download chunk size in bytes
LOG_LEVEL = logging.INFO  # Logging level (DEBUG, INFO, WARNING, ERROR)
VIDEOS_FOLDER = "videos"  # Base folder for downloaded videos
from typing import List, Dict, Optional

# USER CONFIGURABLE HEADERS - Customize these for your device/browser
DEFAULT_DOWNLOADER_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'video/webp,video/*,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1'
}

class VideoDownloader:
    def __init__(self, base_download_dir: str = VIDEOS_FOLDER, custom_headers: Optional[Dict[str, str]] = None):
        """
        Initialize the video downloader.
        
        Args:
            base_download_dir: Base directory for downloading videos
            custom_headers: Custom headers to use instead of defaults (optional)
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
        # Use custom headers if provided, otherwise use defaults
        headers_to_use = custom_headers if custom_headers else DEFAULT_DOWNLOADER_HEADERS
        self.session.headers.update(headers_to_use)
        
        self.download_stats = {
            'total_videos': 0,
            'downloaded': 0,
            'failed': 0,
            'skipped': 0
        }
        
        # Progress tracking for resume functionality
        self.progress_file = self.base_download_dir / '.download_progress.json'
        self.downloaded_urls = self.load_progress()
    
    def load_progress(self) -> set:
        """
        Load previously downloaded URLs from progress file.
        
        Returns:
            Set of URLs that have been successfully downloaded
        """
        if not self.progress_file.exists():
            return set()
        
        try:
            with open(self.progress_file, 'r') as f:
                progress_data = json.load(f)
                return set(progress_data.get('downloaded_urls', []))
        except Exception as e:
            self.logger.warning(f"Could not load progress file: {e}")
            return set()
    
    def save_progress(self, video_url: str):
        """
        Save successfully downloaded URL to progress file.
        
        Args:
            video_url: URL of the successfully downloaded video
        """
        self.downloaded_urls.add(video_url)
        
        try:
            progress_data = {
                'downloaded_urls': list(self.downloaded_urls),
                'last_updated': datetime.now().isoformat()
            }
            
            with open(self.progress_file, 'w') as f:
                json.dump(progress_data, f, indent=2)
                
        except Exception as e:
            self.logger.warning(f"Could not save progress: {e}")
    
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
        Download a single video with retry logic and resume capability.
        
        Args:
            video_info: Video metadata dictionary
            technique_dir: Directory for the technique
            
        Returns:
            True if download successful, False otherwise
        """
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
        temp_file_path = technique_dir / f"{filename}.tmp"
        
        # Check if video was already downloaded (from progress tracking)
        if video_url in self.downloaded_urls:
            self.logger.info(f"Skipping previously downloaded: {video_url}")
            self.download_stats['skipped'] += 1
            return True
        
        # Check if file already exists and is complete
        if file_path.exists() and file_path.stat().st_size > 0:
            self.logger.info(f"Skipping existing file: {file_path}")
            # Add to progress tracking if not already there
            self.save_progress(video_url)
            self.download_stats['skipped'] += 1
            return True
        
        # Clean up any incomplete temporary files from previous attempts
        if temp_file_path.exists():
            temp_file_path.unlink()
            self.logger.info(f"Cleaned up incomplete download: {temp_file_path}")
        
        # Attempt download with retries
        for attempt in range(1, MAX_RETRIES + 1):
            try:
                self.logger.info(f"Downloading (attempt {attempt}/{MAX_RETRIES}): {video_url} -> {file_path}")
                
                # Download with streaming to handle large files and connection issues
                response = self.session.get(video_url, timeout=DOWNLOAD_TIMEOUT, stream=True)
                response.raise_for_status()
                
                # Get expected file size if available
                expected_size = int(response.headers.get('content-length', 0))
                
                # Download to temporary file first
                downloaded_size = 0
                with open(temp_file_path, 'wb') as f:
                    for chunk in response.iter_content(chunk_size=CHUNK_SIZE):
                        if chunk:  # Filter out keep-alive chunks
                            f.write(chunk)
                            downloaded_size += len(chunk)
                
                # Verify download completeness
                if expected_size > 0 and downloaded_size != expected_size:
                    raise Exception(f"Incomplete download: {downloaded_size}/{expected_size} bytes")
                
                # Move temporary file to final location
                temp_file_path.rename(file_path)
                
                # Save progress to prevent re-downloading
                self.save_progress(video_url)
                
                self.logger.info(f"Successfully downloaded: {file_path} ({downloaded_size} bytes)")
                self.download_stats['downloaded'] += 1
                
                # Add small delay to be respectful
                time.sleep(REQUEST_DELAY)
                
                return True
                
            except Exception as e:
                self.logger.warning(f"Download attempt {attempt} failed for {video_url}: {e}")
                
                # Clean up failed temporary file
                if temp_file_path.exists():
                    temp_file_path.unlink()
                
                # If this was the last attempt, log as error
                if attempt == MAX_RETRIES:
                    self.logger.error(f"Failed to download after {MAX_RETRIES} attempts: {video_url}")
                    self.download_stats['failed'] += 1
                    return False
                
                # Wait before retry (exponential backoff)
                wait_time = REQUEST_DELAY * (2 ** (attempt - 1))
                self.logger.info(f"Waiting {wait_time:.1f}s before retry...")
                time.sleep(wait_time)
        
        return False
    
    def download_all_videos(self, json_file: str, max_videos: int = None) -> None:
        """
        Download all videos from metadata file, organized by technique.
        Automatically resumes from where it left off if interrupted.
        
        Args:
            json_file: Path to the JSON metadata file
            max_videos: Maximum number of videos to download (None for all)
        """
        videos = self.load_metadata(json_file)
        if not videos:
            self.logger.error("No videos found to download")
            return
        
        # Show resume information
        if self.downloaded_urls:
            self.logger.info(f"Resume mode: Found {len(self.downloaded_urls)} previously downloaded videos")
        
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
        self.logger.info(f"Downloaded this session: {stats['downloaded']}")
        self.logger.info(f"Skipped (already exists): {stats['skipped']}")
        self.logger.info(f"Failed: {stats['failed']}")
        self.logger.info(f"Total previously downloaded: {len(self.downloaded_urls)}")
        self.logger.info(f"Success rate: {(stats['downloaded'] / max(stats['total_videos'], 1)) * 100:.1f}%")
        if self.progress_file.exists():
            self.logger.info(f"Progress file: {self.progress_file}")
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