import { describe, it, expect } from "vitest";
import { HttpStatusCode } from "../../helpers/httpStatusCodes";
import app from "../../app";
import { type KommunenResponseSchema } from "./kommunenInterfaces";
import { type z } from "@hono/zod-openapi";

describe("Route /api/v1/kommunen", () => {
  it("returns the names of the supported Kommunen", async () => {
    const response = await app.request("/api/v1/kommunen");

    expect(response.status).toBe(HttpStatusCode.Ok);
    const body: z.infer<typeof KommunenResponseSchema> = await response.json();
    expect(body).toEqual({ kommunen: ["Dresden"] });
  });
});
