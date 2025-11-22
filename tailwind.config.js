/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', 'src/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#00001B',
        'white-primary': '#CCCCCC',
        'white-secondary': '#F2F2F2',
        secondary: '#00004E',
      },
    },
  },
  plugins: [],
};
