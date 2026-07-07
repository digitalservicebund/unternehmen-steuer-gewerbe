import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./vitest.setup.ts"],
    env: { NODE_ENV: "test" },
    testTimeout: 10_000,
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
    maxWorkers: 4,
  },
});
