/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      spacing: {
        17: "4.25rem", // Adds `bottom-17` class
      },
    },
  },
  plugins: [],
};
