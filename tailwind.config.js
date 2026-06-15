/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        orangePrimary: "#FF6F43",
        orangeSecondary: "#FF8A65",
        tealAccent: "#00BFA5",
        backgroundLight: "#F8F9FA",
        surfaceLight: "#FFFFFF",
        onBackgroundLight: "#212121"
      }
    },
  },
  plugins: [],
}
