import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./vitest.setup.ts"],
    env: { NODE_ENV: "test" },
    testTimeout: 20_000,
    include: ["**/*.integration.test.ts"],
    exclude: ["**/node_modules/**", "**/.git/**", "**/dist/**"],
    coverage: {
      reporter: ["text", "lcov"],
      reportsDirectory: "coverage/integration",
    },
    unstubEnvs: true,
    maxWorkers: 4,
  },
});
