/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2fbf8",
          100: "#d0f2e8",
          200: "#a6e5d4",
          300: "#73d3bb",
          400: "#40bda0",
          500: "#229f84",
          600: "#187f6a",
          700: "#146556",
          800: "#134f45",
          900: "#123f39"
        }
      }
    }
  },
  plugins: []
};
