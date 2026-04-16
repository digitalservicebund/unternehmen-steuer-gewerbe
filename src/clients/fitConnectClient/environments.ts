export type Environment = "test" | "stage" | "prod";

export interface EnvironmentUrls {
  oauthTokenUrl: string;
  submissionApiUrl: string;
  destinationApiUrl: string;
  routingApiUrl: string;
}

// https://docs.fitko.de/fit-connect/docs/getting-started/environments
const ENVIRONMENTS: Record<Environment, EnvironmentUrls> = {
  test: {
    oauthTokenUrl: "https://auth-testing.fit-connect.fitko.dev/token",
    submissionApiUrl: "https://test.fit-connect.fitko.dev/submission-api",
    destinationApiUrl: "https://test.fit-connect.fitko.dev/destination-api",
    routingApiUrl: "https://routing-api-testing.fit-connect.fitko.dev",
  },
  stage: {
    oauthTokenUrl: "https://auth-refz.fit-connect.fitko.net/token",
    submissionApiUrl: "https://stage.fit-connect.fitko.net/submission-api",
    destinationApiUrl: "https://stage.fit-connect.fitko.net/destination-api",
    // No dedicated Routing API for stage; prod is used as fallback per FIT-Connect docs
    routingApiUrl: "https://routing-api-prod.fit-connect.fitko.net",
  },
  prod: {
    oauthTokenUrl: "https://auth-prod.fit-connect.fitko.net/token",
    submissionApiUrl: "https://prod.fit-connect.fitko.net/submission-api",
    destinationApiUrl: "https://prod.fit-connect.fitko.net/destination-api",
    routingApiUrl: "https://routing-api-prod.fit-connect.fitko.net",
  },
};

export function getEnvironmentUrls(env: string): EnvironmentUrls {
  if (!(env in ENVIRONMENTS)) {
    throw new Error(
      `Unknown FIT_CONNECT_ENV: "${env}". Must be one of: ${Object.keys(ENVIRONMENTS).join(", ")}`,
    );
  }
  return ENVIRONMENTS[env as Environment];
}
