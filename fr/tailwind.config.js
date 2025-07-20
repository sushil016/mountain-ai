/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-blue': '#00f0ff',
        'neon-purple': '#bf00ff',
        'neon-green': '#00ff41',
        'dark-bg': '#0a0a0a',
        'dark-card': '#1a1a1a',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite alternate',
        'text-shimmer': 'text-shimmer 2.5s ease-in-out infinite',
        'shine': 'shine var(--duration) infinite linear',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-neon': {
          '0%': { boxShadow: '0 0 5px #00f0ff, 0 0 10px #00f0ff, 0 0 15px #00f0ff' },
          '100%': { boxShadow: '0 0 10px #00f0ff, 0 0 20px #00f0ff, 0 0 30px #00f0ff' },
        },
        'text-shimmer': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        shine: {
          '0%': { backgroundPosition: '0% 0%' },
          '50%': { backgroundPosition: '100% 100%' },
          '100%': { backgroundPosition: '0% 0%' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
      fontFamily: {
        'pixel': ['VT323', 'monospace'],
      },
    },
  },
  plugins: [],
}
