import path from "node:path";

// In ts-node, resolved relative to this source file (src/helpers/ -> src/resources/).
// In Docker, overridden via RESOURCES_DIR env var pointing to /app/resources.
export function getResourcesDir(): string {
  return (
    process.env["RESOURCES_DIR"] ??
    path.resolve(new URL(".", import.meta.url).pathname, "../resources")
  );
}
