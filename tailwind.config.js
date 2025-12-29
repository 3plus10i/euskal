/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sammi-dark': '#0a0f1a',
        'sammi-blue': '#1a2a4a',
        'sammi-light': '#4a6a9a',
        'sammi-gold': '#d4af37',
      },
    },
  },
  plugins: [],
}
