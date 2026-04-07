import { createHash } from "node:crypto";
import { importJWK, CompactEncrypt, type JWK } from "jose";

export interface FitConnectClientConfig {
  clientId: string;
  clientSecret: string;
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

    const publicJwk = await this.getEncryptionKey(destinationId, encryptionKid);

    console.log(dataSchema);

    const encryptedData = await this.encryptData(data, publicJwk, dataSchema.mimeType);

    const dataHash = createHash("sha512").update(data).digest("hex");
    const metadata = {
      $schema: "https://schema.fitko.de/fit-connect/metadata/2.1.0/metadata.schema.json",
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
        attachments: [],
      },
    };

    const encryptedMetadata = await this.encryptData(JSON.stringify(metadata), publicJwk);

    return this.sendSubmission(submissionId, encryptedData, encryptedMetadata);
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

  async getDestination(destinationId: string): Promise<DestinationResponse> {
    return this.fetchFitConnect<DestinationResponse>(
      `${this.config.submissionApiUrl}/v2/destinations/${destinationId}`,
    );
  }

  private async getEncryptionKey(destinationId: string, encryptionKid: string): Promise<JWK> {
    return this.fetchFitConnect<JWK>(
      `${this.config.submissionApiUrl}/v2/destinations/${destinationId}/keys/${encryptionKid}`,
    );
  }

  private async encryptData(
    data: string,
    publicJwk: JWK,
    contentType = "application/json",
  ): Promise<string> {
    const { key_ops: _, ...jwkForImport } = publicJwk;
    const publicKey = await importJWK(jwkForImport, "RSA-OAEP-256");
    const payload = new TextEncoder().encode(data);

    return new CompactEncrypt(payload)
      .setProtectedHeader({
        alg: "RSA-OAEP-256",
        enc: "A256GCM",
        kid: publicJwk.kid!,
        cty: contentType,
      })
      .encrypt(publicKey);
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
