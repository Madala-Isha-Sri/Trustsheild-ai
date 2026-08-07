/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#030712',
        surface: '#111827',
        surfaceLight: '#1f2937',
        primary: {
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
        },
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
      },
      animation: {
        'blob': 'blob 7s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        }
      }
    },
  },
  plugins: [
    plugin(function({ addBase, addUtilities, theme }) {
      addBase({
        'html': { backgroundColor: theme('colors.background'), color: theme('colors.gray.100') },
        'body': { WebkitFontSmoothing: 'antialiased', overflowX: 'hidden' },
      })
      addUtilities({
        '.glass-panel': {
          backgroundColor: 'rgba(17, 24, 39, 0.4)',
          backdropFilter: 'blur(12px)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: '1px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        },
        '.glass-card': {
          backgroundColor: 'rgba(17, 24, 39, 0.5)',
          backdropFilter: 'blur(4px)',
          borderColor: 'rgba(255, 255, 255, 0.05)',
          borderWidth: '1px',
          borderRadius: '1rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          transitionProperty: 'all',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          transitionDuration: '300ms',
        }
      })
    })
  ],
}
