/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}', // Covers all App Router pages and components
    './src/components/**/*.{js,ts,jsx,tsx,mdx}', // Covers all components
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#333333',
          hover: '#555555',
        },
        secondary: {
          DEFAULT: '#666666',
          hover: '#888888',
        },
        accent: '#0070f3',
        background: {
          light: '#ffffff',
          dark: '#f5f5f5',
        },
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};