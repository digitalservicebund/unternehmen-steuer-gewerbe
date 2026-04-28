export function clearObjectValues<T extends object>(obj: T, clearWith?: unknown): T {
  if (typeof obj !== "object" || obj === null) {
    throw new Error("clearObjectValues expects a non-null object");
  }
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      Array.isArray(value)
        ? value.map((item) =>
            typeof item === "object" && item !== null
              ? clearObjectValues(item as object, clearWith)
              : clearWith,
          )
        : typeof value === "object" && value !== null
          ? clearObjectValues(value as object, clearWith)
          : clearWith,
    ]),
  ) as T;
}
