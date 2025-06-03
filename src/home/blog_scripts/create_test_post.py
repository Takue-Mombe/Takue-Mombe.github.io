"""
Simple test to verify blog post structure and comment generation
"""

import json
import os
import sys
from datetime import datetime

# Add the parent directory to sys.path to import our modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from news_fetcher import fetch_tech_news, get_fallback_topics

def create_test_blog_post():
    """Create a test blog post with mock AI-generated comments"""
    
    # Get news
    print("🔍 Fetching news...")
    news = fetch_tech_news(3)
    
    if news:
        selected_article = news[0]
        print(f"📰 Selected: {selected_article['title']}")
    else:
        print("⚠️ Using fallback news")
        fallback = get_fallback_topics()
        selected_article = fallback[0]
    
    # Create mock blog post
    test_post = {
        "title": f"Analysis: {selected_article['title']}",
        "summary": f"A deep dive into {selected_article['description'][:80]}...",
        "date": datetime.now().strftime('%Y.%m.%d'),
        "slug": datetime.now().strftime('%Y%m%d_test'),
        "tags": ["AI", "Technology", "News Analysis"],
        "author": "The Code Alchemist",
        "content": f"""
        <h2>Understanding the Impact</h2>
        <p>Today we're analyzing an important development in technology: {selected_article['title']}.</p>
        
        <p>{selected_article['description']}</p>
        
        <h3>Technical Implications</h3>
        <p>This development represents a significant shift in how we approach technology solutions. 
        From a developer's perspective, this opens up new possibilities for innovation and efficiency.</p>
        
        <p>The key takeaway is that we're witnessing rapid evolution in the tech landscape, 
        and staying informed about these changes is crucial for any developer or tech enthusiast.</p>
        """,
        "generated_at": datetime.now().isoformat(),
        "comments": [
            {
                "author": "The Neural Sage",
                "persona_key": "neural_sage",
                "content": "This technological evolution reflects the deeper patterns of human consciousness expanding through digital mediums. We're not just building tools—we're crafting extensions of our collective intelligence that will reshape how we perceive reality itself.",
                "timestamp": datetime.now().isoformat()
            },
            {
                "author": "The Cyber Oracle",
                "persona_key": "cyber_oracle",
                "content": "Mark my words: this is just the beginning. Within the next 6 months, we'll see this technology integrated into at least three major platforms. The companies that move fast on this will own the next wave of innovation. Those that hesitate will be left debugging yesterday's solutions.",
                "timestamp": datetime.now().isoformat()
            }
        ],
        "original_article": selected_article
    }
    
    # Save to static/blogs directory
    blogs_dir = os.path.join("..", "..", "..", "static", "blogs")
    os.makedirs(blogs_dir, exist_ok=True)
    
    filename = os.path.join(blogs_dir, f"{test_post['slug']}.json")
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(test_post, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Test blog post created: {filename}")
    print(f"📝 Title: {test_post['title']}")
    print(f"💬 Comments: {len(test_post['comments'])}")
    
    return filename

if __name__ == "__main__":
    print("🧪 Creating test blog post with comments...")
    create_test_blog_post()
    print("🎉 Test complete! Check your blog frontend to see the result.")
