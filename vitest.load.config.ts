import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    env: { NODE_ENV: "test" },
    include: ["**/*.load.test.ts"],
    exclude: ["**/node_modules/**", "**/.git/**", "**/dist/**", "**/*.smoke.test.ts"],
  },
});
