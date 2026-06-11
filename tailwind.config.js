/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#1C1F1A',
        sidebar: '#242720',
        surface: '#2E3129',
        accent: '#7FA095',
        gold: '#C8A96E',
        critical: '#C0634A',
        success: '#6B9E6E',
        amber: '#C8A96E',
        ink: {
          primary: '#F0EBE0',
          secondary: '#9A9485',
          tertiary: '#5C574F',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      borderColor: {
        hair: 'rgba(255,255,255,0.07)',
      },
    },
  },
  plugins: [],
}
