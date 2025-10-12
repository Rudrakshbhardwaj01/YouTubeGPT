import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ErrorBoundary from './components/ErrorBoundary';
import VideoInput from './components/VideoInput';
import QuestionBox from './components/QuestionBox';
import AnswerCard from './components/AnswerCard';
import HistoryList from './components/HistoryList';
import StatusBanner from './components/StatusBanner';
import { processVideo, askQuestion, getHistory, clearHistory } from './services/api';
import { Youtube, AlertCircle, Cpu, Database, Zap } from 'lucide-react';

function App() {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [history, setHistory] = useState([]);
  const [isProcessingVideo, setIsProcessingVideo] = useState(false);
  const [isAskingQuestion, setIsAskingQuestion] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [error, setError] = useState('');
  const [transcriptStatus, setTranscriptStatus] = useState('waiting'); // 'waiting', 'loading', 'success', 'error'

  // Load history on component mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const response = await getHistory();
      setHistory(response.history || []);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleVideoProcessed = async (videoUrl) => {
    try {
      setIsProcessingVideo(true);
      setError('');
      setAnswers([]);
      setTranscriptStatus('loading');
      
      const response = await processVideo(videoUrl);
      
      setCurrentVideo({
        url: videoUrl,
        videoId: response.video_id
      });
      
      setTranscriptStatus('success');
      
      // Load updated history
      await loadHistory();
    } catch (err) {
      setError(err.message);
      setTranscriptStatus('error');
    } finally {
      setIsProcessingVideo(false);
    }
  };

  const handleQuestionSubmit = async (question) => {
    try {
      setIsAskingQuestion(true);
      setError('');
      
      const response = await askQuestion(question);
      
      // Add new answer to the top of the answers array
      const newAnswer = {
        id: Date.now(),
        question: question,
        answer: response.answer,
        timestamp: new Date().toISOString()
      };
      
      setAnswers(prevAnswers => [newAnswer, ...prevAnswers]);
      
      // Load updated history
      await loadHistory();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAskingQuestion(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      await clearHistory();
      setHistory([]);
      setAnswers([]);
      setTranscriptStatus('waiting');
    } catch (err) {
      setError(err.message);
    }
  };

  const clearError = () => setError('');

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-terminal-bg text-neon-green font-mono">
        {/* Animated Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-terminal-bg via-dark-950 to-terminal-bg opacity-50" />
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,65,0.03),transparent_50%)]" />
      
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative bg-dark-900/90 backdrop-blur-sm border-b-2 border-terminal-border"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <motion.div 
              className="flex items-center gap-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="relative">
                <div className="p-3 bg-dark-900 border-2 border-neon-green neon-glow">
                  <Youtube className="w-8 h-8 text-neon-green" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-green rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neon-green neon-text">
                  YT_ANALYZER.exe
                </h1>
                <p className="text-sm text-neon-cyan font-mono">
                  &gt; AI-Powered Video Intelligence Terminal
                </p>
              </div>
            </motion.div>
            
            <div className="flex items-center gap-4">
              <motion.div 
                className="flex items-center gap-2 text-xs text-terminal-muted"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Cpu className="w-4 h-4" />
                <span>AI_ENGINE: ONLINE</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2 text-xs text-terminal-muted"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                <Database className="w-4 h-4" />
                <span>VECTOR_DB: READY</span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Status Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 mb-6">
        <StatusBanner 
          status={transcriptStatus} 
          isProcessing={isProcessingVideo} 
        />
      </div>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="mb-6 p-4 bg-dark-900/90 border-2 border-neon-red neon-glow backdrop-blur-sm"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-neon-red flex-shrink-0 mt-0.5 neon-text" />
                <div className="flex-1">
                  <p className="text-sm text-neon-red font-mono">{error}</p>
                </div>
                <button
                  onClick={clearError}
                  className="text-neon-red hover:text-neon-cyan text-sm font-mono transition-colors duration-200"
                >
                  [DISMISS]
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Video Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <VideoInput
              onVideoProcessed={handleVideoProcessed}
              isLoading={isProcessingVideo}
            />
          </motion.div>

          {/* Question Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <QuestionBox
              onQuestionSubmit={handleQuestionSubmit}
              isLoading={isAskingQuestion}
              disabled={!currentVideo}
            />
          </motion.div>

          {/* Answers Section */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {answers.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-neon-green neon-text font-mono">
                  AI_RESPONSES
                </h2>
                <AnimatePresence>
                  {answers.map((answer, index) => (
                    <motion.div
                      key={answer.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <AnswerCard
                        answer={answer.answer}
                        question={answer.question}
                        timestamp={answer.timestamp}
                        isLoading={false}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>

        {/* History Section */}
        <motion.div 
          className="mt-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <HistoryList
            history={history}
            onClearHistory={handleClearHistory}
            isLoading={isLoadingHistory}
          />
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer 
        className="relative bg-dark-900/90 backdrop-blur-sm border-t-2 border-terminal-border mt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="text-center text-sm text-terminal-muted font-mono">
              <p>&gt; Powered by NVIDIA AI • React + Tailwind CSS • Framer Motion</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-terminal-muted">
              <Zap className="w-4 h-4" />
              <span>v2.0.1</span>
            </div>
          </div>
        </div>
      </motion.footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;
