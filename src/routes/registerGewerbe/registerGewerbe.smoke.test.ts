import { describe, it, expect } from "vitest";
import { registerGewerbeCompleteRequest } from "./testHelpers";

const baseUrl = process.env.TEST_BASE_URL;

describe("Smoke test: POST /api/v1/register-gewerbe", () => {
  it("returns 200 with success for both gewerbeanmeldung and steuernummer", async () => {
    const response = await fetch(`${baseUrl}/api/v1/register-gewerbe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerGewerbeCompleteRequest),
    });

    expect(response.status).toEqual(200);

    const result = await response.json();
    expect(result.gewerbeanmeldung.success).toBe(true);
    expect(result.steuernummer.success).toBe(true);
  });
});
