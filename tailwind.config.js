/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#040404',
        foreground: '#f1f1f1',
        accent: '#E34234', // Intense Orange/Red
        brand: '#FF4500',  // Deep red glow
      },
      fontFamily: {
        display: ['"Syne"', 'sans-serif'], // Distorted/display feel
        serif: ['"Playfair Display"', 'serif'], // Elegant serif
        sans: ['"Inter"', 'sans-serif'], // Clean UI
      },
    },
  },
  plugins: [],
}
