// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",           // Vite entry point
    "./src/**/*.{js,jsx,ts,tsx}", // All JS/JSX/TS/TSX files in src
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F8EF7",
        "primary-hover": "#3C73E5",
        "primary-active": "#365FCC",
        "bg-main": "#F0F6FE",
        "bg-section": "#E0EBFE",
        "bg-border": "#CFE0FD",
        "text-main": "#010C1D",
        "text-heading": "#03193E",
        "text-body": "#04204F",
        "text-secondary": "#6B7280",
      },
      fontFamily: {
        inter: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};