/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#1a1a1a',
          600: '#0f0f0f',
          700: '#000000',
        },
      },
    },
  },
  plugins: [],
}

