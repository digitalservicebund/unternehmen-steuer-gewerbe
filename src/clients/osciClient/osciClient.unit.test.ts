import { afterEach, describe, expect, it, vi } from "vitest";
import { Agent, fetch, Response } from "undici";
import { getOsciClient } from "./osciClient";

// mock only fetch; the client builds a real Agent from the certificate secrets
vi.mock("undici", async (importOriginal) => {
  const actual = await importOriginal<typeof import("undici")>();
  return { ...actual, fetch: vi.fn() };
});

const TOKEN_RESPONSE = JSON.stringify({
  access_token: "token",
  token_type: "Bearer",
  expires_in: 300,
});
const SEND_RESPONSE = JSON.stringify({ metadata: {} });

function mockFetch() {
  const fetchMock = vi.mocked(fetch);
  fetchMock
    .mockResolvedValueOnce(new Response(TOKEN_RESPONSE, { status: 200 }))
    .mockResolvedValueOnce(new Response(SEND_RESPONSE, { status: 200 }));
  return fetchMock;
}

describe("getOsciClient", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it("passes a client-certificate dispatcher when the certificate secrets are set", async () => {
    vi.stubEnv("AKDB_BASE_URL", "https://apk.akdb.de/okkommozg");
    vi.stubEnv("AKDB_CERTIFICATE_BASE64", Buffer.from("certificate").toString("base64"));
    vi.stubEnv("AKDB_CERTIFICATE_KEY", "passphrase");
    const fetchMock = mockFetch();

    await getOsciClient().sendMessage({ targetId: "MELDID:09000099", message: "<xml/>" });

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "https://apk.akdb.de/okkommozg/restapi/v3.0/messages/token",
      expect.objectContaining({ dispatcher: expect.any(Agent) }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://apk.akdb.de/okkommozg/restapi/v3.0/messages/zko/json/multipart",
      expect.objectContaining({ dispatcher: expect.any(Agent) }),
    );
  });

  it("sends without a dispatcher when the certificate secrets are not set", async () => {
    vi.stubEnv("AKDB_BASE_URL", "https://soaptest.akdb.de/okkommozg");
    vi.stubEnv("AKDB_CERTIFICATE_BASE64", "");
    vi.stubEnv("AKDB_CERTIFICATE_KEY", "");
    const fetchMock = mockFetch();

    await getOsciClient().sendMessage({ targetId: "MELDID:09000099", message: "<xml/>" });

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://soaptest.akdb.de/okkommozg/restapi/v3.0/messages/zko/json/multipart",
      expect.objectContaining({ dispatcher: undefined }),
    );
  });
});
