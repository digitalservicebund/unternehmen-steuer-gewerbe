import { serve } from "@hono/node-server";
import "dotenv/config";
import app from "./app";
import os from "node:os";

const port = 3000;

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
