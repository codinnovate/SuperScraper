#!/usr/bin/env python3
"""
Test script to verify custom headers functionality.
"""

from main import EyecandyScraper
from video_downloader import VideoDownloader

def test_custom_headers():
    """Test that custom headers are properly applied."""
    
    # Test custom headers for scraper
    test_headers = {
        'User-Agent': 'Test-Agent/1.0',
        'Accept': 'test/accept',
        'Custom-Header': 'test-value'
    }
    
    print("Testing EyecandyScraper with custom headers...")
    scraper = EyecandyScraper(custom_headers=test_headers)
    
    # Verify headers are applied
    assert scraper.session.headers['User-Agent'] == 'Test-Agent/1.0'
    assert scraper.session.headers['Accept'] == 'test/accept'
    assert scraper.session.headers['Custom-Header'] == 'test-value'
    print("✓ EyecandyScraper headers applied correctly")
    
    print("\nTesting VideoDownloader with custom headers...")
    downloader = VideoDownloader(custom_headers=test_headers)
    
    # Verify headers are applied
    assert downloader.session.headers['User-Agent'] == 'Test-Agent/1.0'
    assert downloader.session.headers['Accept'] == 'test/accept'
    assert downloader.session.headers['Custom-Header'] == 'test-value'
    print("✓ VideoDownloader headers applied correctly")
    
    print("\nTesting default headers (no custom headers provided)...")
    scraper_default = EyecandyScraper()
    downloader_default = VideoDownloader()
    
    # Verify default headers are used
    assert 'Mozilla/5.0' in scraper_default.session.headers['User-Agent']
    assert 'Mozilla/5.0' in downloader_default.session.headers['User-Agent']
    print("✓ Default headers applied correctly when no custom headers provided")
    
    print("\n🎉 All tests passed! Custom headers functionality is working correctly.")

if __name__ == "__main__":
    test_custom_headers()