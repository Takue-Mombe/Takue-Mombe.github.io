import requests
import datetime
import os
import json
import random
from dotenv import load_dotenv
from news_fetcher import fetch_tech_news, get_random_tech_topic

# Load environment variables from .env file
load_dotenv()

# Get API key from environment variable
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables")

# AI Personas with distinct writing styles
PERSONAS = {
    "neural_sage": {
        "name": "The Neural Sage",
        "personality": "Philosophical, deep-thinking AI expert who connects technology to human consciousness and existential questions",
        "style": "Poetic, introspective, uses metaphors about consciousness and digital awakening",
        "prompt_prefix": "Write as a philosophical AI researcher who sees technology as an extension of human consciousness. Use poetic language and deep metaphors about the intersection of mind and machine."
    },
    "code_alchemist": {
        "name": "The Code Alchemist", 
        "personality": "Practical wizard who transforms complex technical concepts into elegant solutions with a touch of magic",
        "style": "Professional yet whimsical, uses alchemy/magic metaphors for coding practices",
        "prompt_prefix": "Write as a senior developer who treats coding like modern alchemy - transforming raw logic into digital gold. Be professional but inject personality with clever metaphors about crafting code."
    },
    "cyber_oracle": {
        "name": "The Cyber Oracle",
        "personality": "Future-focused visionary who predicts tech trends with wit and sharp insights about digital culture",
        "style": "Sharp, witty, prophetic tone with cultural references and bold predictions",
        "prompt_prefix": "Write as a tech futurist with a sharp wit who makes bold predictions about technology's impact on society. Use cultural references and maintain an authoritative yet playful tone."
    }
}

def get_latest_tech_news():
    """
    Fetch latest tech news using the news_fetcher module
    """
    print("🔍 Fetching latest tech news...")
    news_articles = fetch_tech_news(num_articles=10)
    
    if news_articles:
        # Select a random article for blog generation
        selected_article = random.choice(news_articles)
        topic = f"{selected_article['title']} - {selected_article['description']}"
        return {
            'topic': topic,
            'original_article': selected_article
        }
    else:
        # Fallback to random topic
        return {
            'topic': get_random_tech_topic(),
            'original_article': None
        }

def generate_blog_post(persona_key, topic):
    """Generate a blog post using Gemini API with specific persona"""
    persona = PERSONAS[persona_key]
      prompt = f"""
    {persona['prompt_prefix']}
    
    Topic: {topic}
    
    Write a compelling blog post with the following structure:
    1. A catchy, SEO-friendly title that reflects your personality
    2. An engaging introduction paragraph (80-100 words)
    3. Main content with 2-3 well-developed paragraphs (120-150 words each)
    4. A thought-provoking conclusion (60-80 words)
    5. A brief summary for preview (30-40 words)
    
    Style requirements:
    - Match the {persona['name']} personality: {persona['personality']}
    - Use {persona['style']} writing style
    - Include relevant technical insights
    - Make it engaging for developers and tech enthusiasts
    - Add 3-4 relevant tags
    
    Format as JSON with these fields:
    {{
        "title": "Your catchy title",
        "content": "Full blog post content in clean HTML",
        "summary": "Brief preview summary",
        "tags": ["tag1", "tag2", "tag3"],
        "author": "{persona['name']}"
    }}
    """

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
    
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.8,
            "topK": 40,
            "topP": 0.95,
            "maxOutputTokens": 2048,
        }
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        if response.status_code == 200:
            content = response.json()['candidates'][0]['content']['parts'][0]['text']
            # Clean up the response to extract JSON
            content = content.strip()
            if content.startswith('```json'):
                content = content[7:]
            if content.endswith('```'):
                content = content[:-3]
            content = content.strip()
            
            return json.loads(content)
        else:
            raise Exception(f"Error from Gemini API: {response.status_code}, {response.text}")
    except json.JSONDecodeError as e:
        print(f"Failed to parse JSON response: {e}")
        print(f"Raw response: {content}")
        return None
    except Exception as e:
        print(f"Error generating blog post: {e}")
        return None

