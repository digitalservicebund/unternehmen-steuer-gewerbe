import { describe, it, expect } from "vitest";
import { registerGewerbeSampleRequestAllFieldsFilled } from "./testHelpers";

const baseUrl = process.env.TEST_BASE_URL;

async function pollUntilSuccess(fn: () => Promise<void>, intervalMs = 5_000, timeoutMs = 300_000) {
  const deadline = Date.now() + timeoutMs;
  let lastError: unknown;
  while (Date.now() < deadline) {
    try {
      await fn();
      return;
    } catch (e) {
      lastError = e;
      const remaining = deadline - Date.now();
      if (remaining <= 0) break;
      await new Promise((r) => setTimeout(r, Math.min(intervalMs, remaining)));
    }
  }
  throw lastError;
}

describe(`Smoke test against DEVELOPMENT API at ${baseUrl}`, () => {
  describe("POST /api/v1/register-gewerbe", () => {
    it("returns 200 with success for gewerbeanmeldung and fseÜbermittlung", async () => {
      await pollUntilSuccess(async () => {
        const response = await fetch(`${baseUrl}/api/v1/register-gewerbe`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(registerGewerbeSampleRequestAllFieldsFilled),
        });

        expect(response.status).toEqual(200);

        const result = await response.json();
        expect(result.gewerbeanmeldung.success).toBe(true);
        expect(result.fseÜbermittlung.success).toBe(true);
      });
    });
  });
});
