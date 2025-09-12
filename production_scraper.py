#!/usr/bin/env python3
"""
Production SuperScaper - Complete scraping of all eyecannndy.com techniques
Uses the comprehensive popup scraper for accurate metadata extraction
"""

import json
import logging
import time
from datetime import datetime
from comprehensive_popup_scraper import ComprehensivePopupScraper
import os

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('production_scraper.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class ProductionScraper:
    def __init__(self):
        self.scraper = ComprehensivePopupScraper()
        self.techniques = []
        self.progress_file = "production_progress.json"
        self.results_summary = {
            "start_time": None,
            "end_time": None,
            "total_techniques": 0,
            "completed_techniques": 0,
            "failed_techniques": [],
            "total_videos_scraped": 0,
            "techniques_results": {}
        }
        
    def load_discovered_techniques(self, filename="discovered_techniques.json"):
        """Load all discovered techniques from JSON file"""
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                data = json.load(f)
                self.techniques = [tech['name'] for tech in data['techniques']]
                # Filter out techniques with fragments (# in URL)
                self.techniques = [tech for tech in self.techniques if '#' not in tech]
                logger.info(f"Loaded {len(self.techniques)} techniques from {filename}")
                return True
        except Exception as e:
            logger.error(f"Error loading techniques: {e}")
            return False
    
    def load_progress(self):
        """Load previous progress if exists"""
        try:
            if os.path.exists(self.progress_file):
                with open(self.progress_file, 'r') as f:
                    progress = json.load(f)
                    completed = progress.get('completed_techniques', [])
                    logger.info(f"Loaded progress: {len(completed)} techniques already completed")
                    return completed
        except Exception as e:
            logger.warning(f"Could not load progress: {e}")
        return []
    
    def save_progress(self, completed_techniques, current_technique=None):
        """Save current progress"""
        try:
            progress = {
                "timestamp": datetime.now().isoformat(),
                "completed_techniques": completed_techniques,
                "current_technique": current_technique,
                "total_techniques": len(self.techniques)
            }
            with open(self.progress_file, 'w') as f:
                json.dump(progress, f, indent=2)
        except Exception as e:
            logger.error(f"Error saving progress: {e}")
    
    def save_final_summary(self):
        """Save final scraping summary"""
        try:
            summary_file = f"scraping_summary_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            with open(summary_file, 'w', encoding='utf-8') as f:
                json.dump(self.results_summary, f, indent=2, ensure_ascii=False)
            logger.info(f"Final summary saved to {summary_file}")
        except Exception as e:
            logger.error(f"Error saving summary: {e}")
    
    def scrape_all_techniques(self, max_videos_per_technique=None, start_from_technique=None):
        """Scrape all discovered techniques"""
        if not self.techniques:
            logger.error("No techniques loaded. Run load_discovered_techniques() first.")
            return
        
        # Load previous progress
        completed_techniques = self.load_progress()
        
        # Filter out already completed techniques
        remaining_techniques = [t for t in self.techniques if t not in completed_techniques]
        
        # Start from specific technique if specified
        if start_from_technique and start_from_technique in remaining_techniques:
            start_index = remaining_techniques.index(start_from_technique)
            remaining_techniques = remaining_techniques[start_index:]
            logger.info(f"Starting from technique: {start_from_technique}")
        
        self.results_summary["start_time"] = datetime.now().isoformat()
        self.results_summary["total_techniques"] = len(self.techniques)
        self.results_summary["completed_techniques"] = len(completed_techniques)
        
        logger.info(f"Starting production scraping...")
        logger.info(f"Total techniques: {len(self.techniques)}")
        logger.info(f"Already completed: {len(completed_techniques)}")
        logger.info(f"Remaining to scrape: {len(remaining_techniques)}")
        
        if not remaining_techniques:
            logger.info("All techniques already completed!")
            return
        
        for i, technique in enumerate(remaining_techniques, 1):
            logger.info(f"\n{'='*60}")
            logger.info(f"Processing technique {len(completed_techniques) + i}/{len(self.techniques)}: {technique}")
            logger.info(f"{'='*60}")
            
            try:
                # Save progress before starting
                self.save_progress(completed_techniques, technique)
                
                # Scrape the technique
                videos = self.scraper.scrape_technique_page(
                    technique, 
                    max_videos=max_videos_per_technique
                )
                
                if videos:
                    # Save the results
                    self.scraper.save_technique_data(technique, videos)
                    
                    # Update results summary
                    self.results_summary["techniques_results"][technique] = {
                        "videos_count": len(videos),
                        "status": "completed",
                        "timestamp": datetime.now().isoformat()
                    }
                    self.results_summary["total_videos_scraped"] += len(videos)
                    
                    logger.info(f"✅ Successfully scraped {len(videos)} videos from {technique}")
                else:
                    logger.warning(f"⚠️ No videos found for technique: {technique}")
                    self.results_summary["techniques_results"][technique] = {
                        "videos_count": 0,
                        "status": "no_videos",
                        "timestamp": datetime.now().isoformat()
                    }
                
                # Mark as completed
                completed_techniques.append(technique)
                self.results_summary["completed_techniques"] = len(completed_techniques)
                
                # Save progress after completion
                self.save_progress(completed_techniques)
                
                # Add delay between techniques to be respectful
                if i < len(remaining_techniques):
                    delay = 3  # 3 seconds between techniques
                    logger.info(f"Waiting {delay} seconds before next technique...")
                    time.sleep(delay)
                    
            except Exception as e:
                logger.error(f"❌ Error scraping technique {technique}: {e}")
                self.results_summary["failed_techniques"].append({
                    "technique": technique,
                    "error": str(e),
                    "timestamp": datetime.now().isoformat()
                })
                
                # Continue with next technique even if one fails
                continue
        
        # Final cleanup and summary
        self.results_summary["end_time"] = datetime.now().isoformat()
        self.save_final_summary()
        
        logger.info(f"\n{'='*60}")
        logger.info(f"PRODUCTION SCRAPING COMPLETED!")
        logger.info(f"{'='*60}")
        logger.info(f"Total techniques processed: {self.results_summary['completed_techniques']}/{self.results_summary['total_techniques']}")
        logger.info(f"Total videos scraped: {self.results_summary['total_videos_scraped']}")
        logger.info(f"Failed techniques: {len(self.results_summary['failed_techniques'])}")
        
        if self.results_summary['failed_techniques']:
            logger.info("Failed techniques:")
            for failed in self.results_summary['failed_techniques']:
                logger.info(f"  - {failed['technique']}: {failed['error']}")
        
        # Cleanup
        self.scraper.cleanup()
        
        return self.results_summary
    
    def resume_scraping(self, max_videos_per_technique=None):
        """Resume scraping from where it left off"""
        logger.info("Resuming scraping from previous progress...")
        return self.scrape_all_techniques(max_videos_per_technique=max_videos_per_technique)
    
    def scrape_specific_techniques(self, technique_names, max_videos_per_technique=None):
        """Scrape only specific techniques"""
        if not isinstance(technique_names, list):
            technique_names = [technique_names]
        
        # Filter to only valid techniques
        valid_techniques = [t for t in technique_names if t in self.techniques]
        invalid_techniques = [t for t in technique_names if t not in self.techniques]
        
        if invalid_techniques:
            logger.warning(f"Invalid techniques (will be skipped): {invalid_techniques}")
        
        if not valid_techniques:
            logger.error("No valid techniques to scrape")
            return
        
        logger.info(f"Scraping specific techniques: {valid_techniques}")
        
        # Temporarily replace techniques list
        original_techniques = self.techniques
        self.techniques = valid_techniques
        
        try:
            result = self.scrape_all_techniques(max_videos_per_technique=max_videos_per_technique)
        finally:
            # Restore original techniques list
            self.techniques = original_techniques
        
        return result

def main():
    """Main function for production scraping"""
    scraper = ProductionScraper()
    
    # Load discovered techniques
    if not scraper.load_discovered_techniques():
        logger.error("Failed to load techniques. Exiting.")
        return
    
    print(f"\n🚀 SuperScaper Production Mode")
    print(f"📊 Total techniques to scrape: {len(scraper.techniques)}")
    print(f"\nOptions:")
    print(f"1. Scrape ALL techniques (full production run)")
    print(f"2. Resume from previous progress")
    print(f"3. Scrape specific techniques")
    print(f"4. Test run (first 5 techniques only)")
    
    choice = input("\nEnter your choice (1-4): ").strip()
    
    if choice == "1":
        print("\n🔥 Starting FULL production scraping...")
        print("⚠️  This will take several hours to complete!")
        confirm = input("Are you sure? (yes/no): ").strip().lower()
        if confirm == 'yes':
            scraper.scrape_all_techniques()
        else:
            print("Cancelled.")
    
    elif choice == "2":
        print("\n🔄 Resuming from previous progress...")
        scraper.resume_scraping()
    
    elif choice == "3":
        print("\n📝 Enter technique names (comma-separated):")
        technique_input = input("Techniques: ").strip()
        if technique_input:
            techniques = [t.strip() for t in technique_input.split(',')]
            scraper.scrape_specific_techniques(techniques)
        else:
            print("No techniques specified.")
    
    elif choice == "4":
        print("\n🧪 Running test with first 5 techniques...")
        test_techniques = scraper.techniques[:5]
        scraper.scrape_specific_techniques(test_techniques, max_videos_per_technique=5)
    
    else:
        print("Invalid choice. Exiting.")

if __name__ == "__main__":
    main()