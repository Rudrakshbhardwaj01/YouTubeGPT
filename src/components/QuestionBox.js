import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Terminal, Bot, Zap, ArrowRight } from 'lucide-react';

const QuestionBox = ({ onQuestionSubmit, isLoading, disabled }) => {
  const [question, setQuestion] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!question.trim() || isLoading || disabled) return;

    try {
      await onQuestionSubmit(question);
      setQuestion('');
    } catch (err) {
      // Error handling is done in parent component
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [question]);

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
          <span>QUERY_INTERFACE.exe</span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <motion.div 
            className="flex items-center gap-1 text-xs text-terminal-muted"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Bot className="w-3 h-3" />
            <span>AI_READY</span>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center gap-4 mb-6">
        <motion.div 
          className="relative"
          whileHover={{ scale: 1.1, rotate: -5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="p-4 bg-dark-900 border-2 border-neon-cyan neon-glow">
            <Bot className="w-8 h-8 text-neon-cyan" />
          </div>
          <motion.div 
            className="absolute -top-2 -right-2 w-4 h-4 bg-neon-green rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold text-neon-cyan neon-text mb-2">
            QUERY_INTERFACE
          </h2>
          <p className="text-sm text-neon-green font-mono">
            &gt; Initialize AI question processing
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-neon-cyan mb-3 font-mono">
            [PROMPT] Enter your question
          </label>
          <div className="relative">
            <div className="absolute left-3 top-3 text-terminal-muted">
              <Zap className="w-5 h-5" />
            </div>
            <textarea
              ref={textareaRef}
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="What is this video about? What are the main points discussed? What did the speaker say about...?"
              className={`input-field pl-12 min-h-[120px] resize-none transition-all duration-300 ${
                isFocused ? 'border-neon-cyan shadow-lg shadow-neon-cyan/20' : ''
              }`}
              disabled={isLoading || disabled}
              rows={3}
            />
            <motion.div 
              className="absolute right-3 top-3 text-xs text-terminal-muted font-mono"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              [ENTER]
            </motion.div>
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={isLoading || disabled || !question.trim()}
          className="btn-secondary w-full flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="font-mono">[PROCESSING]</span>
              <span className="text-terminal-muted">AI is thinking...</span>
            </>
          ) : (
            <>
              <ArrowRight className="w-5 h-5" />
              <span className="font-mono">[EXECUTE]</span>
              <span>Submit Query</span>
            </>
          )}
          
          {/* Animated background effect */}
          <motion.div 
            className="absolute inset-0 bg-neon-cyan/10"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </motion.button>

        {/* Status indicator */}
        <div className="flex items-center justify-center gap-2 text-xs text-terminal-muted">
          <motion.div 
            className="w-2 h-2 bg-neon-cyan rounded-full"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="font-mono">
            {disabled ? "STATUS: AWAITING_VIDEO" : isLoading ? "STATUS: PROCESSING" : "STATUS: READY"}
          </span>
        </div>
      </form>

      <AnimatePresence>
        {disabled && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 p-4 bg-dark-900/50 border border-terminal-border"
          >
            <div className="flex items-center gap-2 text-terminal-muted">
              <div className="w-2 h-2 bg-neon-red rounded-full animate-pulse" />
              <p className="text-sm font-mono text-center">
                &gt; Process a video first to initialize query interface
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default QuestionBox;
