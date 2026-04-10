import { type FetchFn, fetchFitConnect } from "../http";

export interface TokenResponse {
  access_token: string;
  scope: string;
  token_type: string;
  expires_in: number;
}

export interface AuthenticationApiConfig {
  fetch: FetchFn;
  oauthTokenUrl: string;
}

/**
 * Client for the FIT-Connect OAuth API
 */
export class AuthenticationApi {
  private readonly fetch: FetchFn;
  private readonly oauthTokenUrl: string;

  constructor({ fetch, oauthTokenUrl }: AuthenticationApiConfig) {
    this.fetch = fetch;
    this.oauthTokenUrl = oauthTokenUrl;
  }

  async requestToken(clientId: string, clientSecret: string): Promise<TokenResponse> {
    return fetchFitConnect<TokenResponse>(this.fetch, this.oauthTokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
      redirect: "follow",
    });
  }
}
