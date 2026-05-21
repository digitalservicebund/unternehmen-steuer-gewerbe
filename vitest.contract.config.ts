import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    env: { NODE_ENV: "test" },
    include: ["**/*.contract.test.ts"],
    testTimeout: 60_000,
  },
});
