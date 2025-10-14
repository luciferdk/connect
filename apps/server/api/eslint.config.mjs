// .eslint.config.mjs
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // ✅ Global ignore rules for all files
  {
    ignores: [
      "src/generated/**", // ignore generated files
      "dist/**", // ignore build output
      "node_modules/**", // always ignore node_modules
      "eslint.config.mjs", // ✅ prevent ESLint from linting itself
    ],
  },

  // ✅ Specific rule for JavaScript files (optional)
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      parser: (await import("espree")).default, // use ESLint's default JS parser
      globals: globals.node,
      sourceType: "module",
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },

  // ✅ Specific rule for TypeScript files
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: process.cwd(),
        sourceType: "module",
      },
      globals: globals.node,
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      semi: ["error", "always"],
      quotes: ["error", "single"],
      "@typescript-eslint/no-unused-vars": ["warn"],
    },
  },
]);
