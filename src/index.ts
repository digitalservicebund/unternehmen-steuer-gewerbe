import { serve } from "@hono/node-server";
import "dotenv/config";
import { initializeEricForSending } from "@digitalservicebund/unternehmen-steuer-gewerbe-privat";
import app from "./app";
import os from "node:os";

const port = 3000;

// Initialize once, so we know early on that the environment is set up correctly (env vars, secrets)
initializeEricForSending();

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    const now = new Date().toISOString();
    const logEntry = {
      isoDateTime: now,
      event: "Server started",
      host: os.hostname(),
      port: info.port,
      url: `http://${os.hostname}:${port}`,
    };
    console.log(`${JSON.stringify(logEntry)}`);
  },
);
