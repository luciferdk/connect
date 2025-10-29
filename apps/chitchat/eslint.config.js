import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config} */
export default [
  {
    ignores: [
      "**/.next/**",
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.turbo/**",
      "**/*.config.js",
      "**/*.config.ts",
      "**/public/**",
      "**/.git/**",
      "**/coverage/**",
      "**/postcss.config.cjs",
    ],
  },
  ...nextJsConfig,
];
