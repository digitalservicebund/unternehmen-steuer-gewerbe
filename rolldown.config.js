import { defineConfig } from "rolldown";

export default defineConfig({
  input: "src/index.ts",
  // Target Node.js — sets correct platform globals and built-in module handling
  platform: "node",
  // Keep native addons and WASM packages out of the bundle; Node resolves them from node_modules at runtime
  external: ["koffi", "saxonjs-he", "xslt3-he", "xmllint-wasm"],
  output: {
    dir: "dist",
    // ESM output to match "type": "module" in package.json
    format: "esm",
    entryFileNames: "bundle.js",
  },
});
