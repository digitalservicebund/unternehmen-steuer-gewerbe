import type { JWK } from "jose";
import { type FetchFn, fetchFitConnect } from "../http";

export interface PublicService {
  identifier: string;
  name: string;
  description?: string | null;
}

export interface DestinationResponse {
  destinationId: string;
  encryptionKid: string;
  publicServices: { submissionSchemas: { schemaUri: string }[] }[];
}

export interface CreateSubmissionResponse {
  caseId: string;
  destinationId: string;
  submissionId: string;
}

export interface SendSubmissionResponse {
  caseId: string;
  destinationId: string;
  submissionId: string;
  publicService: {
    description: string | null;
    identifier: string;
    name: string;
  };
}

export interface CaseEventsResponse {
  count: number;
  offset: number;
  totalCount: number;
  eventLog: string[];
}

export interface SubmissionApiConfig {
  fetch: FetchFn;
  submissionApiUrl: string;
  getAccessToken: () => string | null;
}

/**
 * Client for the FIT-Connect Submission API: https://docs.fitko.de/fit-connect/docs/apis/submission-api
 *
 * Provides methods to create submissions, send encrypted data, retrieve submission events, and get destination details and keys.
 * The Submission API is the core of our interaction with FIT-Connect, as it's responsible for handling the submission of data to the relevant authorities.
 */
export class SubmissionApi {
  private readonly fetch: FetchFn;
  private readonly submissionApiUrl: string;
  private readonly getAccessToken: () => string | null;

  constructor({ fetch, submissionApiUrl, getAccessToken }: SubmissionApiConfig) {
    this.fetch = fetch;
    this.submissionApiUrl = submissionApiUrl;
    this.getAccessToken = getAccessToken;
  }

  async createSubmission(
    destinationId: string,
    publicService: PublicService,
  ): Promise<CreateSubmissionResponse> {
    return fetchFitConnect<CreateSubmissionResponse>(
      this.fetch,
      `${this.submissionApiUrl}/v2/submissions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getAccessToken()}`,
        },
        body: JSON.stringify({
          announcedAttachments: [],
          destinationId,
          publicService,
        }),
      },
    );
  }

  async sendSubmission(
    submissionId: string,
    encryptedData: string,
    encryptedMetadata: string,
  ): Promise<SendSubmissionResponse> {
    return fetchFitConnect<SendSubmissionResponse>(
      this.fetch,
      `${this.submissionApiUrl}/v2/submissions/${submissionId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getAccessToken()}`,
        },
        body: JSON.stringify({ encryptedData, encryptedMetadata }),
      },
    );
  }

  async getSubmissionEvents(submissionId: string): Promise<CaseEventsResponse> {
    return fetchFitConnect<CaseEventsResponse>(
      this.fetch,
      `${this.submissionApiUrl}/v2/submissions/${submissionId}/events`,
      {
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`,
        },
      },
    );
  }

  async getDestination(destinationId: string): Promise<DestinationResponse> {
    return fetchFitConnect<DestinationResponse>(
      this.fetch,
      `${this.submissionApiUrl}/v2/destinations/${destinationId}`,
    );
  }

  async getDestinationKeys(destinationId: string, encryptionKid: string): Promise<JWK> {
    return fetchFitConnect<JWK>(
      this.fetch,
      `${this.submissionApiUrl}/v2/destinations/${destinationId}/keys/${encryptionKid}`,
    );
  }
}
