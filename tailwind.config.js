/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['SF Pro Display', 'SF Pro Icons', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        text: ['SF Pro Text', 'SF Pro Icons', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        black: '#000000',
        'light-gray': '#f5f5f7',
        'near-black': '#1d1d1f',
        'apple-blue': '#0071e3',
        'link-blue': '#0066cc',
        'bright-blue': '#2997ff',
        'dark-surface-1': '#272729',
        'dark-surface-2': '#262628',
        'dark-surface-3': '#28282a',
        'dark-surface-4': '#2a2a2d',
        'dark-surface-5': '#242426',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      boxShadow: {
        'card': 'rgba(0, 0, 0, 0.22) 3px 5px 30px 0px',
      },
      borderRadius: {
        'pill': '980px',
      },
    },
  },
  plugins: [],
}

