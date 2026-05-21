import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  "vitest.config.ts",
  {
    extends: "vitest.contract.config.ts",
    test: {
      name: "contract",
    },
  },
]);
