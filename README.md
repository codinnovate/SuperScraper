# SuperScraper - Eyecandy.com WebP Video Scraper

A comprehensive Python scraper designed to collect WebP videos and their metadata from eyecannndy.com (Eyecandy - Visual Technique Library). This tool organizes content by visual techniques and extracts detailed metadata for each video file, generating technique-specific datasets for analysis and research.

## Features

- **Comprehensive WebP Detection**: Finds WebP videos in various HTML elements (video, img, source, links)
- **Metadata Extraction**: Collects detailed information including titles, descriptions, categories, dimensions, and tags
- **Technique Organization**: Automatically detects and organizes content by 136+ visual techniques
- **Sub-category Support**: Handles technique sub-categories (e.g., traditional#3d, zoom-in#crash-zoom)
- **Technique-Specific Files**: Generates separate CSV and JSON files for each technique
- **Bulk Video Downloads**: Downloads videos organized by technique folders
- **Rate Limiting**: Respectful scraping with configurable delays between requests
- **Multiple Output Formats**: Saves data in both JSON and CSV formats
- **Error Handling**: Robust error handling and logging
- **Progress Tracking**: Real-time progress updates and periodic saves
- **Resumable**: Can handle interruptions and continue scraping

## Installation

1. **Clone or download this repository**

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the complete workflow**:
   ```bash
   # Step 1: Discover all technique links
   python3 discover_links.py
   
   # Step 2: Scrape videos and metadata
   python3 main.py
   
   # Step 3: Generate technique-specific files
   python3 generate_all_technique_files.py
   
   # Step 4: Download videos (optional)
   python3 video_downloader.py
   ```

## Usage

### Complete Workflow

The scraper works in multiple stages for comprehensive data collection:

```bash
# 1. Discover technique links (one-time setup)
python3 discover_links.py

# 2. Scrape videos and metadata
python3 main.py

# 3. Generate technique-specific files
python3 generate_all_technique_files.py

# 4. Download videos (optional)
python3 video_downloader.py
```

### Individual Script Usage

#### Main Scraper
```python
from main import EyecandyScraper

# Initialize scraper
scraper = EyecandyScraper(
    base_url="https://eyecannndy.com",
    delay=1.0  # 1 second delay between requests
)

# Run scraper (limit to 50 pages for testing)
scraper.run_scraper(max_pages=50)
```

#### Video Downloader Configuration
```python
# Edit video_downloader.py constants:
MAX_VIDEOS_TO_DOWNLOAD = 2000  # Maximum videos to download
DOWNLOAD_TIMEOUT = 30         # Timeout per download
REQUEST_DELAY = 0.5           # Delay between downloads
MAX_RETRIES = 3               # Retry attempts
```

## Output Structure

The scraper creates the following directory structure:

```
SuperScaper/
├── data/                                    # Raw scraped data
│   ├── eyecandy_videos_YYYYMMDD_HHMMSS.json
│   ├── eyecandy_videos_YYYYMMDD_HHMMSS.csv
│   └── categories_YYYYMMDD_HHMMSS.json
├── technique_files/                         # Technique-specific datasets
│   ├── _summary.json                        # Complete technique summary
│   ├── aerial.csv                          # Video URLs for aerial technique
│   ├── aerial.json                         # Complete metadata for aerial
│   ├── traditional.csv                     # Traditional technique videos
│   ├── traditional.json                    # Traditional with sub-categories
│   └── ... (136+ technique files)
├── videos/                                  # Downloaded video files
│   ├── aerial/                             # Videos organized by technique
│   ├── traditional/
│   └── ...
├── discovered_technique_links.json          # All discovered technique links
├── scraper.log                             # Detailed logging
└── downloader.log                          # Download operation logs
```

### Data Fields

#### Raw Data (data/ folder)
Each WebP video entry contains:

- **video_url**: Direct URL to the WebP file
- **page_url**: URL of the page containing the video
- **discovered_at**: Timestamp when the video was found
- **element_tag**: HTML tag containing the video (img, video, etc.)
- **title**: Extracted title or description
- **description**: Additional descriptive text
- **category**: Detected category/section
- **alt_text**: Alt text from the HTML element
- **css_classes**: CSS classes applied to the element
- **dimensions**: Width and height if available
- **tags**: Extracted tags and keywords
- **file_size**: File size (populated during download)

#### Technique Files (technique_files/ folder)
- **CSV files**: Contain only video URLs for each technique (one per line)
- **JSON files**: Complete metadata organized by technique with sub-categories
- **_summary.json**: Master file with all 136+ techniques and their sub-categories

#### Sub-categories
Some techniques include sub-categories (e.g., traditional technique has 3d, charcoal, doodle-animation, etc.)

## Configuration Options

### Main Scraper Parameters

- `base_url`: Website base URL (default: "https://eyecannndy.com")
- `delay`: Delay between requests in seconds (default: 1.0)
- `max_pages`: Maximum number of pages to scrape (optional)
- `custom_headers`: Custom HTTP headers dictionary (optional)

### Custom Headers Configuration

Both the main scraper and video downloader support custom headers to match your device/browser:

```python
# Example: Windows Chrome headers
custom_headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1'
}

# Use with scraper
scraper = EyecandyScraper(custom_headers=custom_headers)

# Use with downloader
downloader = VideoDownloader(custom_headers=custom_headers)
```

See `example_custom_headers.py` for more device/browser examples.

### Video Downloader Configuration

Edit constants in `video_downloader.py`:

- `MAX_VIDEOS_TO_DOWNLOAD`: Maximum number of videos to download (default: 2000)
- `DOWNLOAD_TIMEOUT`: Timeout for each download in seconds (default: 30)
- `REQUEST_DELAY`: Delay between download requests (default: 0.5)
- `MAX_RETRIES`: Maximum retry attempts for failed downloads (default: 3)
- `CHUNK_SIZE`: Download chunk size in bytes (default: 8192)
- `VIDEOS_FOLDER`: Base folder for downloaded videos (default: "videos")

### Rate Limiting

The scraper includes built-in rate limiting to be respectful to the target website:

- Default 1-second delay between scraping requests
- Default 0.5-second delay between download requests
- Configurable delay timing for both operations
- Automatic retry on failed requests
- Progress saving every 10 pages

## Logging

Detailed logging is available in `scraper.log` with:

- Request status and errors
- Progress updates
- Video discovery counts
- Category detection
- Data saving confirmations

## Error Handling

The scraper handles various error conditions:

- Network timeouts and connection errors
- Invalid URLs and missing pages
- Malformed HTML content
- File system errors
- Rate limiting responses

## Ethical Considerations

- **Respect robots.txt**: Always check the website's robots.txt file
- **Rate limiting**: Built-in delays prevent server overload
- **User-Agent**: Uses a standard browser user-agent string
- **Error handling**: Graceful handling of server errors

## Legal Notice

This tool is for educational and research purposes. Users are responsible for:

- Complying with website terms of service
- Respecting copyright and intellectual property rights
- Following applicable laws and regulations
- Using scraped data responsibly

## Troubleshooting

### Common Issues

1. **No videos found**:
   - Check if the website structure has changed
   - Verify the base URL is correct
   - Check the scraper.log for error messages

2. **Connection errors**:
   - Increase the delay between requests
   - Check your internet connection
   - Verify the website is accessible

3. **Permission errors**:
   - Ensure write permissions in the project directory
   - Check if antivirus software is blocking file creation

### Debug Mode

For detailed debugging, modify the logging level in `main.py`:

```python
logging.basicConfig(level=logging.DEBUG)
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

## License

This project is provided as-is for educational purposes. Please use responsibly and in accordance with applicable laws and website terms of service.

## Support

For issues and questions:

1. Check the troubleshooting section
2. Review the scraper.log file
3. Create an issue with detailed information about the problem

---

**Note**: This scraper is designed to handle the current structure of eyecannndy.com (Eyecandy - Visual Technique Library) as of 2024. The system supports 136+ visual techniques with automatic sub-category detection and deduplication. Website structures may change over time, requiring updates to the scraping logic.

**Technique Coverage**: The scraper currently supports all major visual techniques including aerial, traditional (with 14 sub-categories like 3d, charcoal, doodle-animation), zoom-in (with 6 sub-categories like crash-zoom, infinite-zoom), and many others. New techniques are automatically detected and added to the system.

## Example Usage

### Quick Start

```bash
# Complete workflow - from discovery to download
python3 discover_links.py          # Discover all technique links
python3 main.py                    # Scrape videos and metadata  
python3 generate_all_technique_files.py  # Generate technique files
python3 video_downloader.py        # Download videos (optional)
```

### Working with Technique Files

```python
import json
import pandas as pd

# Load technique summary
with open('technique_files/_summary.json', 'r') as f:
    summary = json.load(f)

# Get all techniques with videos
techniques_with_data = [t for t in summary['techniques'] if t['video_count'] > 0]
print(f"Found {len(techniques_with_data)} techniques with video data")

# Load specific technique data
aerial_df = pd.read_csv('technique_files/aerial.csv')
print(f"Aerial technique has {len(aerial_df)} videos")

# Load technique metadata
with open('technique_files/aerial.json', 'r') as f:
    aerial_data = json.load(f)
```

### Advanced Usage

See `example_usage.py` for detailed examples:

```bash
python3 example_usage.py
```

## Available Scripts

| Script | Purpose | Output |
|--------|---------|--------|
| `discover_links.py` | Discovers all technique links from eyecandy.com | `discovered_technique_links.json` |
| `main.py` | Main scraper for videos and metadata | `data/eyecandy_videos_*.json/csv` |
| `generate_all_technique_files.py` | Creates technique-specific files | `technique_files/*.csv/json` |
| `video_downloader.py` | Downloads videos organized by technique | `videos/*/` folders |
| `example_usage.py` | Demonstrates various usage scenarios | Console output |
| `check_duplicates.py` | Checks for duplicate videos in datasets | Console analysis |
| `example_custom_headers.py` | Examples of custom headers for different devices | N/A |

### Script Dependencies

```
discover_links.py → main.py → generate_all_technique_files.py → video_downloader.py
```

Each script depends on the output of the previous one in the workflow.