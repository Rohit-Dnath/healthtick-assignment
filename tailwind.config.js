/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        'xs': '475px', // Extra small devices
      },
      colors: {
        'healthtick': {
          50: '#f4f7f0',
          100: '#e8efdd',
          200: '#d1dfbc',
          300: '#b4ca94',
          400: '#97b56e',
          500: '#507626',
          600: '#456521',
          700: '#3a541c',
          800: '#2f4317',
          900: '#243312',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  plugins: [],
}
