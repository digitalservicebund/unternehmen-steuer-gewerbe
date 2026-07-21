import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it, expect, vi } from "vitest";

// Note 1: mocking is "global" on file level, therefore we have separate files for tests that mock and those that don't.
// Note 2: We need to mock here, such that the private library correctly initializes their internal libraries before the tests are run.
vi.mock("@digitalservicebund/unternehmen-steuer-gewerbe-privat", () => ({
  validateFsE: vi.fn().mockReturnValue({ valid: true }),
  createElsterFsEEUnXml: vi.fn().mockReturnValue("<xml/>"),
  sendFsE: vi.fn().mockReturnValue({ success: true }),
  getFinanzamtId: vi.fn().mockReturnValue(["mock-finanzamt-id"]),
  getFinanzamtDetailsById: vi.fn().mockReturnValue({
    name: "Finanzamt Mock",
    hausanschrift: {
      strasse: "Mockstraße",
      hausnummer: "1",
      postleitzahl: "00000",
      ort: "Mockstadt",
    },
    telefonnummer: "0000 000-0",
  }),
}));

const { mockSubmitData, mockGetGewerbeRoutingInfo } = vi.hoisted(() => ({
  mockSubmitData: vi.fn().mockResolvedValue({ submissionId: "mock-submission-id" }),
  mockGetGewerbeRoutingInfo: vi.fn().mockResolvedValue({
    ags: "03046001",
    ars: "084210000000",
    gewerbeamt: {
      name: "Stadt Fulda",
      adresse: { strasse: "Schlossstraße", hausnummer: "1", postleitzahl: "36037", ort: "Fulda" },
      telefon: "0661 102-0",
      onlineServices: [],
    },
    fitConnectDestinationInformation: { destinationId: "mock-destination-id" },
  }),
}));

vi.mock("../../clients/fitConnectClient/fitConnectClient", () => ({
  getFitConnectClient: () => ({ submitData: mockSubmitData }),
}));

vi.mock("./getGewerbeRoutingInfo", () => ({
  getGewerbeRoutingInfo: mockGetGewerbeRoutingInfo,
}));

import app from "../../app";
import { registerGewerbeSampleRequestAllFieldsFilled } from "./testHelpers";

const REQUEST_COUNT = Number(process.env.LOAD_TEST_REQUESTS ?? 100);
const SAMPLE_INTERVAL_MS = 50;

type RequestResult = { status: number; latencyMs: number };
type MemorySample = { elapsedMs: number; rssMb: number };

async function postRegisterGewerbe(): Promise<RequestResult> {
  const startedAt = performance.now();
  const response = await app.request("/api/v1/register-gewerbe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(registerGewerbeSampleRequestAllFieldsFilled),
  });
  return { status: response.status, latencyMs: performance.now() - startedAt };
}

function percentile(sortedValues: number[], p: number): number {
  return sortedValues[Math.min(sortedValues.length - 1, Math.floor(sortedValues.length * p))]!;
}

describe("Load test: POST /api/v1/register-gewerbe (externals mocked)", () => {
  it(
    `handles ${REQUEST_COUNT} concurrent requests, recording latency and memory`,
    { timeout: 5 * 60 * 1000 },
    async () => {
      const memorySamples: MemorySample[] = [];
      const startedAt = Date.now();
      const sampler = setInterval(() => {
        memorySamples.push({
          elapsedMs: Date.now() - startedAt,
          rssMb: process.memoryUsage().rss / 1024 / 1024,
        });
      }, SAMPLE_INTERVAL_MS);

      const results = await Promise.all(
        Array.from({ length: REQUEST_COUNT }, () => postRegisterGewerbe()),
      );

      clearInterval(sampler);

      const latencies = results.map((r) => r.latencyMs).sort((a, b) => a - b);
      const errorCount = results.filter((r) => r.status !== 200).length;
      const rssValues = memorySamples.map((s) => s.rssMb).sort((a, b) => a - b);

      const summary = {
        requestCount: REQUEST_COUNT,
        errorCount,
        latency: {
          averageMs: latencies.reduce((sum, v) => sum + v, 0) / latencies.length,
          p50Ms: percentile(latencies, 0.5),
          p99Ms: percentile(latencies, 0.99),
        },
        memory: {
          minMb: rssValues[0]!,
          avgMb: rssValues.reduce((sum, v) => sum + v, 0) / rssValues.length,
          p95Mb: percentile(rssValues, 0.95),
          maxMb: rssValues[rssValues.length - 1]!,
        },
      };

      console.log("Load test summary:", summary);

      const branch = execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf8" }).trim();
      const outputPath =
        process.env.LOAD_TEST_OUTPUT ?? `loadtest-results/${branch}-${startedAt}.json`;
      mkdirSync(dirname(outputPath), { recursive: true });
      writeFileSync(
        outputPath,
        JSON.stringify({ branch, startedAt, summary, memorySamples }, null, 2),
      );

      expect(errorCount, "all requests should succeed").toBe(0);
    },
  );
});
