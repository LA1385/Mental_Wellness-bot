/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#f6f4ef', panel: '#ffffff', ink: '#1c231f', muted: '#6b7570', line: '#e8e9e4',
        sage: '#4f7d63', 'sage-soft': '#e2eee5', amber: '#c98a2e', 'amber-soft': '#f7edd8',
        coral: '#b5473f', 'coral-soft': '#f7e3e0',
      },
      fontFamily: { sans: ['"DM Sans"', 'ui-sans-serif', 'sans-serif'], display: ['"DM Serif Display"', 'Georgia', 'serif'] },
    },
  },
  plugins: [],
}