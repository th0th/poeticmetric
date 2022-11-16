module.exports = {
  extends: "next/core-web-vitals",
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
    "typescript-sort-keys",
  ],
  root: true,
  rules: {
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "_", varsIgnorePattern: "_" }],
    "@typescript-eslint/quotes": ["error", "double", { avoidEscape: true }],
    "@typescript-eslint/semi": "error",
    "import/no-extraneous-dependencies": "error",
    "max-len": ["error", { code: 140, ignoreStrings: true }],
    "quote-props": ["error", "as-needed"],
    "react/jsx-max-props-per-line": ["error", { when: "multiline" }],
    "react/jsx-one-expression-per-line": ["error", { allow: "single-child" }],
    "react/jsx-sort-props": "error",
    "sort-keys": "error",
    "typescript-sort-keys/interface": "error",
    "typescript-sort-keys/string-enum": "error",
  },
};
