# YouTube Video Chatbot - Hacker Edition

A futuristic, cyberpunk-inspired React frontend for interacting with YouTube videos through AI-powered question answering. Built with React, Tailwind CSS, Framer Motion, and a Python Flask backend.

## Features

- **Video Processing**: Input any YouTube video URL to extract and process its transcript
- **AI-Powered Q&A**: Ask questions about video content and get intelligent, structured answers
- **Streamlined Interface**: Clean, focused layout without transcript clutter
- **Command-Line Interface**: Question input styled like a terminal prompt with Enter key support
- **Structured Answer Display**: Answers organized with headlines, details, evidence, and gap analysis
- **Collapsible History Panel**: Access previous Q&A interactions with smooth animations
- **Hacker Aesthetic**: Dark theme with neon green/cyan accents and monospace fonts
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Error Boundaries**: Graceful error handling with cyberpunk-styled error pages
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

## Tech Stack

### Frontend
- React 18 with functional components and hooks
- Tailwind CSS for styling with custom hacker theme
- Framer Motion for smooth animations and transitions
- Axios for API communication
- Lucide React for icons
- Custom monospace fonts (JetBrains Mono, Fira Code)

### Backend
- Python Flask API
- LangChain for AI integration
- NVIDIA AI endpoints for embeddings and LLM
- ChromaDB for vector storage
- YouTube Transcript API

## Setup Instructions

### 1. Backend Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Start the Flask API server:
```bash
python app.py
```

The API will be available at `http://localhost:5000`

### 2. Frontend Setup

1. Install Node.js dependencies:
```bash
npm install
```

2. Start the React development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## Usage

1. **Process a Video**: Enter a YouTube video URL in the input field and click "Process Video"
2. **Ask Questions**: Once the video is processed, you can ask questions about its content
3. **Browse Transcript**: View and search through the video transcript
4. **View History**: Access your previous questions and answers in the history panel

## API Endpoints

- `POST /api/process-video` - Process a YouTube video
- `POST /api/ask-question` - Ask a question about the video
- `GET /api/transcript` - Get the current video transcript
- `GET /api/history` - Get Q&A history
- `POST /api/clear-history` - Clear Q&A history

## Project Structure

```
ytbot-streamlit/
├── app.py                 # Flask API server
├── requirements.txt       # Python dependencies
├── package.json          # Node.js dependencies
├── tailwind.config.js    # Tailwind CSS configuration
├── public/
│   └── index.html        # HTML template
├── src/
│   ├── index.js          # React entry point
│   ├── index.css         # Global styles
│   ├── App.js            # Main App component
│   ├── services/
│   │   └── api.js        # API service functions
│   └── components/
│       ├── VideoInput.js      # Video URL input component
│       ├── QuestionBox.js     # Question input component
│       ├── AnswerCard.js      # Answer display component
│       ├── HistoryList.js     # Q&A history component
│       └── ErrorBoundary.js   # Error boundary component
└── ytchatbot/
    └── ytBotBackend.py   # Core backend logic (untouched)
```

## Design Philosophy

The frontend follows a cyberpunk/hacker aesthetic with:
- **Dark Terminal Theme**: Black/charcoal backgrounds with neon green and cyan accents
- **Monospace Typography**: JetBrains Mono and Fira Code for authentic terminal feel
- **Terminal Windows**: Each component styled as a terminal window with traffic light dots
- **Neon Glow Effects**: Subtle glowing borders and text shadows for futuristic appeal
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Stacked Answer Cards**: Clean, organized display of AI responses with hover effects
- **Responsive Grid Layout**: Adaptive layout that works on all screen sizes
- **Accessibility First**: ARIA labels, keyboard navigation, and screen reader support

## Development

To run in development mode:

1. Start the backend: `python app.py`
2. Start the frontend: `npm start`
3. Open `http://localhost:3000` in your browser


