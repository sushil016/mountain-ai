# Flowchart Video Generator Backend

A powerful FastAPI backend server that generates animated flowchart videos from natural language text prompts using Manim (Mathematical Animation Engine).

## 🚀 Features

- **Natural Language Processing**: Converts text prompts into flowchart structures
- **Animated Video Generation**: Creates professional animated videos using Manim
- **Multiple Node Types**: Supports start, end, process, decision, and data nodes
- **Smart Layout**: Automatically arranges nodes in logical flowchart layouts
- **Video Optimization**: Compresses and optimizes videos for web delivery
- **Rate Limiting**: Prevents API abuse with configurable rate limits
- **Security**: Input validation and sanitization to prevent injection attacks
- **Background Processing**: Async video generation with status tracking
- **RESTful API**: Clean, documented API endpoints
- **Health Monitoring**: System statistics and dependency checking

## 🛠 Technology Stack

- **FastAPI**: Modern, fast web framework for building APIs
- **Manim**: Mathematical animation engine for video generation
- **Python 3.8+**: Core programming language
- **FFmpeg**: Video processing and optimization
- **spaCy**: Natural language processing (optional)
- **Uvicorn**: ASGI server for running the application

## 📋 Prerequisites

- Python 3.8 or higher
- FFmpeg (for video processing)
- Cairo and Pango (for Manim rendering)

### macOS
```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install system dependencies
brew install ffmpeg cairo pango
```

### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install -y ffmpeg libcairo2-dev libpango1.0-dev
```

### CentOS/RHEL/Fedora
```bash
# CentOS/RHEL
sudo yum install -y ffmpeg cairo-devel pango-devel

# Fedora
sudo dnf install -y ffmpeg cairo-devel pango-devel
```

## 🔧 Installation

### Quick Installation (Recommended)

1. **Clone and navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Run the installation script**:
   ```bash
   chmod +x install.sh
   ./install.sh
   ```

3. **Start the server**:
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

### Manual Installation

1. **Create and activate virtual environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Download spaCy language model** (optional):
   ```bash
   python -m spacy download en_core_web_sm
   ```

4. **Start the server**:
   ```bash
   python run.py
   ```

## 🌐 API Usage

The server runs on `http://localhost:8000` by default.

### API Documentation
- **Interactive docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health check**: http://localhost:8000/health

### Core Endpoints

#### 1. Generate Video
```http
POST /api/generate-video
Content-Type: application/json

{
  "prompt": "Flowchart for user login process: Start -> Check credentials -> If valid, go to dashboard -> If invalid, show error -> End",
  "quality": "medium_quality",
  "format": "mp4"
}
```

**Response**:
```json
{
  "success": true,
  "video_id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "processing",
  "message": "Video generation started",
  "complexity_analysis": {
    "complexity": "medium",
    "estimated_time_seconds": 30,
    "word_count": 15,
    "decision_points": 2
  }
}
```

#### 2. Check Video Status
```http
GET /api/video-status/{video_id}
```

**Response**:
```json
{
  "success": true,
  "video_id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "completed",
  "video_url": "/api/videos/123e4567-e89b-12d3-a456-426614174000",
  "file_size_mb": 2.5,
  "duration": 15.0
}
```

#### 3. Download Video
```http
GET /api/videos/{video_id}
```

Returns the video file directly for download or streaming.

#### 4. Delete Video
```http
DELETE /api/videos/{video_id}
```

### Example Prompts

#### Simple Process Flow
```
"Start -> Process data -> Save results -> End"
```

#### Decision-Based Flow
```
"Begin user registration -> Check if email exists -> If yes, show error -> If no, create account -> Send confirmation email -> End"
```

#### Complex Business Process
```
"Order processing workflow: Receive order -> Validate inventory -> If available, process payment -> If payment successful, ship order -> Update customer -> If payment fails, notify customer -> If inventory low, backorder item -> End"
```

