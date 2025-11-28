/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pokemon: {
          red: '#EE1515',
          blue: '#0075BE',
          yellow: '#FFCB05',
        },
      },
    },
  },
  plugins: [],
}
