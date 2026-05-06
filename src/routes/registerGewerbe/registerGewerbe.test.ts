import { describe, test, expect, vi, afterEach, beforeAll } from "vitest";
import app from "../../app";
import * as eric from "../../private/eric/eric";
import * as gewerbeanmeldung from "../../xmlBuilders/xGewerbeordnung/gewerbeanmeldung";
import { registerGewerbeCompleteRequest } from "./testHelpers";
import { ErrorTypeSchema } from "./registerGewerbeInterfaces";

function postRegisterGewerbe(data = registerGewerbeCompleteRequest) {
  return app.request("/api/v1/register-gewerbe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

describe("Route /api/v1/register-gewerbe", () => {
  afterEach(() => vi.restoreAllMocks());

  test("Returns 200 with success=true for both services on POST", async () => {
    const response = await postRegisterGewerbe();
    const json = await response.json();
    expect(response.status).toEqual(200);
    expect(json.gewerbeanmeldung.success).toBe(true);
    expect(json.gewerbeanmeldung.submissionId).toBeTruthy();
    expect(json.steuernummer.success).toBe(true);
  });

  test("Returns 207 with gewerbeanmeldung upstream_error when FIT-Connect fails, steuernummer still succeeds", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: "Server Down" }), { status: 500 }),
    );

    const response = await postRegisterGewerbe();
    const json = await response.json();
    expect(response.status).toEqual(207);
    expect(json.gewerbeanmeldung.success).toBe(false);
    expect(json.gewerbeanmeldung.errorType).toBe(ErrorTypeSchema.enum.upstream_error);
    expect(json.steuernummer.success).toBe(true);
  });

  test("Returns 207 with gewerbeanmeldung validation_error when XML creation throws, steuernummer still succeeds", async () => {
    vi.spyOn(gewerbeanmeldung, "createGewerbeanmeldungXml").mockRejectedValue(
      new Error("XML schema mismatch"),
    );

    const response = await postRegisterGewerbe();
    const json = await response.json();
    expect(response.status).toEqual(207);
    expect(json.gewerbeanmeldung.success).toBe(false);
    expect(json.gewerbeanmeldung.errorType).toBe(ErrorTypeSchema.enum.validation_error);
    expect(json.steuernummer.success).toBe(true);
  });

  test("Returns 207 with steuernummer upstream_error when ERiC service is unavailable, gewerbeanmeldung still succeeds", async () => {
    vi.spyOn(eric, "validateFsE").mockReturnValue({
      isValid: undefined,
      returnCode: undefined,
      info: undefined,
    });

    const response = await postRegisterGewerbe();
    const json = await response.json();
    expect(response.status).toEqual(207);
    expect(json.steuernummer.success).toBe(false);
    expect(json.steuernummer.errorType).toBe(ErrorTypeSchema.enum.upstream_error);
    expect(json.gewerbeanmeldung.success).toBe(true);
    expect(json.gewerbeanmeldung.submissionId).toBeTruthy();
  });

  test("Returns 207 with steuernummer validation_error when FsE validation fails, gewerbeanmeldung still succeeds", async () => {
    vi.spyOn(eric, "validateFsE").mockReturnValue({
      isValid: false,
      returnCode: 1,
      info: "FsE validation failed",
    });

    const response = await postRegisterGewerbe();
    const json = await response.json();
    expect(response.status).toEqual(207);
    expect(json.steuernummer.success).toBe(false);
    expect(json.steuernummer.errorType).toBe(ErrorTypeSchema.enum.validation_error);
    expect(json.gewerbeanmeldung.success).toBe(true);
    expect(json.gewerbeanmeldung.submissionId).toBeTruthy();
  });

  test("Returns 400 when both submissions fail with validation errors", async () => {
    vi.spyOn(gewerbeanmeldung, "createGewerbeanmeldungXml").mockRejectedValue(
      new Error("XML schema mismatch"),
    );
    vi.spyOn(eric, "validateFsE").mockReturnValue({
      isValid: false,
      returnCode: 1,
      info: "FsE validation failed",
    });

    const response = await postRegisterGewerbe();
    const json = await response.json();
    expect(response.status).toEqual(400);
    expect(json.gewerbeanmeldung.success).toBe(false);
    expect(json.gewerbeanmeldung.errorType).toBe(ErrorTypeSchema.enum.validation_error);
    expect(json.steuernummer.success).toBe(false);
    expect(json.steuernummer.errorType).toBe(ErrorTypeSchema.enum.validation_error);
  });

  test("Returns 500 when both submissions fail", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: "Server Down" }), { status: 500 }),
    );
    vi.spyOn(eric, "validateFsE").mockReturnValue({
      isValid: undefined,
      returnCode: undefined,
      info: undefined,
    });

    const response = await postRegisterGewerbe();
    const json = await response.json();
    expect(response.status).toEqual(500);
    expect(json.gewerbeanmeldung.success).toBe(false);
    expect(json.steuernummer.success).toBe(false);
  });
});

describe("Route /api/v1/register-gewerbe/:submissionId/events", () => {
  let submissionId: string;

  beforeAll(async () => {
    const response = await postRegisterGewerbe();
    expect(response.status).toEqual(200);
    submissionId = (await response.json()).gewerbeanmeldung.submissionId;
    expect(submissionId).toBeDefined();
  });

  test("Returns 200 OK on GET with /:submissionId/events", async () => {
    const response = await app.request(`/api/v1/register-gewerbe/${submissionId}/events`);
    expect(response.status).toEqual(200);
  });
});
