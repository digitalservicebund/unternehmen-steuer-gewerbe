import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    env: { NODE_ENV: "test" },
    exclude: [
      "**/node_modules/**",
      "**/.git/**",
      "**/dist/**",
      "**/*.load.test.ts",
      "**/*.smoke.test.ts",
    ],
    coverage: {
      reporter: ["text", "lcov"],
    },
  },
});
