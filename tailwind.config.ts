import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101820",
        mist: "#F5F8FA",
        line: "#DDE7EB",
        brand: {
          50: "#EAF8F6",
          100: "#CFF0EA",
          500: "#1C9B8D",
          600: "#137F74",
          700: "#0D665F"
        },
        blue: {
          accent: "#2F6FDB"
        }
      },
      boxShadow: {
        soft: "0 24px 70px rgba(16, 24, 32, 0.08)",
        panel: "0 1px 2px rgba(16, 24, 32, 0.06), 0 12px 32px rgba(16, 24, 32, 0.06)"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
