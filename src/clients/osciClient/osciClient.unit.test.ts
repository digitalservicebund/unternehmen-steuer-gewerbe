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

describe("getOsciClient.sendMessage", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it("passes a client-certificate dispatcher when the certificate secrets are set", async () => {
    vi.stubEnv("AKDB_BASE_URL", "https://apk.akdb.de/okkommozg");
    vi.stubEnv("AKDB_CERTIFICATE_BASE64", Buffer.from("certificate").toString("base64"));
    vi.stubEnv("AKDB_CERTIFICATE_PASSPHRASE", "passphrase");
    const fetchMock = mockFetch();

    await getOsciClient().sendMessage({ targetId: "MELDID:09000099", message: "<xml/>" });

    const [tokenUrl, tokenOptions] = fetchMock.mock.calls[0]!;
    expect(tokenUrl).toBe("https://apk.akdb.de/okkommozg/restapi/v3.0/messages/token");
    expect(tokenOptions?.dispatcher).toBeInstanceOf(Agent);

    const [sendUrl, sendOptions] = fetchMock.mock.calls[1]!;
    expect(sendUrl).toBe("https://apk.akdb.de/okkommozg/restapi/v3.0/messages/zko/json/multipart");
    expect(sendOptions?.dispatcher).toBeInstanceOf(Agent);
  });

  it("throws when the token request fails", async () => {
    vi.stubEnv("AKDB_BASE_URL", "https://soaptest.akdb.de/okkommozg");
    vi.stubEnv("AKDB_CERTIFICATE_BASE64", "");
    vi.stubEnv("AKDB_CERTIFICATE_PASSPHRASE", "");
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response("error", { status: 401, statusText: "Unauthorized" }),
    );

    await expect(
      getOsciClient().sendMessage({ targetId: "MELDID:09000099", message: "<xml/>" }),
    ).rejects.toThrow();
  });

  it("sends without a custom dispatcher when the certificate secrets are not set", async () => {
    vi.stubEnv("AKDB_BASE_URL", "https://soaptest.akdb.de/okkommozg");
    vi.stubEnv("AKDB_CERTIFICATE_BASE64", "");
    vi.stubEnv("AKDB_CERTIFICATE_PASSPHRASE", "");
    const fetchMock = mockFetch();

    await getOsciClient().sendMessage({ targetId: "MELDID:09000099", message: "<xml/>" });

    const [sendUrl, sendOptions] = fetchMock.mock.calls[1]!;
    expect(sendUrl).toBe(
      "https://soaptest.akdb.de/okkommozg/restapi/v3.0/messages/zko/json/multipart",
    );
    expect(sendOptions?.dispatcher).toBeUndefined();
  });
});
