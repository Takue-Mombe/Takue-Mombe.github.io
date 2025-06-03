import requests
import os
import random
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

NEWS_API_KEY = os.getenv('NEWS_API_KEY')

def fetch_tech_news(num_articles=5):
    """
    Fetch latest tech news from NewsAPI
    Returns list of article titles and descriptions
    """
    if not NEWS_API_KEY:
        print("⚠️ NEWS_API_KEY not found, using fallback topics")
        return get_fallback_topics()
    
    # Calculate date for recent news (last 7 days)
    from_date = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
    
    url = "https://newsapi.org/v2/everything"
    params = {
        'apiKey': NEWS_API_KEY,
        'q': 'artificial intelligence OR machine learning OR programming OR software development OR tech startup',
        'domains': 'techcrunch.com,arstechnica.com,wired.com,theverge.com,hacker-news.firebaseio.com',
        'language': 'en',
        'sortBy': 'popularity',
        'from': from_date,
        'pageSize': num_articles
    }
    
    try:
        response = requests.get(url, params=params)
        if response.status_code == 200:
            data = response.json()
            articles = data.get('articles', [])
            
            topics = []
            for article in articles:
                title = article.get('title', '')
                description = article.get('description', '')
                if title and description:
                    topics.append({
                        'title': title,
                        'description': description,
                        'source': article.get('source', {}).get('name', 'Unknown'),
                        'url': article.get('url', '')
                    })
            
            return topics
        else:
            print(f"❌ NewsAPI error: {response.status_code}")
            return get_fallback_topics()
            
    except Exception as e:
        print(f"❌ Error fetching news: {e}")
        return get_fallback_topics()

def get_fallback_topics():
    """Fallback tech topics when news API is unavailable"""
    return [
        {
            'title': 'AI Code Assistants Reshape Development Workflow',
            'description': 'Latest AI coding tools are transforming how developers write, debug, and optimize code',
            'source': 'TechTrends',
            'url': '#'
        },
        {
            'title': 'WebAssembly Gains Momentum in Enterprise Applications', 
            'description': 'Major companies adopt WASM for high-performance web applications',
            'source': 'DevNews',
            'url': '#'
        },
        {
            'title': 'Quantum Computing Breakthrough in Error Correction',
            'description': 'Researchers achieve significant progress in quantum error correction algorithms',
            'source': 'SciTech',
            'url': '#'
        },
        {
            'title': 'Edge AI Processing Revolutionizes IoT Devices',
            'description': 'New chips enable sophisticated AI processing directly on IoT hardware',
            'source': 'IoT Weekly',
            'url': '#'
        },
        {
            'title': 'Open Source AI Models Challenge Big Tech Dominance',
            'description': 'Community-driven AI models rival proprietary solutions from major companies',
            'source': 'OpenTech',
            'url': '#'
        }
    ]

def get_random_tech_topic():
    """Get a random tech topic for blog generation"""
    topics = fetch_tech_news()
    if topics:
        selected = random.choice(topics)
        return f"{selected['title']} - {selected['description']}"
    return "Latest developments in artificial intelligence and software development"

if __name__ == "__main__":
    print("🔍 Fetching latest tech news...")
    news = fetch_tech_news()
    
    print(f"\n📰 Found {len(news)} tech articles:")
    print("=" * 60)
    
    for i, article in enumerate(news, 1):
        print(f"\n{i}. {article['title']}")
        print(f"   Source: {article['source']}")
        print(f"   {article['description']}")
        if article['url'] != '#':
            print(f"   URL: {article['url']}")