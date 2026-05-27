import axios from "axios";
import { decodeProtectedHeader, type JWK, type JWTPayload } from "jose";
import { encryptData, verifyEventToken } from "./crypto";
import { type Environment, getEnvironmentUrls } from "./environments";
import { createMetadata, type DataSchema } from "./metadata";
import { getSecret } from "../../secrets";

interface FitConnectClientConfig {
  environment: Environment;
  clientId: string;
  clientSecret: string;
  privateKey: JWK;
}

interface PublicService {
  identifier: string;
  name: string;
  description?: string | null;
}

interface SubmitDataOptions {
  destinationId: string;
  publicService: PublicService;
  data: string;
  dataSchema: DataSchema;
}

interface SubmissionEventsResponse {
  count: number;
  offset: number;
  totalCount: number;
  eventLog: (JWTPayload | null)[];
}

interface SubmitDataResponse {
  caseId: string;
  destinationId: string;
  submissionId: string;
  publicService: {
    description: string | null;
    identifier: string;
    name: string;
  };
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

interface CaseEventsResponse {
  count: number;
  offset: number;
  totalCount: number;
  eventLog: string[];
}

interface DestinationKeysResponse {
  count: number;
  offset: number;
  totalCount: number;
  keys: JWK[];
}

export function getFitConnectClient() {
  const config: FitConnectClientConfig = {
    environment: (getSecret("FIT_CONNECT_ENV") || "test") as Environment,
    clientId: getSecret("FIT_CONNECT_CLIENT_ID"),
    clientSecret: getSecret("FIT_CONNECT_CLIENT_SECRET"),
    privateKey: getSecret("FIT_CONNECT_PRIVATE_KEY_DECRYPTION_JWK")
      ? JSON.parse(getSecret("FIT_CONNECT_PRIVATE_KEY_DECRYPTION_JWK"))
      : undefined,
  };

  const urls = getEnvironmentUrls(config.environment);

  async function authenticate(): Promise<string> {
    const { data } = await axios.post<TokenResponse>(
      urls.oauthTokenUrl,
      `grant_type=client_credentials&client_id=${config.clientId}&client_secret=${config.clientSecret}`,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
    );
    return data.access_token;
  }

  async function submitData({
    destinationId,
    publicService,
    data,
    dataSchema,
  }: SubmitDataOptions): Promise<SubmitDataResponse> {
    const accessToken = await authenticate();

    const { data: submission } = await axios.post<CreateSubmissionResponse>(
      `${urls.submissionApiUrl}/v2/submissions`,
      { announcedAttachments: [], destinationId, publicService },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    const metadata = createMetadata(dataSchema, data);

    const { data: destination } = await axios.get<DestinationResponse>(
      `${urls.submissionApiUrl}/v2/destinations/${destinationId}`,
    );

    const { data: publicJwk } = await axios.get<JWK>(
      `${urls.submissionApiUrl}/v2/destinations/${destinationId}/keys/${destination.encryptionKid}`,
    );

    const encryptedData = await encryptData(data, publicJwk, dataSchema.mimeType);
    const encryptedMetadata = await encryptData(JSON.stringify(metadata), publicJwk);

    const { data: result } = await axios.put<SubmitDataResponse>(
      `${urls.submissionApiUrl}/v2/submissions/${submission.submissionId}`,
      { encryptedData, encryptedMetadata },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    return result;
  }

  async function getSubmissionEvents(
    submissionId: string,
    destinationId: string,
  ): Promise<SubmissionEventsResponse> {
    const accessToken = await authenticate();

    const { data: events } = await axios.get<CaseEventsResponse>(
      `${urls.submissionApiUrl}/v2/submissions/${submissionId}/events`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    const { data: wellKnownJWKs } = await axios.get<{ keys: JWK[] }>(
      `${urls.destinationApiUrl}//.well-known/jwks.json`,
    );

    const { data: destinationKeys } = await axios.get<DestinationKeysResponse>(
      `${urls.destinationApiUrl}/v2/destinations/${destinationId}/keys`,
    );

    const eventLog = await Promise.all(
      events.eventLog.map((entry) => {
        const header = decodeProtectedHeader(entry);
        const jwkKeys = [...wellKnownJWKs.keys, ...destinationKeys.keys];
        const key = jwkKeys.find((jwk) => jwk.kid === header.kid);
        if (!key) return Promise.resolve(null);
        return verifyEventToken(entry, key);
      }),
    );

    return { ...events, eventLog };
  }

  return { submitData, getSubmissionEvents };
}
