import { getSecret } from "../../secrets";
import type { FetchFn } from "./http";

export interface AkdbClientConfig {
  baseUrl: string;
  username: string;
  password: string;
  fetch?: FetchFn;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export function getAkdbClient(): AkdbClient {
  return new AkdbClient({
    baseUrl: getSecret("AKDB_BASE_URL"),
    username: getSecret("AKDB_USERNAME"),
    password: getSecret("AKDB_PASSWORD"),
  });
}

export class AkdbClient {
  private readonly config: AkdbClientConfig;
  private readonly fetch: FetchFn;

  private readonly tokenUrl: string;
  private readonly sendUrl: string;

  constructor(config: AkdbClientConfig) {
    this.config = config;
    this.fetch = config.fetch ?? globalThis.fetch;
    this.tokenUrl = `${config.baseUrl}/restapi/v3.0/messages/token`;
    this.sendUrl = `${config.baseUrl}/restapi/v3.0/messages/xoev`;
  }

  async fetchToken(): Promise<TokenResponse> {
    const body = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: this.config.username,
      client_secret: this.config.password,
    });

    const res = await this.fetch(this.tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`POST ${this.tokenUrl}: ${text}`);
    }

    return res.json() as Promise<TokenResponse>;
  }

  async sendXoevMessage(xml: string, accessToken: string): Promise<void> {
    const res = await this.fetch(this.sendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/xml",
        Authorization: `Bearer ${accessToken}`,
      },
      body: xml,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`POST ${this.sendUrl}: ${text}`);
    }
  }
}
