/**
 * Returns the best match from a results list (PVOG locations, Finanzamt IDs).
 * Currently, the first item of a list is treated as the best match.
 */
export function getBestMatch<T>(matches: T[]): T | undefined {
  return matches[0];
}
