/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sammi': {
          'glow': '#bcedf5',
          'ice': '#CDCFD5',
          'snow': '#9ebbd7',
          'deep': '#233340',
          'clan': '#b83f38',
          'nature': '#34847c',
          'soul': '#3473ab',
          'world': '#6e6d6e',
          'bg': '#464646',
          'yuan': {
            'red': '#902D46',
            'black': '#36262E',
            'pink': '#EDDCD4',
          },
          'glow-bg': '#5fb4cf',
        },
      },
      backgroundImage: {
        'sammi-world': 'conic-gradient(#c14141, #2a5778, #1e9782, #c14141)',
        'sammi-glow': 'linear-gradient(45deg, #121c24, #5fb4cf)',
        'sammi-logo': 'linear-gradient(90deg, #4a7aad, #91dded)',
      },
      textShadow: {
        'glow': '0 0 3px #03a9f4, 0 0 5px black, 0 0 5px black',
      },
    },
  },
  plugins: [],
}
