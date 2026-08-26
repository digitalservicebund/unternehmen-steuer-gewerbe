// ARS (Amtlicher Regionalschlüssel) of every Kommune we support. Unlike a PLZ, an ARS identifies
// exactly one Kommune, so a neighbouring Kommune sharing the PLZ can no longer match. Resolve the
// ARS of a new Kommune via the PVOG v3 locations endpoint.
const SUPPORTED_REGIONS = {
  dresden: "146120000000",
} as const satisfies Record<string, string>;

const ALL_SUPPORTED_ARS: ReadonlyArray<string> = Object.values(SUPPORTED_REGIONS);

export function isSupportedRegion(ars: string): boolean {
  return ALL_SUPPORTED_ARS.includes(ars);
}
