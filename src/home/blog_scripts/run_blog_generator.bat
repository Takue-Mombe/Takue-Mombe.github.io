@echo off
echo 🚀 Neural Codex Blog Generator
echo =============================

if "%1"=="list" (
    echo 📋 Listing AI Personas...
    python blog_generator.py list
    goto :end
)

if "%1"=="generate" (
    if "%2"=="" (
        echo 🎲 Generating blog with random persona...
        python blog_generator.py generate
    ) else (
        echo 🤖 Generating blog with %2 persona...
        python blog_generator.py generate %2
    )
    goto :end
)

if "%1"=="news" (
    echo 📰 Fetching latest tech news...
    python news_fetcher.py
    goto :end
)

if "%1"=="setup" (
    echo 🔧 Setting up environment...
    pip install -r requirements.txt
    echo ✅ Dependencies installed!
    echo 📝 Please create .env file with your GEMINI_API_KEY
    goto :end
)

echo 💡 Usage:
echo   run_blog_generator.bat setup              # Install dependencies
echo   run_blog_generator.bat list               # List AI personas
echo   run_blog_generator.bat generate           # Generate with random persona
echo   run_blog_generator.bat generate neural_sage   # Generate with specific persona
echo   run_blog_generator.bat news               # Fetch latest tech news
echo.
echo 🎭 Available personas: neural_sage, code_alchemist, cyber_oracle

:end
pause