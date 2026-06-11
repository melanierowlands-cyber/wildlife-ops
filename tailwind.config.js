/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F1EEE7',
        surface: '#FBFAF6',
        surface2: '#F4F1EA',
        sunken: '#E9E5DC',
        accent: '#4F6B5C',
        critical: '#B0492F',
        warning: '#A9792B',
        positive: '#5B7A50',
        info: '#4C6A88',
        ink: {
          DEFAULT: '#24281D',
          2: '#5B5749',
          3: '#8C8678',
          4: '#AAA496',
        },
      },
      fontFamily: {
        ui: ['Hanken Grotesk', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
        mono: ['Geist Mono', 'ui-monospace', 'SF Mono', 'monospace'],
      },
      borderColor: {
        hair: 'rgba(36,40,29,0.08)',
      },
    },
  },
  plugins: [],
}
