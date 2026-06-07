/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'bg-base':    '#F5F0E8',
        'bg-surface': '#EDE7D9',
        'bg-deep':    '#2C2420',
        'soft':       '#8A7968',
        'amber':      '#C4863A',
        'sage':       '#7A9E7E',
        'clay':       '#B5735A',
        'mist':       '#8BADB5',
        'border-warm':'#D9D0C0',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        card: '16px',
      },
      maxWidth: {
        app: '420px',
      },
    },
  },
  plugins: [],
}
