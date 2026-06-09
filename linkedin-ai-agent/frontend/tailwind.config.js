/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './hooks/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        linkedin: {
          blue: '#0A66C2',
          darkblue: '#004182',
          lightblue: '#E8F0F9',
          bg: '#F3F2EF',
          text: '#191919',
          muted: '#666666',
          border: '#E0DFDC',
        }
      },
      fontFamily: {
        sans: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
      },
      animation: {
        'cursor-blink': 'blink 1s step-end infinite',
        'fade-up': 'fadeUp 0.4s ease-out forwards',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        blink: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0 } },
        fadeUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      }
    }
  },
  plugins: []
}
