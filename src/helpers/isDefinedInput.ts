/**
 * Whether an optional XML input value is present and should be serialized.
 * Treats `false` and `0` as present; only `undefined` counts as absent.
 */
export function isDefinedInput<T extends string | boolean | number>(
  value: string | number | boolean | undefined,
): value is T {
  return value !== undefined;
}
