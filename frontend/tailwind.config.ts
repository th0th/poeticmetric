import { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  plugins: [],
  theme: {
    extend: {
      boxShadow: {
        focus: "0 0 0 0.25rem rgb(var(--primary) / 0.25)",
      },
      colors: {
        background: "rgb(var(--background))",
        blue: {
          50: "#f1f8fe",
          100: "#e2f1fc",
          200: "#bfe1f8",
          300: "#86caf3",
          400: "#46b0ea",
          500: "#1e96d9",
          600: "#117bbf",
          700: "#0f5f95",
          800: "#10517c",
          900: "#134467",
          950: "#0d2b44",
        },
        foreground: "rgb(var(--foreground))",
        primary: {
          DEFAULT: "rgb(var(--primary))",
          foreground: "rgb(var(--primary-foreground))",
        },
        ring: "rgb(var(--ring))",
      },
    },
    fontFamily: {
      mono: ["Roboto Mono", "monospace"],
      sans: ["Inter", "sans-serif"],
      serif: ["Noto Serif", "serif"],
    },
  },
} satisfies Config;
