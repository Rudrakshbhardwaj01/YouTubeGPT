/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'monospace'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Hacker theme colors
        'dark': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        'neon': {
          green: '#00ff41',
          cyan: '#00ffff',
          blue: '#0080ff',
          purple: '#8000ff',
          pink: '#ff0080',
          red: '#ff0040',
        },
        'terminal': {
          bg: '#0a0a0a',
          fg: '#00ff41',
          muted: '#00ff4140',
          border: '#00ff4160',
        }
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite alternate',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'type': 'type 2s steps(40) 1s 1 normal both',
      },
      keyframes: {
        'pulse-neon': {
          '0%': { 
            textShadow: '0 0 5px #00ff41, 0 0 10px #00ff41, 0 0 15px #00ff41',
            boxShadow: '0 0 5px #00ff41, 0 0 10px #00ff41, 0 0 15px #00ff41'
          },
          '100%': { 
            textShadow: '0 0 2px #00ff41, 0 0 5px #00ff41, 0 0 8px #00ff41',
            boxShadow: '0 0 2px #00ff41, 0 0 5px #00ff41, 0 0 8px #00ff41'
          }
        },
        'glow': {
          '0%': { 
            boxShadow: '0 0 5px #00ff41, 0 0 10px #00ff41, 0 0 15px #00ff41, inset 0 0 5px #00ff41'
          },
          '100%': { 
            boxShadow: '0 0 2px #00ff41, 0 0 5px #00ff41, 0 0 8px #00ff41, inset 0 0 2px #00ff41'
          }
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'type': {
          '0%': { width: '0' },
          '100%': { width: '100%' }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
