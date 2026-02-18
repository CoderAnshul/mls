/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        admin: {
          bg: '#0F0F12',
          card: '#1C1C21',
          border: '#2C2C34',
          accent: '#7C3AED',
          text: '#F4F4F5',
          muted: '#A1A1AA'
        }
      }
    },
  },
  plugins: [],
}
