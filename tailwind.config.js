/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'mati': {
          50: '#0a0a0a',  // Darkest background
          100: '#121212', // Card background
          200: '#1a1a1a', // Secondary background
          300: '#262626', // Hover states
          400: '#404040', // Borders
          500: '#737373', // Muted text
          600: '#a3a3a3', // Secondary text
          700: '#e5e5e5', // Primary text
          800: '#f5f5f5', // High contrast text
          900: '#ffffff', // Pure white text
        },
        'accent': {
          50: '#18020b',
          100: '#300413',
          200: '#4a061d',
          300: '#660827',
          400: '#910b37',
          500: '#c70f4a',
          600: '#e41251',
          700: '#f4246a',
          800: '#f95d91',
          900: '#fca5c3',
        },
        'success': {
          500: '#10b981',
          600: '#059669',
        },
        'warning': {
          500: '#f59e0b',
          600: '#d97706',
        },
        'error': {
          500: '#ef4444',
          600: '#dc2626',
        },
      },
    },
  },
  plugins: [],
};