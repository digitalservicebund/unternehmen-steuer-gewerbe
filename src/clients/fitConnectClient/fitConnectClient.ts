import { decodeProtectedHeader, type JWK } from "jose";
import { AuthenticationApi } from "./apis/authenticationApi";
import { RoutingApi } from "./apis/routingApi";
import {
  type PublicService,
  type SendSubmissionResponse,
  SubmissionApi,
} from "./apis/submissionApi";
import { encryptData, verifyEventToken } from "./crypto";
import { type Environment, getEnvironmentUrls } from "./environments";
import type { FetchFn } from "./http";
import { createMetadata, type DataSchema } from "./metadata";
import { getSecret } from "../../secrets";
import { DestinationApi } from "./apis/destinationApi";

export type { PublicService } from "./apis/submissionApi";
export interface FitConnectClientConfig {
  environment: Environment;
  clientId: string;
  clientSecret: string;
  privateKey: JWK;
  signatureVerificationKey: JWK;
  fetch?: FetchFn;
}

export interface SubmitDataOptions {
  destinationId: string;
  publicService: PublicService;
  data: string;
  dataSchema: DataSchema;
}

export function getFitConnectClient() {
  return new FitConnectClient({
    environment: (getSecret("FIT_CONNECT_ENV") || "test") as Environment,
    clientId: getSecret("FIT_CONNECT_CLIENT_ID"),
    clientSecret: getSecret("FIT_CONNECT_CLIENT_SECRET"),
    privateKey: getSecret("FIT_CONNECT_PRIVATE_KEY_DECRYPTION_JWK")
      ? JSON.parse(getSecret("FIT_CONNECT_PRIVATE_KEY_DECRYPTION_JWK"))
      : undefined,
    signatureVerificationKey: getSecret("FIT_CONNECT_SIGNATURE_VERIFICATION_JWK")
      ? JSON.parse(getSecret("FIT_CONNECT_SIGNATURE_VERIFICATION_JWK"))
      : undefined,
  });
}

/**
 * A client for interacting with the FIT-Connect APIs, handling authentication, submission creation, data encryption, and event retrieval.
 */
class FitConnectClient {
  private readonly config: FitConnectClientConfig;
  private accessToken: string | null = null;

  private readonly authenticationApi: AuthenticationApi;
  private readonly submissionApi: SubmissionApi;
  private readonly destinationApi: DestinationApi;
  readonly routingApi: RoutingApi;

  constructor(config: FitConnectClientConfig) {
    this.config = config;
    const urls = getEnvironmentUrls(config.environment);
    const fetch = config.fetch ?? globalThis.fetch; // for testing
    const getAccessToken = () => this.accessToken;

    this.authenticationApi = new AuthenticationApi({
      fetch,
      oauthTokenUrl: urls.oauthTokenUrl,
    });
    this.submissionApi = new SubmissionApi({
      fetch,
      submissionApiUrl: urls.submissionApiUrl,
      getAccessToken,
    });
    this.destinationApi = new DestinationApi({
      fetch,
      destinationApiUrl: urls.destinationApiUrl,
    });
    this.routingApi = new RoutingApi({
      fetch,
      routingApiUrl: urls.routingApiUrl,
      getAccessToken,
    });
  }

  /**
   * Authenticate with the FIT-Connect Authentication API to obtain an access token, which is stored in the client instance for use in subsequent API calls.
   */
  private async authenticate(): Promise<void> {
    const tokenResponse = await this.authenticationApi.requestToken(
      this.config.clientId,
      this.config.clientSecret,
    );
    this.accessToken = tokenResponse.access_token;
  }

  /**
   * Submit data to a specified destination and public service.
   * This method handles the entire workflow of authenticating, creating a submission, retrieving encryption keys, encrypting the data and metadata, and sending the submission.
   *
   * @param options - An object containing the destination ID, public service details, data to be submitted, and the data schema.
   * @returns A promise that resolves to the response from the sendSubmission API call, which includes details about the submission and the public service.
   * @throws Will throw an error if authentication fails or if any of the API calls fail.
   */
  async submitData({
    destinationId,
    publicService,
    data,
    dataSchema,
  }: SubmitDataOptions): Promise<SendSubmissionResponse> {
    await this.authenticate();

    const { submissionId } = await this.submissionApi.createSubmission(
      destinationId,
      publicService,
    );

    const metadata = createMetadata(dataSchema, data);

    const { encryptionKid } = await this.submissionApi.getDestination(destinationId);
    const publicJwk = await this.submissionApi.getDestinationKeys(destinationId, encryptionKid);

    const encryptedData = await encryptData(data, publicJwk, dataSchema.mimeType);
    const encryptedMetadata = await encryptData(JSON.stringify(metadata), publicJwk);

    return this.submissionApi.sendSubmission(submissionId, encryptedData, encryptedMetadata);
  }

  /**
   * Retrieve the event-log associated with a specific submission.
   *
   * @param submissionId
   * @returns A promise that resolves to the decrypted event-log of a submission
   */
  async getSubmissionEvents(submissionId: string, destinationId: string) {
    await this.authenticate();

    const result = await this.submissionApi.getSubmissionEvents(submissionId);
    // For events which are signed by FIT-Connect itself
    const wellKnownJWKs = await this.destinationApi.getWellKnownJWKs();
    // For the events which are signed by the Fachverfahren
    const { keys: destinationKeys } = await this.destinationApi.getDestination(destinationId);

    const eventLog = await Promise.all(
      result.eventLog.map((entry) => {
        const header = decodeProtectedHeader(entry);
        const jwkKeys = [...wellKnownJWKs.keys, ...destinationKeys];
        const key = jwkKeys.find((jwk) => jwk.kid === header.kid);
        if (!key) {
          return Promise.resolve(null);
        }
        return verifyEventToken(entry, key);
      }),
    );

    return { ...result, eventLog };
  }
}

export default FitConnectClient;
