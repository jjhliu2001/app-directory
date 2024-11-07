/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Note @/app dir
    './pages/**/*.{js,ts,jsx,tsx,mdx}', // Note @/pages dir
    './components/**/*.{js,ts,jsx,tsx,mdx}', // Note @/components dir
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Add more custom colors as needed
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};