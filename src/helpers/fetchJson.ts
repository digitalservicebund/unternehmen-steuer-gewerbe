export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
}

/**
 * fetch wrapper that throws an error if the response is not ok, and otherwise returns the parsed JSON.
 */
export async function fetchJson<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", headers = {}, body } = options;
  const requestHeaders: Record<string, string> = { ...headers };

  let requestBody: string | undefined;

  if (body === undefined) {
    requestBody = undefined;
  } else if (typeof body === "string") {
    // String bodies are passed through as-is and the caller sets its own Content-Type if needed
    // (e.g. application/x-www-form-urlencoded).
    requestBody = body;
  } else {
    requestBody = JSON.stringify(body);
    requestHeaders["Content-Type"] = requestHeaders["Content-Type"] ?? "application/json";
  }

  const response = await fetch(url, { method, headers: requestHeaders, body: requestBody });

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status} ${response.statusText} for ${url}: ${await response.text()}`,
    );
  }

  return (await response.json()) as T;
}
