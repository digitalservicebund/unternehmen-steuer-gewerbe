import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchJson } from "./fetchJson";

function mockFetch(response: Response) {
  return vi.spyOn(globalThis, "fetch").mockResolvedValue(response);
}

describe("fetchJson", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("defaults to GET without a body when no method is given", async () => {
    const fetchSpy = mockFetch(new Response("{}", { status: 200 }));

    await fetchJson("https://example.de/data");

    expect(fetchSpy).toHaveBeenCalledWith("https://example.de/data", {
      method: "GET",
      headers: {},
      body: undefined,
    });
  });

  it("stringifies an object body, sets JSON Content-Type and returns the parsed response", async () => {
    const fetchSpy = mockFetch(new Response(JSON.stringify({ value: 42 }), { status: 200 }));

    const result = await fetchJson<{ value: number }>("https://example.de/submit", {
      method: "POST",
      body: { passierschein: "a42" },
    });

    expect(result).toEqual({ value: 42 });
    expect(fetchSpy).toHaveBeenCalledWith("https://example.de/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passierschein: "a42" }),
    });
  });

  it("passes a string body through unchanged and keeps the caller's Content-Type", async () => {
    const fetchSpy = mockFetch(new Response("{}", { status: 200 }));

    await fetchJson("https://example.de/auth", {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    expect(fetchSpy).toHaveBeenCalledWith("https://example.de/auth", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "grant_type=client_credentials",
    });
  });

  it("throws an error with status, url and response body on a non-ok response", async () => {
    mockFetch(new Response("not found", { status: 404, statusText: "Not Found" }));

    await expect(fetchJson("https://example.de/missing")).rejects.toThrow(
      "HTTP 404 Not Found for https://example.de/missing: not found",
    );
  });
});
