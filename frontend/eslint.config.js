import stylistic from "@stylistic/eslint-plugin";
import pluginImport from "eslint-plugin-import";
import pluginJSXA11Y from "eslint-plugin-jsx-a11y";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
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
      "comma-dangle": ["error", "always-multiline"],
      "eol-last": ["error"],
      eqeqeq: ["error"],
      "max-len": ["error", { code: 140, ignoreStrings: true }],
      "no-console": "error",
      "no-useless-return": ["error"],
      "object-curly-newline": ["error", { consistent: true }],
      "object-curly-spacing": ["error", "always"],
      "object-shorthand": ["error"],
      "prefer-destructuring": ["error"],
      "quote-props": ["error", "as-needed"],
      quotes: ["error", "double", { allowTemplateLiterals: true }],
      semi: ["error", "always"],
      "semi-style": ["error", "last"],
      "sort-keys": "error",
    },
  },

  // import
  {
    ...pluginImport.flatConfigs.recommended,
    rules: {
      ...pluginImport.flatConfigs.recommended.rules,
      "import/order": ["error", {
        alphabetize: { order: "asc" },
        groups: [["builtin", "external"], "parent", "sibling", "index"],
        pathGroups: [
          { group: "external", pattern: "~/**", position: "after" },
        ],
      }],
    },
    settings: {
      ...pluginImport.flatConfigs.recommended.settings,
      "import/resolver": {
        typescript: {},
      },
    },
  },

  // jsx-a11y
  {
    plugins: {
      "jsx-a11y": pluginJSXA11Y,
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
      "react/jsx-one-expression-per-line": ["error", { allow: "non-jsx" }],
      "react/jsx-sort-props": "error",
      "react/jsx-tag-spacing": "error",
      "react/jsx-wrap-multilines": ["error"],
      "react/no-array-index-key": ["error"],
      "react/no-unescaped-entities": ["error"],
      "react/react-in-jsx-scope": "off",
    },
  },

  // react hooks
  {
    plugins: {
      "react-hooks": pluginReactHooks,
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
    },
  },

  // typescript
  ...typescriptEslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/no-explicit-any": 0,
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },

  {
    plugins: {
      "@stylistic": stylistic,
    },
    rules: {
      "@stylistic/jsx-props-no-multi-spaces": ["error"],
      "@stylistic/member-delimiter-style": ["error"],
      "@stylistic/no-multi-spaces": ["error"],
      "@stylistic/quote-props": ["error", "as-needed"],
      "@stylistic/semi": ["error"],
    },
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
