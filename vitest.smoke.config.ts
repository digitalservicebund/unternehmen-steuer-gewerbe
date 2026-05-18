import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    env: { NODE_ENV: "test" },
    include: ["**/*.smoke.test.ts"],
    testTimeout: 60_000,
  },
});
