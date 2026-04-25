/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        teal: { 500: '#0D9488', 600: '#0F766E' },
        slate: { 800: '#1E293B', 500: '#64748B' }
      }
    }
  },
  plugins: [],
}
