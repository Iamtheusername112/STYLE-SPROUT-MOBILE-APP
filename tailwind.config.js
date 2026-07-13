/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        sage: "#4A6741",
        cream: "#FAF7F2",
        charcoal: "#1A1A1A",
        gold: "#C9A87C",
      },
      fontFamily: {
        sans: ["System"],
      },
    },
  },
  plugins: [],
};
