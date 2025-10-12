import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2, AlertCircle, Clock, Database } from 'lucide-react';

const StatusBanner = ({ status, isProcessing }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'waiting':
        return {
          icon: <Clock className="w-5 h-5" />,
          text: 'Waiting for video...',
          className: 'text-terminal-muted border-terminal-border',
          bgClass: 'bg-dark-900/50'
        };
      case 'loading':
        return {
          icon: <Loader2 className="w-5 h-5 animate-spin" />,
          text: 'Loading transcript...',
          className: 'text-neon-cyan border-neon-cyan',
          bgClass: 'bg-dark-900/50'
        };
      case 'success':
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          text: 'Transcript loaded successfully. Ready to answer questions.',
          className: 'text-neon-green border-neon-green',
          bgClass: 'bg-dark-900/50'
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          text: 'Transcript could not be loaded. Please check the video.',
          className: 'text-neon-red border-neon-red',
          bgClass: 'bg-dark-900/50'
        };
      default:
        return {
          icon: <Database className="w-5 h-5" />,
          text: 'System ready',
          className: 'text-terminal-muted border-terminal-border',
          bgClass: 'bg-dark-900/50'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`relative overflow-hidden ${config.bgClass} border-2 ${config.className} rounded-none backdrop-blur-sm`}
      >
        {/* Animated background effect for loading state */}
        {status === 'loading' && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-cyan/10 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        )}
        
        {/* Glow effect for success state */}
        {status === 'success' && (
          <motion.div
            className="absolute inset-0 bg-neon-green/5"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        <div className="relative flex items-center justify-center gap-3 px-4 sm:px-6 py-3 sm:py-4">
          <motion.div
            animate={status === 'loading' ? { rotate: 360 } : {}}
            transition={status === 'loading' ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
          >
            {config.icon}
          </motion.div>
          
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <span className="font-mono text-xs sm:text-sm font-medium">
              {status === 'loading' ? '[PROCESSING]' : 
               status === 'success' ? '[READY]' : 
               status === 'error' ? '[ERROR]' : '[STANDBY]'}
            </span>
            <span className="text-xs sm:text-sm font-mono text-center">
              {config.text}
            </span>
          </div>

          {/* Status indicator dot */}
          <motion.div
            className={`w-2 h-2 rounded-full ${
              status === 'success' ? 'bg-neon-green' :
              status === 'loading' ? 'bg-neon-cyan' :
              status === 'error' ? 'bg-neon-red' : 'bg-terminal-muted'
            }`}
            animate={status === 'loading' ? { 
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1]
            } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>

        {/* Progress bar for loading state */}
        {status === 'loading' && (
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-neon-cyan/30"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default StatusBanner;
