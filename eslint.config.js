// Regras de lint do projeto (React, hooks e acessibilidade) · API: nenhuma
import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-config-prettier";

export default [
  { ignores: ["dist", "legacy", "coverage", "mobile"] },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { react, "react-hooks": reactHooks, "jsx-a11y": jsxA11y },
    settings: { react: { version: "detect" } },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      ...jsxA11y.configs.recommended.rules,
      "jsx-a11y/label-has-associated-control": ["error", { controlComponents: ["Checkbox"], assert: "either" }],
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
  {
    // valores visuais vêm dos tokens de src/shared/styles/tokens.css
    files: ["src/**/*.{js,jsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "Property[key.name=/^(fontSize|borderRadius)$/] > Literal[value=/^\\d/]",
          message: "Use um token (var(--font-size-*) ou var(--radius-*)).",
        },
        {
          selector: "Literal[value=/^(#[0-9a-fA-F]{3,8}|hsl\\(\\d|rgba?\\()/]",
          message: "Use um token de cor (var(--color-*)) em vez de cor fixa.",
        },
      ],
    },
  },
  {
    files: ["**/*.config.{js,cjs}", "**/*.test.{js,jsx}"],
    languageOptions: { globals: { ...globals.node } },
  },
  prettier,
];
