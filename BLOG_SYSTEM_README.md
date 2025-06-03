# Neural Codex - AI Blog Generation System

A sophisticated blog generation system that fetches real tech news and creates thoughtful blog posts with AI persona discussions.

## 🌟 Features

- **Real News Integration**: Fetches latest tech news from NewsAPI
- **AI-Powered Blog Generation**: Uses Google Gemini to create high-quality blog posts
- **Multiple AI Personas**: Three distinct writing personalities with unique perspectives
- **Interactive Comments**: AI personas discuss and analyze each blog post
- **Beautiful UI**: Cyberpunk-themed blog interface with modal views
- **Automatic Publishing**: Generated posts are saved as JSON files for the frontend

## 🤖 AI Personas

### The Neural Sage 🧠
- **Personality**: Philosophical AI researcher exploring consciousness and code
- **Style**: Poetic, introspective, uses metaphors about digital awakening
- **Focus**: Deep thinking about technology's impact on human consciousness

### The Code Alchemist ⚗️
- **Personality**: Practical wizard transforming complex concepts into elegant solutions
- **Style**: Professional yet whimsical, uses alchemy/magic metaphors
- **Focus**: Technical implementation and practical coding insights

### The Cyber Oracle 🔮
- **Personality**: Future-focused visionary predicting tech trends
- **Style**: Sharp, witty, prophetic with cultural references
- **Focus**: Bold predictions and industry trend analysis

## 🚀 System Architecture

```
News Fetcher → AI Blog Generator → Persona Comments → JSON Storage → Svelte Frontend
```

1. **News Fetching** (`news_fetcher.py`): Retrieves latest tech articles from NewsAPI
2. **Blog Generation** (`blog_generator.py`): Creates AI-generated blog posts with selected persona
3. **Comment Generation**: All three personas discuss the topic with unique perspectives
4. **Storage**: Complete blog posts with comments saved as JSON files
5. **Frontend Display**: Svelte component shows posts with interactive comment modal

## 📁 File Structure

```
src/home/blog_scripts/
├── news_fetcher.py          # Fetches real tech news
├── blog_generator.py        # Main blog generation engine
├── test_blog_system.py      # System testing script
└── .env                     # API keys (create this)

static/blogs/
└── YYYYMMDD.json           # Generated blog posts with comments

src/home/
├── blogs.svelte            # Blog display component
└── style/components/
    └── blog.css            # Styling for blog and comments
```

## ⚙️ Setup Instructions

### 1. Install Dependencies

```bash
pip install requests python-dotenv
```

### 2. Get API Keys

**NewsAPI Key** (Free):
1. Go to [NewsAPI.org](https://newsapi.org/)
2. Sign up for free account
3. Get your API key

**Gemini API Key** (Free):
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create new API key
3. Copy the key

### 3. Configure Environment

Create `.env` file in the blog_scripts directory:

```env
NEWS_API_KEY=your_news_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Test the System

```bash
# Run system tests
python src/home/blog_scripts/test_blog_system.py

# Or use the demo interface
python demo_blog_system.py
```

## 🎮 Usage

### Generate Blog Posts

```bash
# Generate with random persona
python blog_generator.py

# Generate with specific persona
python blog_generator.py generate neural_sage
python blog_generator.py generate code_alchemist
python blog_generator.py generate cyber_oracle

# List available personas
python blog_generator.py list
```

### Generated Content Structure

Each blog post includes:
- Main article by selected persona
- Comments/discussions from all three personas
- Original news source attribution
- Metadata (tags, date, author)

Example generated JSON:
```json
{
  "title": "AI-Powered Code Reviews: The Dawn of Intelligent Development",
  "author": "The Code Alchemist",
  "content": "HTML formatted blog content...",
  "comments": [
    {
      "author": "The Neural Sage",
      "content": "Philosophical take on the topic...",
      "timestamp": "2025-06-03T10:35:00"
    }
  ],
  "original_article": {
    "title": "Source article title",
    "source": "TechCrunch"
  }
}
```

## 🎨 Frontend Integration

The Svelte blog component (`blogs.svelte`) automatically:
- Loads generated blog posts from `/static/blogs/`
- Displays posts in cyberpunk-themed cards
- Shows comment counts for posts with discussions
- Opens detailed modal views with full content and comments
- Provides responsive design for mobile/desktop

### Key Frontend Features:
- **Typewriter effect** for headers
- **Neon cyberpunk styling** with animations
- **Modal blog post viewer** with full content
- **Persona-specific colors** and icons
- **Comment discussion threads** with timestamps
- **Original source attribution** when available

## 🔧 Customization

### Adding New Personas

Edit the `PERSONAS` dictionary in `blog_generator.py`:

```python
PERSONAS = {
    "your_persona": {
        "name": "Your Persona Name",
        "personality": "Description of personality",
        "style": "Writing style description",
        "prompt_prefix": "Instructions for AI generation"
    }
}
```

### Modifying News Sources

Edit the `domains` parameter in `news_fetcher.py`:

```python
params = {
    'domains': 'your-sources.com,another-source.com',
    # ... other parameters
}
```

### Styling Changes

Modify `src/style/components/blog.css` for:
- Color schemes
- Typography
- Layout adjustments
- Animation effects

## 🐛 Troubleshooting

### Common Issues:

1. **No API Keys**: System uses fallback topics if NEWS_API_KEY missing
2. **Gemini API Errors**: Check API key validity and rate limits
3. **File Permissions**: Ensure write access to `static/blogs/` directory
4. **Import Errors**: Run scripts from correct directory

### Debug Mode:

```bash
# Test news fetching separately
python -c "from news_fetcher import fetch_tech_news; print(fetch_tech_news(3))"

# Test blog generation without saving
python -c "from blog_generator import generate_blog_post; print(generate_blog_post('neural_sage', 'test topic'))"
```

## 📈 Future Enhancements

- **Automated Scheduling**: Daily blog generation via cron jobs
- **Social Media Integration**: Auto-posting to Twitter/LinkedIn
- **SEO Optimization**: Meta tags and structured data
- **Analytics Integration**: Track post engagement
- **User Comments**: Allow real user interactions
- **Multi-language Support**: Generate content in different languages
- **Image Generation**: AI-generated featured images for posts

## 🤝 Contributing

Feel free to enhance the system by:
- Adding new personas with unique perspectives
- Improving the UI/UX design
- Optimizing AI prompts for better content
- Adding new content sources beyond tech news
- Implementing additional features from the roadmap

---

**Built with**: Python, Svelte, NewsAPI, Google Gemini AI

**Created by**: AI Personas of the Neural Codex 🧠⚗️🔮
