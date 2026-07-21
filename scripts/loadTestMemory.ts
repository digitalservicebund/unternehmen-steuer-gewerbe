import { execSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import autocannon from "autocannon";
import { registerGewerbeSampleRequestAllFieldsFilled } from "../src/routes/registerGewerbe/testHelpers";

const URL = process.env.LOAD_TEST_URL ?? "http://localhost:3000/api/v1/register-gewerbe";
const PORT = Number(process.env.LOAD_TEST_PORT ?? 3000);
const DURATION = Number(process.env.LOAD_TEST_DURATION ?? 30);
const CONNECTIONS = Number(process.env.LOAD_TEST_CONNECTIONS ?? 10);
const SAMPLE_INTERVAL_MS = 500;

type MemorySample = { elapsedMs: number; rssMb: number };

function findListeningPid(port: number): number {
  const output = execSync(`lsof -ti:${port}`, { encoding: "utf8" }).trim();
  if (!output) {
    throw new Error(`No process listening on port ${port}. Start the app first (pnpm start).`);
  }
  return Number(output.split("\n")[0]);
}

function readRssMb(pid: number): number {
  const status = readFileSync(`/proc/${pid}/status`, "utf8");
  const match = status.match(/^VmRSS:\s+(\d+)\s+kB$/m);
  if (!match) {
    throw new Error(`Could not read VmRSS for pid ${pid}`);
  }
  return Number(match[1]) / 1024;
}

function summarizeMemory(samples: MemorySample[]) {
  if (samples.length === 0) {
    throw new Error("No memory samples collected");
  }
  const values = samples.map((s) => s.rssMb).sort((a, b) => a - b);
  const min = values[0] as number;
  const max = values[values.length - 1] as number;
  const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
  const p95 = values[Math.floor(values.length * 0.95)] as number;
  return { minMb: min, maxMb: max, avgMb: avg, p95Mb: p95 };
}

function getGitInfo() {
  const branch = execSync("git rev-parse --abbrev-ref HEAD", {
    encoding: "utf8",
  }).trim();
  const commit = execSync("git rev-parse --short HEAD", {
    encoding: "utf8",
  }).trim();
  return { branch, commit };
}

async function main() {
  const pid = findListeningPid(PORT);
  console.log(`Sampling memory of pid ${pid} (port ${PORT}) every ${SAMPLE_INTERVAL_MS}ms`);

  const startedAt = Date.now();
  const samples: MemorySample[] = [];
  const sampler = setInterval(() => {
    try {
      samples.push({ elapsedMs: Date.now() - startedAt, rssMb: readRssMb(pid) });
    } catch (error) {
      console.error("Failed to sample memory:", error);
    }
  }, SAMPLE_INTERVAL_MS);

  console.log(`Running autocannon against ${URL} for ${DURATION}s with ${CONNECTIONS} connections`);
  const result = await autocannon({
    url: URL,
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(registerGewerbeSampleRequestAllFieldsFilled),
    connections: CONNECTIONS,
    duration: DURATION,
  });

  clearInterval(sampler);
  const memory = summarizeMemory(samples);
  const gitInfo = getGitInfo();

  console.log("\n=== Autocannon summary ===");
  console.log(`Requests/sec: ${result.requests.average}`);
  console.log(
    `Latency (ms) avg/p50/p99: ${result.latency.average}/${result.latency.p50}/${result.latency.p99}`,
  );
  console.log(`2xx: ${result["2xx"]}, non-2xx: ${result.non2xx}`);
  console.log(`Errors: ${result.errors}, Timeouts: ${result.timeouts}`);

  console.log("\n=== Memory summary (RSS) ===");
  console.log(
    `min/avg/p95/max MB: ${memory.minMb.toFixed(1)}/${memory.avgMb.toFixed(1)}/${memory.p95Mb.toFixed(1)}/${memory.maxMb.toFixed(1)}`,
  );

  const outputPath =
    process.env.LOAD_TEST_OUTPUT ?? `loadtest-results/${gitInfo.branch}-${startedAt}.json`;
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(
    outputPath,
    JSON.stringify(
      {
        gitInfo,
        startedAt,
        url: URL,
        connections: CONNECTIONS,
        duration: DURATION,
        autocannon: result,
        memorySamples: samples,
        memorySummary: memory,
      },
      null,
      2,
    ),
  );
  console.log(`\nFull results written to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
