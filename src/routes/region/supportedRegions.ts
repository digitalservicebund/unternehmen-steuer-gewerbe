const supportedPLZs: number[] = [
  // sample PLZ
  10969,
] as const;

export function isSupportedRegion(plz: number): boolean {
  return supportedPLZs.includes(plz);
}
