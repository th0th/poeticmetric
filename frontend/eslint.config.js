import pluginImport from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import pluginReact from "eslint-plugin-react";
import pluginSortDestructureKeys from "eslint-plugin-sort-destructure-keys";
import pluginTypescriptSortKeys from "eslint-plugin-typescript-sort-keys";
import globals from "globals";
import typescriptEslint from "typescript-eslint";

export default [
  {
    files: ["**/*.{js,ts,tsx}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },

  {
    rules: {
      "arrow-parens": "error",
      "eol-last": ["error"],
      eqeqeq: ["error"],
      "max-len": ["error", { code: 140 }],
      "no-console": "error",
      "no-undef": "error",
      "no-useless-return": ["error"],
      "object-curly-newline": ["error", { consistent: true }],
      "object-curly-spacing": ["error", "always"],
      "object-shorthand": ["error"],
      "prefer-destructuring": ["error"],
      "quote-props": ["error", "as-needed"],
      quotes: ["error", "double", { allowTemplateLiterals: true }],
      "sort-keys": "error",
    },
  },

  // import
  {
    ...pluginImport.flatConfigs.recommended,
    rules: {
      "import/no-extraneous-dependencies": "error",
      "import/no-unresolved": "error",
    },
    settings: {
      "import/resolver": {
        typescript: {},
      },
    },
  },

  // jsx-a11y
  {
    plugins: {
      "jsx-a11y": jsxA11y,
    },
    rules: {
      "jsx-a11y/no-autofocus": 0,
    },
  },

  // sort-destructure-keys
  {
    plugins: {
      "sort-destructure-keys": pluginSortDestructureKeys,
    },
    rules: {
      "sort-destructure-keys/sort-destructure-keys": ["error"],
    },
  },

  // react
  {
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
    },
    plugins: {
      react: pluginReact,
    },
    rules: {
      "react/jsx-closing-bracket-location": ["error"],
      "react/jsx-first-prop-new-line": ["error", "multiline"],
      "react/jsx-key": ["error", { checkFragmentShorthand: true }],
      "react/jsx-max-props-per-line": ["error", { when: "multiline" }],
      "react/jsx-no-target-blank": 0,
      "react/jsx-one-expression-per-line": ["error", { allow: "single-child" }],
      "react/jsx-sort-props": "error",
      "react/jsx-tag-spacing": "error",
      "react/jsx-wrap-multilines": ["error"],
      "react/no-array-index-key": ["error"],
      "react/react-in-jsx-scope": "off",
    },
  },

  // typescript
  {
    ...typescriptEslint.configs.recommended[0],
    languageOptions: {
      parser: typescriptEslint.parser,
    },
    rules: {},
  },

  // typescript-sort-keys
  {
    plugins: {
      "typescript-sort-keys": pluginTypescriptSortKeys,
    },
    rules: {
      "typescript-sort-keys/interface": "error",
      "typescript-sort-keys/string-enum": "error",
    },
  },
];
