export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: string | object;
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 5_000;

/**
 * fetch wrapper that throws an error if the response is not ok, and otherwise returns the parsed JSON.
 */
export async function fetchJson<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", headers = {}, body, timeoutMs = DEFAULT_TIMEOUT_MS } = options;

  const requestHeaders: Record<string, string> = { "Content-Type": "application/json", ...headers };

  const requestBody = typeof body === "string" ? body : JSON.stringify(body);

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: requestBody,
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status} ${response.statusText} for ${url}: ${await response.text()}`,
    );
  }

  return (await response.json()) as T;
}
