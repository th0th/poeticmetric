import { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  plugins: [],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background))",
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
