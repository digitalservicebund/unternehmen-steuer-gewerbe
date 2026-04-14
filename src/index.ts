import { serve } from "@hono/node-server";
import "dotenv/config";
import app from "./app";

const port = 3000;

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Hono app listening on port ${info.port}`);
  },
);
