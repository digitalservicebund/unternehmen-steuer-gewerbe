// undici instead of the global fetch: client certificate authentication needs an undici Agent,
// and an Agent from the npm package only works with the fetch and FormData from the undici package,
// not with the versions bundled into node (see https://github.com/nodejs/undici/discussions/4200)
import { Agent, fetch, FormData } from "undici";
import { createMetadata } from "./metadata";
import { getEnvironmentVariable, getSecret } from "../../secretsAndEnvironmentVariables";

interface OsciClientConfig {
  baseUrl: string;
  username: string;
  password: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SendMessageOptions {
  targetId: string;
  message: string;
}

interface SendMessageResponseTarget {
  targetProcessType: string;
  targetActionType: string;
  targetOperation: string;
  targetId: string;
}

interface SendMessageResponseSource {
  sourceProcessType: string;
  sourceId: string;
  sourceTimestamp: string;
  sourceMessageId: string;
}

interface SendMessageResponseTransport {
  transportRequestId: string;
}

interface SendMessageResponseReply {
  replyType: string;
  replyApplication: string;
  replyTimestamp: string;
}

interface SendMessageResponse {
  $schema: string;
  metadata: {
    target: SendMessageResponseTarget;
    source: SendMessageResponseSource;
    transport: SendMessageResponseTransport;
    reply: SendMessageResponseReply;
  };
}

const TOKEN_TIMEOUT_MS = 5_000;
const SEND_TIMEOUT_MS = 30_000;

// AKDB production requires us to authenticate with a client-certificate,
// see https://undici.nodejs.org/best-practices/client-certificate
// (the example there uses a Client, but an Agent accepts the same connect options:
// "Agent inherits all <PoolOptions> (and therefore all <ClientOptions>)",
// see https://undici.nodejs.org/api/Agent#agent)
function createClientCertificateDispatcherIfSecretsAreSet(): Agent | undefined {
  // the base64 encoded .p12 certificate file and the password it is encrypted with,
  // only set in environments where AKDB requires the certificate (production)
  const certificateBase64 = getSecret("AKDB_CERTIFICATE_BASE64");
  const certificatePassphrase = getSecret("AKDB_CERTIFICATE_KEY");

  if (certificateBase64 === "" || certificatePassphrase === "") {
    return undefined;
  }

  // the Agent passes the connect options through to tls.connect(), which reads the
  // certificate and key from pfx and decrypts them with the passphrase,
  // see https://nodejs.org/api/tls.html#tlscreatesecurecontextoptions
  const tls = {
    pfx: Buffer.from(certificateBase64, "base64"),
    passphrase: certificatePassphrase,
  };
  return new Agent({
    connect: tls,
  });
}

export function getOsciClient() {
  const config: OsciClientConfig = {
    baseUrl: getEnvironmentVariable("AKDB_BASE_URL"),
    username: getSecret("AKDB_USERNAME"),
    password: getSecret("AKDB_PASSWORD"),
  };

  // fetch performs a request through the dispatcher passed in its init options
  // ("Default: the global dispatcher", see https://undici.nodejs.org/api/Fetch#fetchinput-init)
  const dispatcher = createClientCertificateDispatcherIfSecretsAreSet();

  async function getAccessToken(): Promise<string> {
    const body = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: config.username,
      client_secret: config.password,
    }).toString();

    const url = `${config.baseUrl}/restapi/v3.0/messages/token`;
    const response = await fetch(url, {
      method: "POST",
      body,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      signal: AbortSignal.timeout(TOKEN_TIMEOUT_MS),
      dispatcher,
    });

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status} ${response.statusText} for ${url}: ${await response.text()}`,
      );
    }

    const data = (await response.json()) as TokenResponse;
    return data.access_token;
  }

  async function sendMessage(options: SendMessageOptions): Promise<SendMessageResponse> {
    const accessToken = await getAccessToken();
    const metadata = createMetadata({ targetId: options.targetId });

    const form = new FormData();
    form.append(
      "metadata",
      new Blob([JSON.stringify(metadata)], { type: "application/json" }),
      "control.json",
    );
    form.append(
      "message",
      new Blob([options.message], { type: "application/xml" }),
      // the message part filename must match the contentReference in the metadata
      metadata.payload.request.message.contentReference.replace("form-data://message/", ""),
    );

    const url = `${config.baseUrl}/restapi/v3.0/messages/zko/json/multipart`;
    const response = await fetch(url, {
      method: "POST",
      // no Content-Type header: fetch derives the multipart boundary from the FormData body
      headers: { Authorization: `Bearer ${accessToken}` },
      body: form,
      signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
      dispatcher,
    });

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status} ${response.statusText} for ${url}: ${await response.text()}`,
      );
    }

    return (await response.json()) as SendMessageResponse;
  }

  return { sendMessage };
}
