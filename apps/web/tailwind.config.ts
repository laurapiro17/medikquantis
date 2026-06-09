import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cardio: {
          50: "#fef2f2",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
        },
        trust: {
          50: "#eff6ff",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        neon: {
          DEFAULT: "#93c5fd",
          soft: "#bfdbfe",
          deep: "#1e40af",
          ink: "#0f172a",
        },
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      boxShadow: {
        neon: "0 0 20px rgba(147, 197, 253, 0.3)",
        "neon-soft": "0 0 12px rgba(147, 197, 253, 0.2)",
      },
      backdropBlur: {
        glass: "24px",
      },
    },
  },
  plugins: [],
} satisfies Config;
