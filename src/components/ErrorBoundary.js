import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Terminal } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <motion.div 
          className="min-h-screen bg-terminal-bg text-neon-green font-mono flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-2xl w-full">
            <motion.div 
              className="card-glow"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
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
                  <span>ERROR_HANDLER.exe</span>
                </div>
              </div>

              {/* Error Content */}
              <div className="text-center py-12">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                  className="mb-6"
                >
                  <AlertTriangle className="w-20 h-20 text-neon-red mx-auto neon-glow" />
                </motion.div>
                
                <h1 className="text-2xl font-bold text-neon-red neon-text mb-4">
                  SYSTEM_ERROR
                </h1>
                
                <p className="text-neon-cyan mb-6 font-mono">
                  &gt; An unexpected error occurred in the application
                </p>
                
                <p className="text-terminal-muted text-sm mb-8 font-mono">
                  The application encountered an error and needs to be restarted.
                  This has been logged for debugging purposes.
                </p>

                <motion.button
                  onClick={this.handleRetry}
                  className="btn-primary flex items-center gap-2 mx-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="font-mono">[RESTART]</span>
                  <span>Retry Application</span>
                </motion.button>

                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <motion.details 
                    className="mt-8 text-left"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <summary className="cursor-pointer text-neon-cyan font-mono mb-4">
                      [DEBUG] Error Details
                    </summary>
                    <div className="code-block text-xs">
                      <pre className="whitespace-pre-wrap">
                        {this.state.error && this.state.error.toString()}
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  </motion.details>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
