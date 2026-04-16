import type { FetchFn } from "../http";

export interface RoutingApiConfig {
  fetch: FetchFn;
  routingApiUrl: string;
  getAccessToken: () => string | null;
}

/**
 * Client for the FIT-Connect Routing API: https://docs.fitko.de/fit-connect/docs/apis/routing-api
 *
 * Used to look up destinations by LeiKa key + AGS. Not yet wired up.
 * Our Gewerbeanmeldung currently uses a hardcoded destinationId in src/app.ts.
 */
export class RoutingApi {
  private readonly fetch: FetchFn;
  private readonly routingApiUrl: string;
  private readonly getAccessToken: () => string | null;

  constructor({ fetch, routingApiUrl, getAccessToken }: RoutingApiConfig) {
    this.fetch = fetch;
    this.routingApiUrl = routingApiUrl;
    this.getAccessToken = getAccessToken;
  }
}
