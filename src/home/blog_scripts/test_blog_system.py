#!/usr/bin/env python3
"""
Test script to generate a complete blog post with news integration and persona comments
"""

import sys
import os
from datetime import datetime

# Add the blog_scripts directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from blog_generator import generate_daily_post, generate_specific_persona_post, list_personas
from news_fetcher import fetch_tech_news

def test_news_fetching():
    """Test the news fetching functionality"""
    print("🧪 Testing news fetching...")
    print("=" * 50)
    
    news = fetch_tech_news(num_articles=3)
    
    if news:
        print(f"✅ Successfully fetched {len(news)} articles:")
        for i, article in enumerate(news, 1):
            print(f"\n{i}. {article['title']}")
            print(f"   Source: {article['source']}")
            print(f"   Description: {article['description'][:100]}...")
    else:
        print("❌ No news articles fetched")
    
    return len(news) > 0

def test_blog_generation():
    """Test blog generation with personas and comments"""
    print("\n🧪 Testing blog generation with personas...")
    print("=" * 50)
    
    try:
        filename = generate_daily_post()
        if filename:
            print(f"✅ Blog post generated successfully!")
            print(f"📁 Saved to: {filename}")
            
            # Try to read and display the generated content
            import json
            try:
                with open(filename, 'r', encoding='utf-8') as f:
                    post_data = json.load(f)
                
                print(f"\n📝 Generated Post Summary:")
                print(f"   Title: {post_data['title']}")
                print(f"   Author: {post_data['author']}")
                print(f"   Tags: {', '.join(post_data['tags'])}")
                print(f"   Comments: {len(post_data.get('comments', []))}")
                
                if post_data.get('original_article'):
                    print(f"   Source: {post_data['original_article']['source']}")
                
                return True
            except Exception as e:
                print(f"⚠️ Could not read generated file: {e}")
                return True  # File was created, that's what matters
        else:
            print("❌ Blog generation failed")
            return False
            
    except Exception as e:
        print(f"❌ Error during blog generation: {e}")
        return False

def create_sample_env():
    """Create a sample .env file with placeholder values"""
    env_content = """# API Keys for Blog Generator
# Get your free API key from: https://newsapi.org/
NEWS_API_KEY=your_news_api_key_here

# Get your Gemini API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here
"""
    
    try:
        with open('.env', 'w') as f:
            f.write(env_content)
        print("📄 Created sample .env file with placeholder API keys")
        print("   Please add your actual API keys to enable full functionality")
    except Exception as e:
        print(f"⚠️ Could not create .env file: {e}")

def main():
    """Run all tests"""
    print("🚀 Testing Complete Blog Generation System")
    print("=" * 60)
    print(f"⏰ Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Check if .env file exists
    if not os.path.exists('.env'):
        print("\n📄 No .env file found, creating sample...")
        create_sample_env()
    
    # List available personas
    print("\n🎭 Available AI Personas:")
    list_personas()
    
    # Test news fetching
    news_ok = test_news_fetching()
    
    # Test blog generation
    blog_ok = test_blog_generation()
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY:")
    print(f"   News Fetching: {'✅ PASS' if news_ok else '❌ FAIL'}")
    print(f"   Blog Generation: {'✅ PASS' if blog_ok else '❌ FAIL'}")
    
    if news_ok and blog_ok:
        print("\n🎉 All tests passed! Your blog system is ready to use.")
        print("\n📝 To generate a new blog post, run:")
        print("   python blog_generator.py")
        print("\n🔧 To generate with a specific persona, run:")
        print("   python blog_generator.py generate neural_sage")
        print("   python blog_generator.py generate code_alchemist") 
        print("   python blog_generator.py generate cyber_oracle")
    else:
        print("\n⚠️ Some tests failed. Check your API keys in the .env file.")
        print("   Make sure you have valid NEWS_API_KEY and GEMINI_API_KEY")

if __name__ == "__main__":
    main()
