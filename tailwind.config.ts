import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101820",
        mist: "#f5f8fa",
        line: "#dde7eb",
        brand: {
          50: "#eaf8f6",
          100: "#cff0ea",
          500: "#1c9b8d",
          600: "#137f74",
          700: "#0d665f"
        },
        "blue-accent": "#2f6fdb"
      },
      boxShadow: {
        soft: "0 24px 70px rgba(16, 24, 32, 0.08)",
        panel:
          "0 1px 2px rgba(16, 24, 32, 0.06), 0 12px 32px rgba(16, 24, 32, 0.06)"
      },
      fontFamily: {
        sans: ["Arial", "Helvetica", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: [animate]
} satisfies Config;
