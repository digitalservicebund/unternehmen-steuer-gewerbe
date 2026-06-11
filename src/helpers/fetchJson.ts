export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type QueryParams = Record<string, string | number | boolean>;

interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  params?: QueryParams;
  body?: string | object;
}


function createUrlWithParams(url: string, params: QueryParams): string {
  const urlWithParams = new URL(url);
  for (const [key, value] of Object.entries(params)) {
    urlWithParams.searchParams.set(key, String(value));
  }
  return urlWithParams.toString();
}

/**
 * fetch wrapper that throws an error if the response is not ok, and otherwise returns the parsed JSON.
 */
export async function fetchJson<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", headers = {}, params, body } = options;

  const requestUrl = params === undefined ? url : createUrlWithParams(url, params);

  const requestHeaders: Record<string, string> = { "Content-Type": "application/json", ...headers };

  const requestBody = typeof body === "string" ? body : JSON.stringify(body);

  const response = await fetch(requestUrl, { method, headers: requestHeaders, body: requestBody });

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status} ${response.statusText} for ${requestUrl}: ${await response.text()}`,
    );
  }

  return (await response.json()) as T;
}
