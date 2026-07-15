import { decodeProtectedHeader, type JWK, type JWTPayload } from "jose";
import { encryptData, verifyEventToken } from "./crypto";
import { createMetadata, type DataSchema } from "./metadata";
import { fetchJson } from "../../helpers/fetchJson";
import { getEnvironmentVariable, getSecret } from "../../secretsAndEnvironmentVariables";

interface FitConnectClientConfig {
  oauthTokenUrl: string;
  submissionApiUrl: string;
  destinationApiUrl: string;
  routingApiUrl: string;
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

interface ContactPerson {
  name: string;
  tel: string;
  fax: string;
  email: string;
}

interface Address {
  street: string;
  houseNumber: string;
  zip: string;
  city: string;
}

interface PostalAddress {
  street: string;
  houseNumber: string;
  additional: string;
  zip: string;
  city: string;
}

interface PostOfficeBox {
  postOfficeBox: string;
  zip: string;
  city: string;
}

interface FurtherInformation {
  /** Textuelle Beschreibung: Textuelle Beschreibung der weiterführenden Informationen (enthält ggf. HTML-Elemente) */
  description: Record<string, string>;
}

interface RequiredDocuments {
  /** Textuelle Beschreibung: Textuelle Beschreibung der weiterführenden Informationen (enthält ggf. HTML-Elemente) */
  description: Record<string, string>;
}

interface LegalBasis {
  /** Textuelle Beschreibung: Textuelle Beschreibung der weiterführenden Informationen (enthält ggf. HTML-Elemente) */
  description: Record<string, string>;
}

interface Deadline {
  /** Textuelle Beschreibung: Textuelle Beschreibung der weiterführenden Informationen (enthält ggf. HTML-Elemente) */
  description: Record<string, string>;
}

interface ProcessingDuration {
  minDuration: number;
  maxDuration: number;
  unit: "year" | "month" | "week" | "day" | "workday" | "hour" | "minute" | "second";
}

interface Route {
  destinationId: string;
  /** Die in XZuFI hinterlegte Signatur der FIT-Connect-Adressierungsinformationen (JWS gemäß RFC 7515) */
  destinationSignature: string;
  /** undocumented */
  destinationParameters?: unknown;
  /** undocumented */
  destinationParametersSignature?: string;
  /** Vollständiger Name der zuständigen Fachbehörde inkl. der vollständigen Hierarchie */
  destinationName?: string;
  /** Kurzbezeichnung der zuständigen Fachbehörde */
  destinationShortName?: string;
  /** URL zum Logo der zuständigen Fachbehörde */
  destinationLogo?: string;
  /** Die für die jeweilige Leistung zuständige Kontaktpersonen der zuständigen Fachbehörde */
  contactPersons?: ContactPerson;
  /** Hausanschrift der zuständigen Fachbehörde: Hausanschrift gemäß Codeliste Anschrifttyp, siehe https://www.xrepository.de/details/urn:xoev-de:fim:codeliste:xzufi.anschrifttyp */
  address?: Address;
  /** Postalische Adresse der zuständigen Fachbehörde: Postanschrift gemäß Codeliste Anschrifttyp, siehe https://www.xrepository.de/details/urn:xoev-de:fim:codeliste:xzufi.anschrifttyp */
  postalAddress?: PostalAddress;
  /** Postfachadresse der zuständigen Fachbehörde: Postfach gemäß Codeliste Anschrifttyp, siehe https://www.xrepository.de/details/urn:xoev-de:fim:codeliste:xzufi.anschrifttyp  */
  postOfficeBox?: PostOfficeBox;
  /** URL zur regionalen Datenschutzerklärung auf Ebene der zuständigen Fachbehörde */
  privacyPolicyUrl?: string;
  /** URL zum regionalen Impressum auf Ebene der zuständigen Fachbehörde */
  imprintUrl?: string;
  /** URL zum regionalen Barrierefreiheitserklärung auf Ebene der zuständigen Fachbehörde */
  accessibilityUrl?: string;
  /** URL zum Kontaktformular der zuständigen Fachbehörde */
  contactFormUrl?: string;
  /** Weiterführende Informationen zur Leistung */
  furtherInformation?: FurtherInformation;
  /** Erforderliche Unterlagen für die Leistung */
  requiredDocuments?: RequiredDocuments;
  /** Rechtsgrundlagen der Leitung */
  legalBasis?: LegalBasis;
  /** Hinweis zu Fristen der Leistung  */
  deadline?: Deadline;
  /** Bearbeitungsdauer der Leistung */
  processingDuration?: ProcessingDuration;
  /** Dienstspezifische Parameter: Liste an nicht-standardisierten, dienstspezifischen Parametern */
  customParameters?: unknown;
  /** Quellsystem der Routeninformation (z.B. PVOG, Infodienste, Zustellddienst) */
  origin: string;
}

interface RoutingApiResponse {
  count: number;
  offset: number;
  totalCount: number;
  routes: Route[];
}

export function getFitConnectClient() {
  const config: FitConnectClientConfig = {
    oauthTokenUrl: getEnvironmentVariable("FIT_CONNECT_OAUTH_TOKEN_URL"),
    submissionApiUrl: getEnvironmentVariable("FIT_CONNECT_SUBMISSION_API_URL"),
    destinationApiUrl: getEnvironmentVariable("FIT_CONNECT_DESTINATION_API_URL"),
    routingApiUrl: getEnvironmentVariable("FIT_CONNECT_ROUTING_API_URL"),
    clientId: getEnvironmentVariable("FIT_CONNECT_CLIENT_ID"),
    clientSecret: getSecret("FIT_CONNECT_CLIENT_SECRET"),
    privateKey: getSecret("FIT_CONNECT_PRIVATE_KEY_DECRYPTION_JWK")
      ? JSON.parse(getSecret("FIT_CONNECT_PRIVATE_KEY_DECRYPTION_JWK"))
      : undefined,
  };

  async function authenticate(): Promise<string> {
    const data = await fetchJson<TokenResponse>(config.oauthTokenUrl, {
      method: "POST",
      body: `grant_type=client_credentials&client_id=${config.clientId}&client_secret=${config.clientSecret}`,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return data.access_token;
  }

  async function submitData({
    destinationId,
    publicService,
    data,
    dataSchema,
  }: SubmitDataOptions): Promise<SubmitDataResponse> {
    const accessToken = await authenticate();

    const metadata = createMetadata(dataSchema, data);

    const destination = await fetchJson<DestinationResponse>(
      `${config.submissionApiUrl}/v2/destinations/${destinationId}`,
    );

    const publicJwk = await fetchJson<JWK>(
      `${config.submissionApiUrl}/v2/destinations/${destinationId}/keys/${destination.encryptionKid}`,
    );

    const submission = await fetchJson<CreateSubmissionResponse>(
      `${config.submissionApiUrl}/v2/submissions`,
      {
        method: "POST",
        body: { announcedAttachments: [], destinationId, publicService },
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    const encryptedData = await encryptData(data, publicJwk, dataSchema.mimeType);
    const encryptedMetadata = await encryptData(JSON.stringify(metadata), publicJwk);

    const result = await fetchJson<SubmitDataResponse>(
      `${config.submissionApiUrl}/v2/submissions/${submission.submissionId}`,
      {
        method: "PUT",
        body: { encryptedData, encryptedMetadata },
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    return result;
  }

  async function getSubmissionEvents(
    submissionId: string,
    destinationId: string,
  ): Promise<SubmissionEventsResponse> {
    const accessToken = await authenticate();

    const events = await fetchJson<CaseEventsResponse>(
      `${config.submissionApiUrl}/v2/submissions/${submissionId}/events`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    const wellKnownJWKs = await fetchJson<{ keys: JWK[] }>(
      `${config.destinationApiUrl}//.well-known/jwks.json`,
    );

    const destinationKeys = await fetchJson<DestinationKeysResponse>(
      `${config.destinationApiUrl}/v2/destinations/${destinationId}/keys`,
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

  async function getRoutes(leikaKey: string, ags: string): Promise<RoutingApiResponse> {
    const url = new URL(`${config.routingApiUrl}/v1/routes`);
    url.searchParams.set("leikaKey", leikaKey);
    url.searchParams.set("ags", ags);
    const routingApiResponse = await fetchJson<RoutingApiResponse>(url.toString(), {
      headers: { Accept: "application/json" },
    });
    return routingApiResponse;
  }

  return { submitData, getSubmissionEvents, getRoutes };
}
