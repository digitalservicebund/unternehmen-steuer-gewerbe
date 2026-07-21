import { readFileSync } from "node:fs";

type LoadTestResult = {
  branch: string;
  summary: {
    requestCount: number;
    errorCount: number;
    latency: { averageMs: number; p50Ms: number; p99Ms: number };
    memory: { minMb: number; avgMb: number; p95Mb: number; maxMb: number };
  };
};

function loadResult(path: string): LoadTestResult {
  return JSON.parse(readFileSync(path, "utf8"));
}

function row(label: string, a: string | number, b: string | number) {
  console.log(`${label.padEnd(20)} ${String(a).padStart(15)} ${String(b).padStart(15)}`);
}

const [pathA, pathB] = process.argv.slice(2);
if (!pathA || !pathB) {
  console.error("Usage: pnpm loadtest:compare <result-a.json> <result-b.json>");
  process.exit(1);
}

const a = loadResult(pathA);
const b = loadResult(pathB);

row("", a.branch, b.branch);
row("requests", a.summary.requestCount, b.summary.requestCount);
row("errors", a.summary.errorCount, b.summary.errorCount);
row("latency avg (ms)", a.summary.latency.averageMs.toFixed(1), b.summary.latency.averageMs.toFixed(1));
row("latency p50 (ms)", a.summary.latency.p50Ms.toFixed(1), b.summary.latency.p50Ms.toFixed(1));
row("latency p99 (ms)", a.summary.latency.p99Ms.toFixed(1), b.summary.latency.p99Ms.toFixed(1));
row("mem min (MB)", a.summary.memory.minMb.toFixed(1), b.summary.memory.minMb.toFixed(1));
row("mem avg (MB)", a.summary.memory.avgMb.toFixed(1), b.summary.memory.avgMb.toFixed(1));
row("mem p95 (MB)", a.summary.memory.p95Mb.toFixed(1), b.summary.memory.p95Mb.toFixed(1));
row("mem max (MB)", a.summary.memory.maxMb.toFixed(1), b.summary.memory.maxMb.toFixed(1));
