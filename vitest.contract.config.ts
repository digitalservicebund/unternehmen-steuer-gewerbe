import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./vitest.setup.ts"],
    env: { NODE_ENV: "test" },
    testTimeout: 20_000,
    include: ["**/*.contract.test.ts"],
    exclude: ["**/node_modules/**", "**/.git/**", "**/dist/**"],
    unstubEnvs: true,
    maxWorkers: 4,
  },
});
