# File: blog_generator.py
import requests
import datetime

GEMINI_API_KEY = "AIzaSyBO5Xq_TyvHEkjJG9ny72kBWvvRetp3uOo"

BLOG_PROMPT = """
Act as a witty, poetic tech blogger. Generate a blog post about the latest AI, developer tools, or coding trends. Include a catchy title, 2 paragraphs (about 100-120 words each), and a short summary. Write in HTML format.
"""

def generate_blog():
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": BLOG_PROMPT}
                ]
            }
        ]
    }

    response = requests.post(url, json=payload, headers=headers)
    if response.status_code == 200:
        content = response.json()['candidates'][0]['content']['parts'][0]['text']
        return content
    else:
        raise Exception(f"Error from Gemini API: {response.status_code}, {response.text}")

def save_post_to_json():
    html = generate_blog()
    today = datetime.datetime.today().strftime('%Y-%m-%d')
    post = {
        "title": "AI & Code — Weekly Digest",
        "date": today,
        "slug": today.replace('-', ''),
        "summary": "Explore the latest in dev tools, AI advancements, and clever tech trends from this week.",
        "content": html
    }

    with open(f"static/blogs/{post['slug']}.json", "w", encoding="utf-8") as f:
        import json
        json.dump(post, f, ensure_ascii=False, indent=2)

    print(f"Blog for {today} saved!")

if __name__ == "__main__":
    save_post_to_json()
