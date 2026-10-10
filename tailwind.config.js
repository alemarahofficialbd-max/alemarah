/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#CE2028',
          'red-dark': '#A9141B',
          'red-light': '#FDF2F2',
          forest: '#006231',
          'forest-dark': '#004723',
          'forest-light': '#EBF7F0',
          lime: '#8EBF40',
          'lime-light': '#F4F9EC',
          charcoal: '#231F20',
          dark: '#161516',
          muted: '#6B7280',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'Hind Siliguri', 'sans-serif'],
        bengali: ['Hind Siliguri', 'sans-serif'],
        serif: ['"Cormorant Garamond"', '"Tiro Bangla"', 'Georgia', 'serif'],
        cinzel: ['"Cinzel"', 'serif'],
        tiro: ['"Tiro Bangla"', 'serif']
      }
    },
  },
  plugins: [],
}
