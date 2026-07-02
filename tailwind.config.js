/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        techBluePrimary: "#0284C7",
        techMintAccent: "#10B981",
        techSlateTitle: "#0F172A",
        techBodyText: "#475569",
        techBgSoft: "#F8FAFC",
        // Backward compatibility mappings
        indigoPrimary: "#0284C7",
        mintAccent: "#10B981",
        slateDark: "#0F172A",
        neutralBg: "#F8FAFC",
        orangePrimary: "#0284C7",
        orangeSecondary: "#38BDF8",
        tealAccent: "#10B981",
        backgroundLight: "#F8FAFC",
        surfaceLight: "#FFFFFF",
        onBackgroundLight: "#0F172A"
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "Inter", "sans-serif"],
      }
    },
  },
  plugins: [],
}
