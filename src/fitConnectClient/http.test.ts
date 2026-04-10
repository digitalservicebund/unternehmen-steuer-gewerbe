import { describe, it, expect, vi } from "vitest";
import { fetchFitConnect } from "./http";

describe("fetchFitConnect", () => {
  it("returns parsed JSON on ok response", async () => {
    const payload = { hello: "world", answer: 42 };
    const mockFetch = vi.fn().mockResolvedValueOnce(
      new Response(JSON.stringify(payload), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const result = await fetchFitConnect<typeof payload>(
      mockFetch as unknown as typeof fetch,
      "https://example.test",
    );

    expect(result).toEqual(payload);
  });

  it("passes url and options through to fetch", async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce(new Response("{}", { status: 200 }));

    const options: RequestInit = {
      method: "POST",
      headers: { Authorization: "Bearer token" },
      body: JSON.stringify({ foo: "bar" }),
    };

    await fetchFitConnect(mockFetch as unknown as typeof fetch, "https://example.test", options);

    expect(mockFetch).toHaveBeenCalledWith("https://example.test", options);
  });

  it("throws on non-ok response", async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce(new Response("Unauthorized", { status: 401 }));

    await expect(
      fetchFitConnect(mockFetch as unknown as typeof fetch, "https://example.test/token", {
        method: "POST",
      }),
    ).rejects.toThrow("POST https://example.test/token: Unauthorized");
  });
});
