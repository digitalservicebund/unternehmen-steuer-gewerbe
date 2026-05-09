import { expect, it } from "vitest";
import app from "../../app";

it("Returns 200 OK and non-empty JSON on GET", async () => {
  const response = await app.request("/doc");
  const json = await response.json();
  expect(response.status).toEqual(200);
  expect(response.headers.get("content-type")).toMatch(/json/);
  expect(json).toBeTruthy();
});

it("Returns 200 OK and OpenAPI on GET", async () => {
  const response = await app.request("/ui");
  const text = await response.text();
  expect(response.status).toEqual(200);
  expect(text).toContain("SwaggerUI");
});
