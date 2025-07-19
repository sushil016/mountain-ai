#!/bin/bash

# Start script for Flowchart Video Generator Backend

echo "🚀 Starting Flowchart Video Generator Backend..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found. Please run ./install.sh first."
    exit 1
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Check if basic dependencies are installed
python -c "
import fastapi, uvicorn
print('✅ Basic dependencies check passed')
" 2>/dev/null || {
    echo "❌ Basic dependencies not properly installed. Please run ./install.sh first."
    exit 1
}

# Check if Manim is installed (optional for basic API functionality)
python -c "
import manim
print('✅ Manim is available - full video generation enabled')
" 2>/dev/null || {
    echo "⚠️  Manim not installed - video generation will be limited"
    echo "   Run 'pip install manim' to enable full functionality"
}

# Start the server
echo "🌐 Starting FastAPI server..."
echo "   URL: http://localhost:8000"
echo "   Docs: http://localhost:8000/docs"
echo "   Health: http://localhost:8000/health"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=================================================="

python run.py
