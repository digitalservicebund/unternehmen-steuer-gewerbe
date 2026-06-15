import { serve } from "@hono/node-server";
import "dotenv/config";
import { initializeEricForSending } from "@digitalservicebund/unternehmen-steuer-gewerbe-privat";
import app from "./app";
import os from "node:os";

const port = 3000;

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
