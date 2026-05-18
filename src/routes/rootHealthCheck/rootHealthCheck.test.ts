import { describe, it, expect } from "vitest";
import { HttpStatusCode } from "../../helpers/httpStatusCodes";
import app from "../../app";

describe("Route / for Kubernetes Health Check", () => {
  it("Returns 200 OK and status:ok in JSON on GET", async () => {
    const response = await app.request("/");
    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(response.headers.get("content-type")).toMatch(/json/);
    expect(await response.json()).toEqual({ status: "ok" });
  });

  it("Returns fitConnectEnvironment on GET to /?verbose=true", async () => {
    const response = await app.request("/?verbose=true");
    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(await response.json()).toEqual({
      status: "ok",
      fitConnectEnvironment: expect.any(String),
    });
  });

  it("Returns gitCommitSHA when COMMIT_SHA is set", async () => {
    process.env.COMMIT_SHA = "abc123";
    const response = await app.request("/");
    delete process.env.COMMIT_SHA;

    expect(await response.json()).toEqual({ status: "ok", gitCommitSHA: "abc123" });
  });
});
