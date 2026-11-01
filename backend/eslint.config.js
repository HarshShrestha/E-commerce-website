import js from "@eslint/js";
import globals from "globals";
export default [
  { ignores: ["node_modules/**", "public/**"] },
  {
    files: ["**/*.js"],
    ...js.configs.recommended,
    languageOptions: {
      globals: globals.node,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
];
