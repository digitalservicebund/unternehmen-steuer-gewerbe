import { defineConfig } from "vitest/config";

// TEMPORARY: config for manually triggered one-off tests (*.manual.test.ts), which are excluded
// from every other config so neither `pnpm test` nor CI can run them.
export default defineConfig({
  // the env comes from `op run --env-file .env.akdb.prod`; without this Vite would still read .env
  envDir: false,
  test: {
    setupFiles: ["./vitest.setup.ts"],
    env: { NODE_ENV: "test" },
    testTimeout: 60_000,
    include: ["**/*.manual.test.ts"],
    exclude: ["**/node_modules/**", "**/.git/**", "**/dist/**"],
    unstubEnvs: true,
    maxWorkers: 1,
  },
});
