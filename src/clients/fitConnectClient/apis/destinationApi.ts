import type { JWK } from "jose";
import { type FetchFn, fetchFitConnect } from "../http";

export interface DestinationApiConfig {
  fetch: FetchFn;
  destinationApiUrl: string;
}

interface DestinationKeysResponse {
  count: number;
  offset: number;
  totalCount: number;
  keys: JWK[];
}

interface WellKnownJWKsResponse {
  keys: JWK[];
}

/**
 * Client for the FIT-Connect Destination API: https://docs.fitko.de/fit-connect/docs/apis/destination-api
 *
 * Used to get detailed Information of a Destination
 */
export class DestinationApi {
  private readonly fetch: FetchFn;
  private readonly destinationApiUrl: string;

  constructor({ fetch, destinationApiUrl }: DestinationApiConfig) {
    this.fetch = fetch;
    this.destinationApiUrl = destinationApiUrl;
  }

  async getDestination(destinationId: string): Promise<DestinationKeysResponse> {
    return fetchFitConnect<DestinationKeysResponse>(
      this.fetch,
      `${this.destinationApiUrl}/v2/destinations/${destinationId}/keys`,
    );
  }

  async getWellKnownJWKs() {
    return fetchFitConnect<WellKnownJWKsResponse>(
      this.fetch,
      `${this.destinationApiUrl}//.well-known/jwks.json`,
    );
  }
}