def save_blog_post(post_data, comments=None, original_article=None):
    """Save the generated blog post to JSON file with comments"""
    today = datetime.datetime.now()
    date_str = today.strftime('%Y.%m.%d')
    slug = today.strftime('%Y%m%d')
    
    # Ensure the blogs directory exists
    blogs_dir = "../../../static/blogs"
    os.makedirs(blogs_dir, exist_ok=True)
    
    # Complete post data
    complete_post = {
        "title": post_data["title"],
        "summary": post_data["summary"], 
        "date": date_str,
        "slug": slug,
        "tags": post_data["tags"],
        "author": post_data["author"],
        "content": post_data["content"],
        "generated_at": today.isoformat(),
        "comments": comments or [],
        "original_article": original_article
    }
    
    filename = f"{blogs_dir}/{slug}.json"
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(complete_post, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Blog post saved: {filename}")
    print(f"📝 Title: {post_data['title']}")
    print(f"👤 Author: {post_data['author']}")
    if comments:
        print(f"💬 Comments: {len(comments)} persona discussions included")
    return filename

def generate_daily_post():
    """Generate a daily blog post with a random persona, including news and comments"""
    # Get latest tech news
    news_data = get_latest_tech_news()
    topic = news_data['topic']
    original_article = news_data['original_article']
    
    print(f"📰 Topic: {topic}")
    
    # Choose random persona
    persona_key = random.choice(list(PERSONAS.keys()))
    persona_name = PERSONAS[persona_key]["name"]
    print(f"🤖 Selected Persona: {persona_name}")
    
    # Generate main blog post
    print("🔄 Generating blog post...")
    post_data = generate_blog_post(persona_key, topic)
    
    if post_data:
        # Generate persona comments/discussion
        print("💬 Generating persona discussions...")
        comments = generate_persona_comments(topic, original_article)
        
        # Save post with comments
        filename = save_blog_post(post_data, comments, original_article)
        print(f"🎉 Successfully generated blog post with {len(comments)} discussions!")
        return filename
    else:
        print("❌ Failed to generate blog post")
        return None

def generate_specific_persona_post(persona_key):
    """Generate a post with a specific persona, including news and comments"""
    if persona_key not in PERSONAS:
        print(f"❌ Unknown persona: {persona_key}")
        print(f"Available personas: {list(PERSONAS.keys())}")
        return None
    
    # Get latest tech news
    news_data = get_latest_tech_news()
    topic = news_data['topic']
    original_article = news_data['original_article']
    
    print(f"📰 Topic: {topic}")
    print(f"🤖 Persona: {PERSONAS[persona_key]['name']}")
    
    # Generate main blog post
    print("🔄 Generating blog post...")
    post_data = generate_blog_post(persona_key, topic)
    
    if post_data:
        # Generate persona comments/discussion
        print("💬 Generating persona discussions...")
        comments = generate_persona_comments(topic, original_article)
        
        # Save post with comments
        filename = save_blog_post(post_data, comments, original_article)
        print(f"🎉 Successfully generated blog post with {len(comments)} discussions!")
        return filename
    else:
        print("❌ Failed to generate blog post")
        return None

def list_personas():
    """List all available personas"""
    print("\n🎭 Available AI Personas:")
    print("=" * 50)
    for key, persona in PERSONAS.items():
        print(f"\n🤖 {persona['name']} ({key})")
        print(f"   Personality: {persona['personality']}")
        print(f"   Style: {persona['style']}")

def generate_persona_comments(topic, original_article=None):
    """Generate comments from all three personas discussing the topic"""
    comments = []
    
    # Generate comments for each persona
    for persona_key, persona in PERSONAS.items():
        comment_prompt = f"""
        {persona['prompt_prefix']}
        
        You are participating in a discussion about this tech news:
        Topic: {topic}
        
        {'Original source: ' + original_article['source'] if original_article else ''}
        
        Write a thoughtful comment (100-150 words) that:
        1. Reflects your unique perspective as {persona['name']}
        2. Uses your characteristic {persona['style']} style
        3. Provides insights that complement but don't repeat what others might say
        4. Includes a practical takeaway or prediction
        
        Be conversational but insightful. This is a discussion among AI personas about tech trends.
        
        Return just the comment text, no JSON formatting needed.
        """
        
        comment = generate_ai_response(comment_prompt)
        if comment:
            comments.append({
                'author': persona['name'],
                'persona_key': persona_key,
                'content': comment.strip(),
                'timestamp': datetime.datetime.now().isoformat()
            })
    
    return comments

def generate_ai_response(prompt):
    """Generate a single AI response using Gemini API"""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
    
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.7,
            "topK": 40,
            "topP": 0.95,
            "maxOutputTokens": 500,
        }
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        if response.status_code == 200:
            content = response.json()['candidates'][0]['content']['parts'][0]['text']
            return content.strip()
        else:
            print(f"Error from Gemini API: {response.status_code}")
            return None
    except Exception as e:
        print(f"Error generating AI response: {e}")
        return None

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == "list":
            list_personas()
        elif command == "generate":
            if len(sys.argv) > 2:
                persona = sys.argv[2]
                generate_specific_persona_post(persona)
            else:
                generate_daily_post()
        else:
            print("Usage:")
            print("  python blog_generator.py list              # List all personas")
            print("  python blog_generator.py generate          # Generate with random persona")
            print("  python blog_generator.py generate <persona> # Generate with specific persona")
    else:
        generate_daily_post()