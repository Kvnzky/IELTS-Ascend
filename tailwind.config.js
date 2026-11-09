/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ielts: {
          navy: '#0f172a',
          red: '#dc2626',
          crimson: '#b91c1c',
          blue: '#1e40af',
          sky: '#0284c7',
          emerald: '#059669',
          amber: '#d97706',
          purple: '#7c3aed',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
