import { describe, test, expect } from "vitest";
import supertest, { type SuperTest, Test } from "supertest";
import express, { type Express } from "express";

const app: Express = express();

let request = supertest(app);

describe("API tests", () => {
  test("Returns OK 200", async () => {
    const response = await request.get("/api/v1/test");
    expect(response.status).toEqual("200");
  });
});
