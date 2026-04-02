import { defineConfig } from "rolldown";

export default defineConfig({
  input: "src/index.ts", // Your entry point
  platform: "node", // Crucial: targets Node.js environment
  output: {
    dir: "dist",
    format: "esm", // Modern ES Modules
    entryFileNames: "bundle.js",
  },
  // Optional: Externalize dependencies if you don't want them in the bundle
  // external: ['express', 'pg'],
});
