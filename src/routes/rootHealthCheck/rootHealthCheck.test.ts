import { describe, test, expect } from "vitest";
import app from "../../app";

describe("Route / for Kubernetes Health Check", () => {
  test("Returns 200 OK and status:ok in JSON on GET", async () => {
    const response = await app.request("/");
    expect(response.status).toEqual(200);
    expect(response.headers.get("content-type")).toMatch(/json/);
    expect(await response.json()).toEqual({ status: "ok" });
  });

  test("Returns fitConnectEnvironment on GET to /?verbose=true", async () => {
    const response = await app.request("/?verbose=true");
    expect(response.status).toEqual(200);
    expect(await response.json()).toEqual({
      status: "ok",
      fitConnectEnvironment: expect.any(String),
    });
  });
});
