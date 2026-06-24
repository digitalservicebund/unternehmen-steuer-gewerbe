/*
  Determine if the element has a value matching the type (e.g. "false" is value for Booleans, but undefined is not.)
*/
export function isDefined<T extends boolean | number | string>(value: T | undefined): value is T {
  return value !== undefined;
}
