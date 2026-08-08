/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    fontFamily: {
      sans: ["Roboto Mono", "mono"], // Custom font utility class
    },
  },
  plugins: [],
};
