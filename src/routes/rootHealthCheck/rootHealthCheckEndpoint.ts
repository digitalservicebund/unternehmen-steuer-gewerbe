import { HonoAppType } from "../../app";
import { getSecret } from "../../secrets";
import { healthCheckRoute } from "./rootHealthCheckRoute";

export function addHealthCheckEndpoint(app: HonoAppType): HonoAppType {
  app.openapi(healthCheckRoute, (c) => {
    const { verbose } = c.req.valid("query");

    return c.json(
      {
        status: "ok",
        ...(verbose ? { fitConnectEnvironment: getSecret("FIT_CONNECT_ENV") } : {}),
      },
      200,
    );
  });

  return app;
}
