#!/usr/bin/env python3
"""
Demo script for the complete blog generation system with news integration and persona comments
"""

import os
import sys

def main():
    print("🚀 NEURAL CODEX - AI Blog Generation System")
    print("=" * 60)
    
    print("\n📋 Available Commands:")
    print("1. Generate daily blog post (random persona)")
    print("2. Generate with specific persona")
    print("3. List all personas")
    print("4. Test news fetching")
    print("5. Run system tests")
    print("6. Exit")
    
    while True:
        try:
            choice = input("\n🔮 Select option (1-6): ").strip()
            
            if choice == "1":
                print("\n🎲 Generating daily blog post with random persona...")
                os.system("python blog_generator.py")
                
            elif choice == "2":
                print("\n🤖 Available personas:")
                print("   - neural_sage (The Neural Sage)")
                print("   - code_alchemist (The Code Alchemist)")
                print("   - cyber_oracle (The Cyber Oracle)")
                
                persona = input("\n👤 Enter persona key: ").strip()
                if persona in ["neural_sage", "code_alchemist", "cyber_oracle"]:
                    print(f"\n🔄 Generating blog post with {persona}...")
                    os.system(f"python blog_generator.py generate {persona}")
                else:
                    print("❌ Invalid persona. Please try again.")
                    
            elif choice == "3":
                print("\n🎭 Listing all available personas...")
                os.system("python blog_generator.py list")
                
            elif choice == "4":
                print("\n📰 Testing news fetching...")
                os.system("python -c \"from news_fetcher import fetch_tech_news; news = fetch_tech_news(5); print(f'Fetched {len(news)} articles'); [print(f'{i+1}. {article[\"title\"]}') for i, article in enumerate(news)]\"")
                
            elif choice == "5":
                print("\n🧪 Running system tests...")
                os.system("python test_blog_system.py")
                
            elif choice == "6":
                print("\n👋 Goodbye! Keep coding the future!")
                break
                
            else:
                print("❌ Invalid choice. Please select 1-6.")
                
        except KeyboardInterrupt:
            print("\n\n👋 Goodbye! Keep coding the future!")
            break
        except Exception as e:
            print(f"\n❌ Error: {e}")

if __name__ == "__main__":
    # Change to the blog_scripts directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    blog_scripts_dir = os.path.join(script_dir, "src", "home", "blog_scripts")
    
    if os.path.exists(blog_scripts_dir):
        os.chdir(blog_scripts_dir)
    elif os.path.exists("blog_scripts"):
        os.chdir("blog_scripts")
    elif os.path.exists("src/home/blog_scripts"):
        os.chdir("src/home/blog_scripts")
    
    main()
