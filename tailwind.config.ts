import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff1f1",
          100: "#ffd8d8",
          200: "#ffb0b0",
          500: "#e00000",
          600: "#bb0000",
          700: "#8f0000",
          900: "#2b0a0a"
        },
        graphite: {
          50: "#f6f6f7",
          100: "#ececef",
          200: "#d7d8dc",
          700: "#2a2b31",
          900: "#111216"
        },
        sand: {
          50: "#f7f7f8",
          100: "#efeff1",
          200: "#e3e4e8"
        }
      },
      boxShadow: {
        panel: "0 18px 40px rgba(17, 18, 22, 0.08)",
        glow: "0 18px 44px rgba(224, 0, 0, 0.16)"
      }
    }
  },
  plugins: []
};

export default config;
