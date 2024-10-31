const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./pkg/web/template/files/**/*.gohtml"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["Roboto Mono", ...defaultTheme.fontFamily.mono],
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        serif: ["Noto Serif", ...defaultTheme.fontFamily.serif],
      },
    },
  },
  plugins: [],
};
