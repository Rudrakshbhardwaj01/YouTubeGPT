import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, ChevronRight, Trash2, Bot, User, Clock, Database, Zap } from 'lucide-react';

const HistoryList = ({ history, onClearHistory, isLoading }) => {
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      try {
        await onClearHistory();
      } catch (err) {
        console.error('Failed to clear history:', err);
      }
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown time';
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
      return 'Unknown time';
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
            <Database className="w-4 h-4" />
            <span>HISTORY_DB.exe</span>
          </div>
        </div>
        
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <motion.div 
              key={i} 
              className="loading-pulse h-16 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            />
          ))}
        </div>
      </motion.div>
    );
  }

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
          <Database className="w-4 h-4" />
          <span>HISTORY_DB.exe</span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          {history.length > 0 && (
            <motion.button
              onClick={handleClearHistory}
              className="flex items-center gap-1 text-xs text-terminal-muted hover:text-neon-red transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trash2 className="w-3 h-3" />
              <span>CLEAR_ALL</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center gap-4 mb-6">
        <motion.div 
          className="relative"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="p-4 bg-dark-900 border-2 border-neon-purple neon-glow">
            <History className="w-8 h-8 text-neon-purple" />
          </div>
          <motion.div 
            className="absolute -top-2 -right-2 w-4 h-4 bg-neon-cyan rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          />
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold text-neon-purple neon-text mb-2">
            QUERY_HISTORY
          </h2>
          <p className="text-sm text-neon-cyan font-mono">
            &gt; Access previous AI interactions
          </p>
        </div>
      </div>

      {history.length === 0 ? (
        <motion.div 
          className="flex flex-col items-center justify-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mb-4"
          >
            <Database className="w-16 h-16 text-terminal-muted" />
          </motion.div>
          <p className="text-terminal-muted text-center font-mono">
            &gt; No query history found
          </p>
          <p className="text-terminal-muted text-sm text-center font-mono mt-2">
            Submit queries to build interaction database
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {history.map((item, index) => {
              const isExpanded = expandedItems.has(item.id);
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-dark-900/50 border border-terminal-border overflow-hidden"
                >
                  <motion.button
                    onClick={() => toggleExpanded(item.id)}
                    className="w-full p-4 text-left hover:bg-dark-900/30 transition-colors"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-neon-cyan flex-shrink-0" />
                          <span className="text-xs text-terminal-muted font-mono">
                            Q{item.id.toString().padStart(3, '0')}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-neon-green font-mono truncate">
                          {item.question}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="flex items-center gap-1 text-xs text-terminal-muted">
                          <Clock className="w-3 h-3" />
                          <span className="font-mono">
                            {formatTimestamp(item.timestamp)}
                          </span>
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="w-4 h-4 text-terminal-muted" />
                        </motion.div>
                      </div>
                    </div>
                  </motion.button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-terminal-border bg-dark-950/50"
                      >
                        <div className="p-4">
                          <div className="flex items-start gap-3">
                            <Bot className="w-4 h-4 text-neon-purple flex-shrink-0 mt-1" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-3 h-3 text-neon-green" />
                                <span className="text-xs text-neon-green font-mono">AI_RESPONSE</span>
                              </div>
                              <div className="terminal-window">
                                <p className="text-sm text-neon-green font-mono whitespace-pre-wrap leading-relaxed">
                                  {item.answer}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Status Bar */}
      <div className="flex items-center justify-between mt-6 text-xs text-terminal-muted font-mono">
        <div className="flex items-center gap-4">
          <span>ENTRIES: {history.length}</span>
          <span>STATUS: {history.length > 0 ? 'ACTIVE' : 'EMPTY'}</span>
        </div>
        <div className="flex items-center gap-2">
          <motion.div 
            className="w-2 h-2 bg-neon-purple rounded-full"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span>READY</span>
        </div>
      </div>
    </motion.div>
  );
};

export default HistoryList;
