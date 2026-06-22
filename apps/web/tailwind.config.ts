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
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        ink: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          600: "#475569",
          900: "#0f172a",
        },
        neon: {
          DEFAULT: "#93c5fd",
          soft: "#bfdbfe",
          deep: "#1e40af",
          ink: "#0f172a",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
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
        trust: "0 8px 24px -12px rgba(37, 99, 235, 0.25)",
        "trust-sm": "0 4px 14px -8px rgba(37, 99, 235, 0.2)",
      },
      backdropBlur: {
        glass: "24px",
      },
      keyframes: {
        meshDrift: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(6px, -6px, 0) scale(1.03)" },
        },
      },
      animation: {
        "mesh-drift": "meshDrift 14s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
