import { describe, it, expect } from "vitest";
import { registerGewerbeSampleRequestAllFieldsFilled } from "./testHelpers";

const baseUrl = process.env.TEST_BASE_URL;

describe(`Smoke test against DEVELOPMENT API at ${baseUrl}`, () => {
  describe("POST /api/v1/register-gewerbe", () => {
    it("returns 200 with success for gewerbeanmeldung and fseÜbermittlung", async () => {
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
