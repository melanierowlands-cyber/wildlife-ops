/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#F8F6F5',
        sidebar: '#FFFFFF',
        surface: '#FFFFFF',
        accent: '#5E8576',
        gold: '#A07C1F',
        critical: '#B24A33',
        success: '#4E7B52',
        amber: '#B07A28',
        ink: {
          primary: '#292D20',
          secondary: '#5F5A4E',
          tertiary: '#8C8678',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['Manrope', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderColor: {
        hair: 'rgba(41,45,32,0.10)',
      },
    },
  },
  plugins: [],
}
