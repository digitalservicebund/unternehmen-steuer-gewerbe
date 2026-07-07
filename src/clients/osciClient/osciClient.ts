import { type OsciMetadata } from "./metadata";
import { fetchJson } from "../../helpers/fetchJson";
import { getSecret } from "../../secrets";

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
  metadata: OsciMetadata;
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

const SEND_TIMEOUT_MS = 30_000;

export function getOsciClient() {
  const config: OsciClientConfig = {
    baseUrl: getSecret("AKDB_BASE_URL"),
    username: getSecret("AKDB_USERNAME"),
    password: getSecret("AKDB_PASSWORD"),
  };

  async function getAccessToken(): Promise<string> {
    const body = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: config.username,
      client_secret: config.password,
    }).toString();

    const data = await fetchJson<TokenResponse>(`${config.baseUrl}/restapi/v3.0/messages/token`, {
      method: "POST",
      body,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return data.access_token;
  }

  async function sendMessage(options: SendMessageOptions): Promise<SendMessageResponse> {
    const accessToken = await getAccessToken();

    const form = new FormData();
    form.append(
      "metadata",
      new Blob([JSON.stringify(options.metadata)], { type: "application/json" }),
      "control.json",
    );
    form.append(
      "message",
      new Blob([options.message], { type: "application/xml" }),
      // the message part filename must match the contentReference in the metadata
      options.metadata.payload.request.message.contentReference.replace("form-data://message/", ""),
    );

    const url = `${config.baseUrl}/restapi/v3.0/messages/zko/json/multipart`;
    const response = await fetch(url, {
      method: "POST",
      // no Content-Type header: fetch derives the multipart boundary from the FormData body
      headers: { Authorization: `Bearer ${accessToken}` },
      body: form,
      signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
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
