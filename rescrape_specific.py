#!/usr/bin/env python3
"""
Re-scrape Specific Techniques Script
Allows users to select and re-scrape specific techniques from eyecannndy.com
"""

import json
import os
import sys
from comprehensive_popup_scraper import ComprehensivePopupScraper

def load_discovered_techniques():
    """Load the list of discovered techniques"""
    try:
        with open('discovered_techniques.json', 'r') as f:
            data = json.load(f)
            return data.get('techniques', [])
    except FileNotFoundError:
        print("❌ discovered_techniques.json not found. Please run discover_techniques.py first.")
        sys.exit(1)
    except json.JSONDecodeError:
        print("❌ Error reading discovered_techniques.json")
        sys.exit(1)

def display_techniques_menu(techniques):
    """Display techniques in a paginated menu"""
    print("\n🎬 Available Techniques for Re-scraping:")
    print("=" * 50)
    
    # Sort techniques alphabetically
    sorted_techniques = sorted(techniques, key=lambda x: x['name'])
    
    for i, technique in enumerate(sorted_techniques, 1):
        # Check if already scraped
        json_file = f"technique_files/{technique['name']}.json"
        status = "✅ Scraped" if os.path.exists(json_file) else "⏳ Not scraped"
        print(f"{i:3d}. {technique['name']:<25} {status}")
    
    return sorted_techniques

def get_user_selection(techniques):
    """Get user's technique selection"""
    while True:
        try:
            print("\n📝 Selection Options:")
            print("• Enter technique numbers (e.g., 1,5,10-15)")
            print("• Enter 'all' to re-scrape all techniques")
            print("• Enter 'scraped' to re-scrape only already scraped techniques")
            print("• Enter 'unscraped' to scrape only unscraped techniques")
            print("• Enter 'q' to quit")
            
            selection = input("\nYour selection: ").strip().lower()
            
            if selection == 'q':
                print("👋 Goodbye!")
                sys.exit(0)
            elif selection == 'all':
                return techniques
            elif selection == 'scraped':
                return [t for t in techniques if os.path.exists(f"technique_files/{t['name']}.json")]
            elif selection == 'unscraped':
                return [t for t in techniques if not os.path.exists(f"technique_files/{t['name']}.json")]
            else:
                # Parse number selection
                selected_techniques = []
                parts = selection.split(',')
                
                for part in parts:
                    part = part.strip()
                    if '-' in part:
                        # Range selection (e.g., 10-15)
                        start, end = map(int, part.split('-'))
                        for i in range(start, end + 1):
                            if 1 <= i <= len(techniques):
                                selected_techniques.append(techniques[i-1])
                    else:
                        # Single number
                        num = int(part)
                        if 1 <= num <= len(techniques):
                            selected_techniques.append(techniques[num-1])
                        else:
                            print(f"❌ Invalid number: {num}")
                            continue
                
                if selected_techniques:
                    return selected_techniques
                else:
                    print("❌ No valid techniques selected.")
                    
        except ValueError:
            print("❌ Invalid input. Please try again.")
        except KeyboardInterrupt:
            print("\n👋 Goodbye!")
            sys.exit(0)

def confirm_selection(selected_techniques):
    """Confirm user's selection"""
    print(f"\n🎯 Selected {len(selected_techniques)} technique(s) for re-scraping:")
    for i, technique in enumerate(selected_techniques, 1):
        status = "✅ Will re-scrape" if os.path.exists(f"technique_files/{technique['name']}.json") else "🆕 New scrape"
        print(f"{i:2d}. {technique['name']:<25} {status}")
    
    while True:
        confirm = input("\n❓ Proceed with re-scraping? (y/n): ").strip().lower()
        if confirm in ['y', 'yes']:
            return True
        elif confirm in ['n', 'no']:
            return False
        else:
            print("Please enter 'y' or 'n'")

def main():
    """Main function"""
    print("🔄 SuperScaper - Specific Technique Re-scraper")
    print("=" * 50)
    
    # Load discovered techniques
    techniques = load_discovered_techniques()
    print(f"📊 Found {len(techniques)} total techniques")
    
    # Display menu and get selection
    sorted_techniques = display_techniques_menu(techniques)
    selected_techniques = get_user_selection(sorted_techniques)
    
    if not selected_techniques:
        print("❌ No techniques selected.")
        return
    
    # Confirm selection
    if not confirm_selection(selected_techniques):
        print("❌ Operation cancelled.")
        return
    
    # Initialize scraper
    print("\n🚀 Initializing scraper...")
    scraper = ComprehensivePopupScraper()
    scraper.setup_selenium()
    
    # Create technique_files directory if it doesn't exist
    os.makedirs('technique_files', exist_ok=True)
    
    # Process selected techniques
    total_videos = 0
    failed_techniques = []
    
    for i, technique in enumerate(selected_techniques, 1):
        print(f"\n{'='*60}")
        print(f"🎬 Processing technique {i}/{len(selected_techniques)}: {technique['name']}")
        print(f"{'='*60}")
        
        try:
            # Temporarily remove technique from progress to force re-scraping
            original_progress = scraper.progress_data.copy()
            if technique['name'] in scraper.progress_data.get('completed_techniques', []):
                scraper.progress_data['completed_techniques'].remove(technique['name'])
            
            # Navigate to technique page
            technique_url = technique['url']
            scraper.get_page_with_selenium(technique_url)
            
            # Scrape the technique page
            videos = scraper.scrape_technique_page(technique['name'])
            
            if videos:
                video_count = len(videos)
                total_videos += video_count
                
                # Save data
                scraper.save_technique_data(technique['name'], videos)
                print(f"✅ Successfully re-scraped {video_count} videos from {technique['name']}")
                
                # Restore original progress (don't mark as completed again)
                scraper.progress_data = original_progress
            else:
                print(f"⚠️  No videos found for {technique['name']}")
                failed_techniques.append(technique['name'])
                # Restore original progress
                scraper.progress_data = original_progress
                
        except Exception as e:
            print(f"❌ Failed to scrape {technique['name']}: {str(e)}")
            failed_techniques.append(technique['name'])
        
        # Add delay between techniques (except for the last one)
        if i < len(selected_techniques):
            print("⏳ Waiting 3 seconds before next technique...")
            import time
            time.sleep(3)
    
    # Final summary
    print(f"\n{'='*60}")
    print("🎉 RE-SCRAPING COMPLETED!")
    print(f"{'='*60}")
    print(f"📊 Techniques processed: {len(selected_techniques)}")
    print(f"🎬 Total videos scraped: {total_videos}")
    print(f"✅ Successful: {len(selected_techniques) - len(failed_techniques)}")
    print(f"❌ Failed: {len(failed_techniques)}")
    
    if failed_techniques:
        print(f"\n❌ Failed techniques: {', '.join(failed_techniques)}")
    
    # Cleanup
    scraper.cleanup()
    print("\n🧹 Cleanup completed. Re-scraping finished!")

if __name__ == "__main__":
    main()