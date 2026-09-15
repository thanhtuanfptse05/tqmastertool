import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#f4f7fc",
        cyber: {
          dark: "#090a10",
          card: "#121422",
          border: "#1f2338",
          neon: "#06b6d4",
          purple: "#8b5cf6",
        },
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        pastel: {
          blue: "#edf5ff",
          purple: "#f3eefd",
          teal: "#eafaf5",
          amber: "#fff7ed",
        },
      },
      borderRadius: {
        "card": "22px",
        "pill": "9999px",
      },
      boxShadow: {
        "card": "0 2px 10px rgba(0, 0, 0, 0.02)",
        "card-hover": "0 10px 25px -5px rgba(37, 99, 235, 0.08)",
        "neon": "0 0 20px rgba(37, 99, 235, 0.35)",
        "cyan-glow": "0 0 25px rgba(6, 182, 212, 0.4)",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
