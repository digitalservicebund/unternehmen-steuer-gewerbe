import { describe, expect, it } from "vitest";

import app from "./app";
import { HttpStatusCode } from "./helpers/httpStatusCodes";

describe("App tests", () => {
  it("Returns 404 NOT FOUND on unsupported route", async () => {
    const response = await app.request("/unsupported-url");
    expect(response.status).toEqual(HttpStatusCode.NotFound);
  });
});
