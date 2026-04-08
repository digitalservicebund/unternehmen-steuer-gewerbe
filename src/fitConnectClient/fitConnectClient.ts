import { createHash } from "node:crypto";
import type { JWK } from "jose";
import { encryptData } from "./crypto";

export interface FitConnectClientConfig {
  clientId: string;
  clientSecret: string;
  privateKey: JWK;
  oauthTokenUrl: string;
  submissionApiUrl: string;
  fetch?: typeof globalThis.fetch;
}

interface TokenResponse {
  access_token: string;
  scope: string;
  token_type: string;
  expires_in: number;
}

interface DestinationResponse {
  destinationId: string;
  encryptionKid: string;
  publicServices: { submissionSchemas: { schemaUri: string }[] }[];
}

interface CreateSubmissionResponse {
  caseId: string;
  destinationId: string;
  submissionId: string;
}

interface SendSubmissionResponse {
  caseId: string;
  destinationId: string;
  submissionId: string;
  publicService: {
    description: string | null;
    identifier: string;
    name: string;
  };
}

export interface DataSchema {
  schemaUri: string;
  mimeType: string;
}

export interface PublicService {
  identifier: string;
  name: string;
  description?: string | null;
}

export interface SubmitDataOptions {
  destinationId: string;
  publicService: PublicService;
  data: string;
  dataSchema: DataSchema;
}

class FitConnectClient {
  private readonly config: FitConnectClientConfig;
  private readonly fetch: typeof globalThis.fetch;
  private accessToken: string | null = null;

  constructor(config: FitConnectClientConfig) {
    this.config = config;
    this.fetch = config.fetch ?? globalThis.fetch; // for testing
  }

  async submitData({
    destinationId,
    publicService,
    data,
    dataSchema,
  }: SubmitDataOptions): Promise<SendSubmissionResponse> {
    await this.authenticate();

    const { submissionId } = await this.createSubmission(destinationId, publicService);

    const { encryptionKid } = await this.getDestination(destinationId);

    const publicJwk = await this.getDestinationKeys(destinationId, encryptionKid);

    const encryptedData = await encryptData(data, publicJwk, dataSchema.mimeType);

    const metadata = this.createMetadata(dataSchema, data);

    const encryptedMetadata = await encryptData(JSON.stringify(metadata), publicJwk);

    return this.sendSubmission(submissionId, encryptedData, encryptedMetadata);
  }

  async getDestination(destinationId: string): Promise<DestinationResponse> {
    return this.fetchFitConnect<DestinationResponse>(
      `${this.config.submissionApiUrl}/v2/destinations/${destinationId}`,
    );
  }

  async getSubmissionEvents(submissionId: string) {
    await this.authenticate();

    interface CaseEventsResponse {
      count: number;
      offset: number;
      totalCount: number;
      eventLog: string[];
    }

    const result = await this.fetchFitConnect<CaseEventsResponse>(
      `${this.config.submissionApiUrl}/v2/submissions/${submissionId}/events`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      },
    );

    const eventLog = [];

    for (const entry of result.eventLog) {
      // TODO the entries should be decrypted
      eventLog.push(entry);
    }

    console.log(eventLog);
    return {
      ...result,
      eventLog,
    };
  }

  private async authenticate(): Promise<void> {
    const tokenResponse = await this.fetchFitConnect<TokenResponse>(this.config.oauthTokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=client_credentials&client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}`,
      redirect: "follow",
    });
    this.accessToken = tokenResponse.access_token;
  }

  private async getDestinationKeys(destinationId: string, encryptionKid: string): Promise<JWK> {
    return this.fetchFitConnect<JWK>(
      `${this.config.submissionApiUrl}/v2/destinations/${destinationId}/keys/${encryptionKid}`,
    );
  }

  private async fetchFitConnect<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await this.fetch(url, options);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`${options?.method ?? "GET"} ${url}: ${text}`);
    }
    return (await res.json()) as T;
  }

  private async createSubmission(
    destinationId: string,
    publicService: PublicService,
  ): Promise<CreateSubmissionResponse> {
    return this.fetchFitConnect<CreateSubmissionResponse>(
      `${this.config.submissionApiUrl}/v2/submissions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.accessToken}`,
        },
        body: JSON.stringify({
          announcedAttachments: [],
          destinationId,
          publicService,
        }),
      },
    );
  }

  private createMetadata(dataSchema: DataSchema, data: string) {
    const dataHash = createHash("sha512").update(data).digest("hex");
    return {
      $schema: "https://schema.fitko.de/fit-connect/metadata/2.0.0/metadata.schema.json",
      contentStructure: {
        data: {
          submissionSchema: {
            schemaUri: dataSchema.schemaUri,
            mimeType: dataSchema.mimeType,
          },
          hash: {
            type: "sha512",
            content: dataHash,
          },
        },
      },
    };
  }

  private async sendSubmission(
    submissionId: string,
    encryptedData: string,
    encryptedMetadata: string,
  ): Promise<SendSubmissionResponse> {
    return this.fetchFitConnect<SendSubmissionResponse>(
      `${this.config.submissionApiUrl}/v2/submissions/${submissionId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.accessToken}`,
        },
        body: JSON.stringify({ encryptedData, encryptedMetadata }),
      },
    );
  }
}

export default FitConnectClient;
