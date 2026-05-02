/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#0A1F44",
          emergency: "#E11D48",
          success: "#22C55E"
        }
      },
      boxShadow: {
        glass: "0 8px 32px rgba(15, 23, 42, 0.24)"
      },
      borderRadius: {
        xl2: "1.25rem"
      }
    }
  },
  plugins: []
};
