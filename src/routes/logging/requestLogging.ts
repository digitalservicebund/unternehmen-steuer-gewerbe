import { HonoAppType } from "../../app";
import { getConnInfo } from "@hono/node-server/conninfo";

export function addRequestLogging(app: HonoAppType): HonoAppType {
  // add basic JSON logging when not in test
  // ignore requests on / (health-check)
  if (process.env.NODE_ENV !== "test") {
    app.use("/api/*", async (c, next) => {
      const start = Date.now();

      // Wait for the actual request to process
      await next();

      // Now we have the response details and the Context 'c'
      const ms = Date.now() - start;
      const now = new Date().toISOString();

      // Get IP
      const info = getConnInfo(c);
      const ip = c.req.header("x-forwarded-for")?.split(",")[0] || info.remote.address; // handle forwanding in kubernetes

      const requestResponseData = {
        isoDatetime: now,
        event: "request received",
        requestIP: ip,
        requestMethod: c.req.method,
        requestPath: c.req.path,
        responseStatus: c.res.status,
        responseTimeMs: ms,
      };

      console.log(JSON.stringify(requestResponseData));
    });
  }

  return app;
}
