from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from ytchatbot.ytBotBackend import extract_video_id, fetch_transcript, build_vectorstore, answer_question

app = Flask(__name__)
CORS(app)

# Global variables to store current session data
current_vectorstore = None
current_video_id = None
current_transcript = None
qa_history = []

@app.route('/api/process-video', methods=['POST'])
def process_video():
    global current_vectorstore, current_video_id, current_transcript
    
    try:
        data = request.get_json()
        video_url = data.get('video_url')
        
        if not video_url:
            return jsonify({'error': 'Video URL is required'}), 400
        
        # Extract video ID
        video_id = extract_video_id(video_url)
        
        # Fetch transcript
        transcript = fetch_transcript(video_id)
        
        # Build vectorstore
        embedding_api_key = "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"
        vectorstore = build_vectorstore(transcript, embedding_api_key)
        
        # Store in global variables
        current_vectorstore = vectorstore
        current_video_id = video_id
        current_transcript = transcript
        
        return jsonify({
            'success': True,
            'video_id': video_id,
            'transcript': transcript,
            'message': 'Video processed successfully'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/ask-question', methods=['POST'])
def ask_question():
    global current_vectorstore, qa_history
    
    try:
        if not current_vectorstore:
            return jsonify({'error': 'No video processed yet. Please process a video first.'}), 400
        
        data = request.get_json()
        question = data.get('question')
        
        if not question:
            return jsonify({'error': 'Question is required'}), 400
        
        # Get answer from backend
        llm_api_key = "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"
        answer = answer_question(current_vectorstore, question, llm_api_key)
        
        # Store in history
        qa_entry = {
            'id': len(qa_history) + 1,
            'question': question,
            'answer': answer,
            'timestamp': request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr)
        }
        qa_history.append(qa_entry)
        
        return jsonify({
            'success': True,
            'answer': answer,
            'question': question
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/history', methods=['GET'])
def get_history():
    return jsonify({
        'success': True,
        'history': qa_history
    })

@app.route('/api/transcript', methods=['GET'])
def get_transcript():
    global current_transcript
    
    if not current_transcript:
        return jsonify({'error': 'No transcript available'}), 400
    
    return jsonify({
        'success': True,
        'transcript': current_transcript
    })

@app.route('/api/clear-history', methods=['POST'])
def clear_history():
    global qa_history
    qa_history = []
    return jsonify({'success': True, 'message': 'History cleared'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
