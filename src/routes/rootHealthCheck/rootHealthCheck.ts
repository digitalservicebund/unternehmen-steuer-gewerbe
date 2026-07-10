import { HonoAppType } from "../../honoApp";
import { getSecret } from "../../secrets";
import { healthCheckRoute } from "./rootHealthCheckRoute";

export function addHealthCheckEndpoint(app: HonoAppType): HonoAppType {
  app.openapi(healthCheckRoute, (c) => {
    const { verbose } = c.req.valid("query");

    return c.json(
      {
        status: "ok",
        ...(process.env.COMMIT_SHA ? { gitCommitSHA: process.env.COMMIT_SHA } : {}),
        ...(verbose
          ? {
              fitConnectUrls: {
                oauthTokenUrl: getSecret("FIT_CONNECT_OAUTH_TOKEN_URL"),
                submissionApiUrl: getSecret("FIT_CONNECT_SUBMISSION_API_URL"),
                destinationApiUrl: getSecret("FIT_CONNECT_DESTINATION_API_URL"),
                routingApiUrl: getSecret("FIT_CONNECT_ROUTING_API_URL"),
              },
            }
          : {}),
      },
      200,
    );
  });

  return app;
}
