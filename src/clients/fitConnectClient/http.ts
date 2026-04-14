export type FetchFn = typeof globalThis.fetch;

/**
 * fetch wrapper that throws an error if the response is not ok, and otherwise returns the parsed JSON.
 *
 * @param fetch
 * @param url
 * @param options
 * @returns the parsed JSON response
 */
export async function fetchFitConnect<T>(
  fetch: FetchFn,
  url: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${options?.method ?? "GET"} ${url}: ${text}`);
  }
  return (await res.json()) as T;
}
