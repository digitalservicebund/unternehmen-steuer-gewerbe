export function hasAValue<T extends boolean | number>(value: T | undefined): value is T {
  return value !== undefined;
}
