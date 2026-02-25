
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0A1628',
          light: '#162447',
          dark: '#060e1a',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light: '#e0c06a',
          dark: '#a07c2e',
        },
        primary: {
          DEFAULT: '#0A1628',
          light: '#162447',
          dark: '#060e1a',
        },
        accent: {
          DEFAULT: '#C9A84C',
          light: '#e0c06a',
          dark: '#a07c2e',
        },
        success: '#16A34A',
        error: '#DC2626',
        background: '#F8F9FA',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Bebas Neue', 'sans-serif'],
        display: ['Bebas Neue', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
