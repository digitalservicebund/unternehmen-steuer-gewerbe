import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    env: { NODE_ENV: "test" },
    fileParallelism: false,
    sequence: { concurrent: false },
    exclude: ["**/node_modules/**", "**/.git/**", "**/dist/**"],
    coverage: {
      reporter: ["text", "lcov"],
    },
  },
});
