import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Copy, Check, Terminal, Brain, Zap, AlertTriangle, FileText } from 'lucide-react';

const AnswerCard = ({ answer, question, timestamp, isLoading }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(answer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const parseAnswer = (answerText) => {
    if (!answerText) return null;
    
    const sections = {
      shortAnswer: '',
      details: '',
      evidence: '',
      gaps: ''
    };

    // Parse the structured answer format
    const lines = answerText.split('\n');
    let currentSection = 'shortAnswer';
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.includes('**Short Answer**') || trimmedLine.includes('1. **Short Answer**')) {
        currentSection = 'shortAnswer';
        continue;
      } else if (trimmedLine.includes('**Details**') || trimmedLine.includes('2. **Details**')) {
        currentSection = 'details';
        continue;
      } else if (trimmedLine.includes('**Evidence**') || trimmedLine.includes('3. **Evidence**')) {
        currentSection = 'evidence';
        continue;
      } else if (trimmedLine.includes('**Gaps**') || trimmedLine.includes('4. **Gaps**')) {
        currentSection = 'gaps';
        continue;
      }
      
      if (trimmedLine && !trimmedLine.startsWith('**')) {
        sections[currentSection] += (sections[currentSection] ? '\n' : '') + trimmedLine;
      }
    }

    return sections;
  };

  const parsedAnswer = parseAnswer(answer);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return '';
    }
  };

  if (isLoading) {
    return (
      <motion.div 
        className="card-glow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="terminal-header">
          <div className="flex items-center gap-2">
            <div className="terminal-dot terminal-dot-red" />
            <div className="terminal-dot terminal-dot-yellow" />
            <div className="terminal-dot terminal-dot-green" />
          </div>
          <div className="flex items-center gap-2 text-sm text-terminal-muted">
            <Brain className="w-4 h-4" />
            <span>AI_RESPONSE.exe</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <motion.div 
              key={i} 
              className="loading-pulse h-4 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            />
          ))}
        </div>
      </motion.div>
    );
  }

  if (!answer) {
    return (
      <motion.div 
        className="card-glow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="terminal-header">
          <div className="flex items-center gap-2">
            <div className="terminal-dot terminal-dot-red" />
            <div className="terminal-dot terminal-dot-yellow" />
            <div className="terminal-dot terminal-dot-green" />
          </div>
          <div className="flex items-center gap-2 text-sm text-terminal-muted">
            <Brain className="w-4 h-4" />
            <span>AI_RESPONSE.exe</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center py-16">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mb-4"
          >
            <Bot className="w-16 h-16 text-terminal-muted" />
          </motion.div>
          <p className="text-terminal-muted text-center font-mono">
            &gt; No response data available
          </p>
          <p className="text-terminal-muted text-sm text-center font-mono mt-2">
            Submit a query to initialize AI response
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="card-glow hover:shadow-lg hover:shadow-neon-green/10 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        scale: 1.01,
        boxShadow: "0 0 30px rgba(0, 255, 65, 0.15), 0 0 60px rgba(0, 255, 65, 0.05)"
      }}
    >
      {/* Terminal Header */}
      <div className="terminal-header">
        <div className="flex items-center gap-2">
          <div className="terminal-dot terminal-dot-red" />
          <div className="terminal-dot terminal-dot-yellow" />
          <div className="terminal-dot terminal-dot-green" />
        </div>
        <div className="flex items-center gap-2 text-sm text-terminal-muted">
          <Brain className="w-4 h-4" />
          <span>AI_RESPONSE.exe</span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <motion.button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-terminal-muted hover:text-neon-cyan transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? 'COPIED' : 'COPY'}
          </motion.button>
        </div>
      </div>

      {/* Question Display */}
      {question && (
        <motion.div 
          className="mb-6 p-4 bg-dark-900/50 border border-terminal-border"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-neon-cyan" />
              <p className="text-sm font-medium text-neon-cyan font-mono">[QUERY]</p>
            </div>
            {timestamp && (
              <div className="flex items-center gap-1 text-xs text-terminal-muted">
                <span className="font-mono">{formatTimestamp(timestamp)}</span>
              </div>
            )}
          </div>
          <p className="text-sm text-neon-green font-mono leading-relaxed">{question}</p>
        </motion.div>
      )}

      {/* Answer Content */}
      <div className="space-y-6">
        {/* Short Answer */}
        {parsedAnswer?.shortAnswer && (
          <motion.div 
            className="answer-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5 text-neon-green" />
              <h3 className="answer-headline">SHORT ANSWER</h3>
            </div>
            <p className="answer-details font-mono">{parsedAnswer.shortAnswer}</p>
          </motion.div>
        )}

        {/* Details */}
        {parsedAnswer?.details && (
          <motion.div 
            className="answer-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-neon-cyan" />
              <h3 className="answer-headline">DETAILS</h3>
            </div>
            <div className="answer-details font-mono whitespace-pre-wrap">
              {parsedAnswer.details}
            </div>
          </motion.div>
        )}

        {/* Evidence */}
        {parsedAnswer?.evidence && (
          <motion.div 
            className="answer-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Terminal className="w-5 h-5 text-neon-green" />
              <h3 className="answer-headline">EVIDENCE</h3>
            </div>
            <div className="answer-evidence font-mono whitespace-pre-wrap">
              {parsedAnswer.evidence}
            </div>
          </motion.div>
        )}

        {/* Gaps */}
        {parsedAnswer?.gaps && (
          <motion.div 
            className="answer-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-neon-red" />
              <h3 className="answer-headline text-neon-red">GAPS</h3>
            </div>
            <div className="answer-gaps font-mono whitespace-pre-wrap">
              {parsedAnswer.gaps}
            </div>
          </motion.div>
        )}

        {/* Fallback for unstructured answers */}
        {!parsedAnswer && (
          <motion.div 
            className="answer-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5 text-neon-green" />
              <h3 className="answer-headline">AI RESPONSE</h3>
            </div>
            <div className="answer-details font-mono whitespace-pre-wrap">
              {answer}
            </div>
          </motion.div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between mt-6 text-xs text-terminal-muted font-mono">
        <div className="flex items-center gap-4">
          <span>STATUS: COMPLETE</span>
          <span>AI_MODEL: QWEN3-NEXT-80B</span>
        </div>
        <div className="flex items-center gap-2">
          <motion.div 
            className="w-2 h-2 bg-neon-green rounded-full"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span>READY</span>
        </div>
      </div>
    </motion.div>
  );
};

export default AnswerCard;
