/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors:{
        customPink: "#CD469A",
        customDarkPink: "#A1337A",
        customDarkGray: "#1F2937"
      }
    },
  },
  plugins: [],
}