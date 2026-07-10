import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./vitest.setup.ts"],
    env: { NODE_ENV: "test" },
    testTimeout: 10_000,
    include: ["**/*.unit.test.ts"],
    exclude: ["**/node_modules/**", "**/.git/**", "**/dist/**"],
    coverage: {
      reporter: ["text", "lcov"],
      reportsDirectory: "coverage/unit",
    },
    unstubEnvs: true,
    maxWorkers: 4,
  },
});
