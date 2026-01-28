/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'terminal': '#0a0e14',
        'terminal-green': '#00ff9d',
        'terminal-blue': '#00d9ff',
        'terminal-purple': '#b967ff',
      },
      fontFamily: {
        'mono': ['"Fira Code"', 'monospace'],
      },
    },
  },
  plugins: [],
}
