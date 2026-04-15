import { expect, test } from "vitest";
import app from "../../app";

test("Returns 200 OK and non-empty JSON on GET", async () => {
  const response = await app.request("/api/v1/doc");
  const json = await response.json();
  expect(response.status).toEqual(200);
  expect(response.headers.get("content-type")).toMatch(/json/);
  expect(json).toBeTruthy();
});
