const supportedPLZs: ReadonlySet<string> = new Set([
  // sample PLZ
  "10969"
]);

export function isSupportedRegion(plz: string): boolean {
  return supportedPLZs.has(plz);
}
