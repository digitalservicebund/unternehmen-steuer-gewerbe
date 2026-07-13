import { HonoAppType } from "../../honoApp";
import { getEnvironmentVariable } from "../../secretsAndEnvironmentVariables";
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
                oauthTokenUrl: getEnvironmentVariable("FIT_CONNECT_OAUTH_TOKEN_URL"),
                submissionApiUrl: getEnvironmentVariable("FIT_CONNECT_SUBMISSION_API_URL"),
                destinationApiUrl: getEnvironmentVariable("FIT_CONNECT_DESTINATION_API_URL"),
                routingApiUrl: getEnvironmentVariable("FIT_CONNECT_ROUTING_API_URL"),
              },
            }
          : {}),
      },
      200,
    );
  });

  return app;
}