## ⚙️ Configuration

Key configuration options in `config.py`:

```python
# Video Generation Settings
MAX_PROMPT_LENGTH = 1000
MAX_NODES = 20
MAX_CONCURRENT_REQUESTS = 3
VIDEO_QUALITY = "medium_quality"  # low_quality, medium_quality, high_quality

# Rate Limiting
RATE_LIMIT_REQUESTS = 10
RATE_LIMIT_WINDOW = 60  # seconds

# File Settings
MAX_VIDEO_SIZE_MB = 50
CLEANUP_AFTER_HOURS = 24
```

## 🔒 Security Features

- **Input Validation**: Sanitizes prompts to prevent injection attacks
- **Rate Limiting**: Prevents API abuse
- **File Size Limits**: Prevents resource exhaustion
- **CORS Configuration**: Secure cross-origin requests
- **Request Timeout**: Prevents long-running requests
- **Error Handling**: Graceful error responses without exposing internals

## 📊 Monitoring

### Health Check
```bash
curl http://localhost:8000/health
```

### System Statistics
```bash
curl http://localhost:8000/api/stats
```

### Logs
The application logs important events including:
- Video generation requests
- Success/failure rates
- Performance metrics
- Error details

## 🔧 Development

### Project Structure
```
backend/
├── main.py              # FastAPI application
├── config.py            # Configuration settings
├── middleware.py        # Security and rate limiting
├── utils.py             # Utility functions
├── run.py               # Server startup script
├── services/
│   ├── prompt_parser.py     # Text prompt parsing
│   ├── manim_generator.py   # Video generation
│   └── video_processor.py   # Video optimization
├── temp/                # Temporary files
├── videos/              # Generated videos
├── requirements.txt     # Python dependencies
├── install.sh          # Installation script
└── start.sh            # Startup script
```

### Adding New Features

1. **Custom Node Types**: Extend `prompt_parser.py` to recognize new node types
2. **Animation Styles**: Modify `manim_generator.py` to add new animation effects
3. **Video Formats**: Update `video_processor.py` for additional output formats
4. **API Endpoints**: Add new routes in `main.py`

### Testing

Run the test suite:
```bash
python -m pytest test_app.py -v
```

## 🚨 Troubleshooting

### Common Issues

1. **Manim installation fails**:
   - Ensure system dependencies (Cairo, Pango, FFmpeg) are installed
   - Try installing Manim with: `pip install manim[jupyterlab]`

2. **FFmpeg not found**:
   - Install FFmpeg using your system package manager
   - Ensure FFmpeg is in your system PATH

3. **Video generation timeout**:
   - Simplify your prompt
   - Reduce video quality setting
   - Check system resources

4. **Port already in use**:
   - Change port in `run.py`: `uvicorn.run(..., port=8001)`
   - Or kill existing process: `lsof -ti:8000 | xargs kill`

### Performance Optimization

1. **Reduce video quality** for faster generation
2. **Limit concurrent requests** based on system resources
3. **Enable video caching** for repeated prompts
4. **Use SSD storage** for faster file I/O

## 📝 API Reference

### Request/Response Models

#### VideoGenerationRequest
```python
{
  "prompt": str,           # Required: Text description
  "quality": str,          # Optional: "low_quality" | "medium_quality" | "high_quality"
  "format": str            # Optional: "mp4" | "webm" | "avi"
}
```

#### VideoStatusResponse
```python
{
  "success": bool,
  "video_id": str,
  "status": str,           # "processing" | "completed" | "failed"
  "video_url": str,        # Available when status is "completed"
  "file_size_mb": float,
  "duration": float
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Manim Community](https://www.manim.community/) - For the amazing animation engine
- [FastAPI](https://fastapi.tiangolo.com/) - For the excellent web framework
- [FFmpeg](https://ffmpeg.org/) - For video processing capabilities

---

**Made with ❤️ for creating beautiful animated flowcharts**