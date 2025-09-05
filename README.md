# SuperScraper - Eyecandy.com WebP Video Scraper

A comprehensive Python scraper designed to collect WebP videos and their metadata from eyecannndy.zip (Eyecandy - Visual Technique Library). This tool organizes content by categories and extracts detailed metadata for each video file.

## Features

- **Comprehensive WebP Detection**: Finds WebP videos in various HTML elements (video, img, source, links)
- **Metadata Extraction**: Collects detailed information including titles, descriptions, categories, dimensions, and tags
- **Category Organization**: Automatically detects and organizes content by categories
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

3. **Run the scraper**:
   ```bash
   python main.py
   ```

## Usage

### Basic Usage

```python
from main import EyecandyScraper

# Initialize scraper
scraper = EyecandyScraper(
    base_url="https://eyecannndy.zip",
    delay=1.0  # 1 second delay between requests
)

# Run scraper (limit to 50 pages for testing)
scraper.run_scraper(max_pages=50)
```

### Advanced Configuration

```python
# Custom configuration
scraper = EyecandyScraper(
    base_url="https://eyecannndy.zip",
    delay=2.0  # Slower scraping for heavy load times
)

# Run without page limit (scrape entire site)
scraper.run_scraper()
```

## Output Structure

The scraper creates the following directory structure:

```
SuperScaper/
├── data/
│   ├── eyecandy_videos_YYYYMMDD_HHMMSS.json
│   ├── eyecandy_videos_YYYYMMDD_HHMMSS.csv
│   └── categories_YYYYMMDD_HHMMSS.json
├── videos/          # Reserved for future video downloads
├── metadata/        # Reserved for additional metadata
└── scraper.log      # Detailed logging
```

### Data Fields

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

## Configuration Options

### Scraper Parameters

- `base_url`: Target website URL (default: "https://eyecannndy.zip")
- `delay`: Delay between requests in seconds (default: 1.0)
- `max_pages`: Maximum pages to scrape (None for unlimited)

### Rate Limiting

The scraper includes built-in rate limiting to be respectful to the target website:

- Default 1-second delay between requests
- Configurable delay timing
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

**Note**: This scraper is designed to handle the current structure of eyecannndy.zip (Eyecandy - Visual Technique Library) as of 2024. Website structures may change over time, requiring updates to the scraping logic.

## Example Usage

See `example_usage.py` for detailed examples of different scraping scenarios:

```bash
python3 example_usage.py
```

This will demonstrate:
- Basic scraping with default settings
- Custom configuration options
- Results analysis
- Targeted scraping approaches