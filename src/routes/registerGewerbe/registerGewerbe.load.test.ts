import { describe, it, expect } from "vitest";
import app from "../../app";
import { registerGewerbeCompleteRequest } from "./testHelpers";

function postRegisterGewerbe() {
  return app.request("/api/v1/register-gewerbe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(registerGewerbeCompleteRequest),
  });
}

describe("Load test: POST /api/v1/register-gewerbe", () => {
  it(
    "handles 100 concurrent requests and returns success for all",
    async () => {
      const responses = await Promise.all(Array.from({ length: 100 }, () => postRegisterGewerbe()));

      const results = await Promise.all(responses.map((r) => r.json()));

      for (let i = 0; i < 100; i++) {
        expect(responses[i]!.status, `request ${i} status`).toEqual(200); // NOSONAR
        expect(results[i].gewerbeanmeldung.success, `request ${i} gewerbeanmeldung`).toBe(true);
        expect(results[i].steuernummer.success, `request ${i} steuernummer`).toBe(true);
      }
    },
    { timeout: 60_000 },
  );
});
