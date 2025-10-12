import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Loader2, Youtube, Zap, Terminal } from 'lucide-react';

const VideoInput = ({ onVideoProcessed, isLoading }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!videoUrl.trim()) {
      setError('Please enter a YouTube video URL');
      return;
    }

    try {
      await onVideoProcessed(videoUrl);
      setVideoUrl('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <motion.div 
      className="card-glow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Terminal Header */}
      <div className="terminal-header">
        <div className="flex items-center gap-2">
          <div className="terminal-dot terminal-dot-red" />
          <div className="terminal-dot terminal-dot-yellow" />
          <div className="terminal-dot terminal-dot-green" />
        </div>
        <div className="flex items-center gap-2 text-sm text-terminal-muted">
          <Terminal className="w-4 h-4" />
          <span>VIDEO_PROCESSOR.exe</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center gap-4 mb-8">
        <motion.div 
          className="relative"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="p-4 bg-dark-900 border-2 border-neon-green neon-glow">
            <Youtube className="w-8 h-8 text-neon-green" />
          </div>
          <motion.div 
            className="absolute -top-2 -right-2 w-4 h-4 bg-neon-cyan rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold text-neon-green neon-text mb-2">
            VIDEO_INPUT_MODULE
          </h2>
          <p className="text-sm text-neon-cyan font-mono">
            &gt; Initialize YouTube video processing pipeline
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="video-url" className="block text-sm font-medium text-neon-cyan mb-3 font-mono">
            [INPUT] YouTube Video URL
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-terminal-muted">
              <Zap className="w-5 h-5" />
            </div>
            <input
              id="video-url"
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="input-field pl-12"
              disabled={isLoading}
              aria-describedby="video-url-help"
              aria-required="true"
            />
            <motion.div 
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <span className="text-terminal-muted text-sm font-mono">[ENTER]</span>
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 bg-dark-900/50 border-2 border-neon-red neon-glow"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-neon-red rounded-full animate-pulse" />
                <p className="text-sm text-neon-red font-mono">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="submit"
          disabled={isLoading || !videoUrl.trim()}
          className="btn-primary w-full flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-describedby="submit-help"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="font-mono">[PROCESSING]</span>
              <span className="text-terminal-muted">Initializing AI pipeline...</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span className="font-mono">[EXECUTE]</span>
              <span>Process Video</span>
            </>
          )}
          
          {/* Animated background effect */}
          <motion.div 
            className="absolute inset-0 bg-neon-green/10"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </motion.button>

        {/* Status indicator */}
        <div className="flex items-center justify-center gap-2 text-xs text-terminal-muted">
          <motion.div 
            className="w-2 h-2 bg-neon-green rounded-full"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="font-mono">
            {isLoading ? "AI_ENGINE: PROCESSING" : "AI_ENGINE: STANDBY"}
          </span>
        </div>
      </form>
    </motion.div>
  );
};

export default VideoInput;
