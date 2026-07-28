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

function mockSendMessageFetch() {
  const fetchMock = vi.mocked(fetch);
  fetchMock
    .mockResolvedValueOnce(new Response(TOKEN_RESPONSE, { status: 200 }))
    .mockResolvedValueOnce(new Response(JSON.stringify({ metadata: {} }), { status: 200 }));
  return fetchMock;
}

function mockGetTransportReportFetch() {
  const fetchMock = vi.mocked(fetch);
  fetchMock
    .mockResolvedValueOnce(new Response(TOKEN_RESPONSE, { status: 200 }))
    .mockResolvedValueOnce(
      new Response(JSON.stringify({ identifiers: {}, tracks: [] }), { status: 200 }),
    );
  return fetchMock;
}

describe("getOsciClient", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  describe("sendMessage", () => {
    it("passes a client-certificate dispatcher when the certificate secrets are set", async () => {
      vi.stubEnv("AKDB_BASE_URL", "https://apk.akdb.de/okkommozg");
      vi.stubEnv("AKDB_CERTIFICATE_BASE64", Buffer.from("certificate").toString("base64"));
      vi.stubEnv("AKDB_CERTIFICATE_PASSPHRASE", "passphrase");
      const fetchMock = mockSendMessageFetch();

      await getOsciClient().sendMessage({ targetId: "MELDID:09000099", message: "<xml/>" });

      const [tokenUrl, tokenOptions] = fetchMock.mock.calls[0]!;
      expect(tokenUrl).toBe("https://apk.akdb.de/okkommozg/restapi/v3.0/messages/token");
      expect(tokenOptions?.dispatcher).toBeInstanceOf(Agent);

      const [sendUrl, sendOptions] = fetchMock.mock.calls[1]!;

      expect(sendUrl).toBe(
        "https://apk.akdb.de/okkommozg/restapi/v3.0/messages/zko/json/multipart",
      );
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
      const fetchMock = mockSendMessageFetch();

      await getOsciClient().sendMessage({ targetId: "MELDID:09000099", message: "<xml/>" });

      const [sendUrl, sendOptions] = fetchMock.mock.calls[1]!;

      expect(sendUrl).toBe(
        "https://soaptest.akdb.de/okkommozg/restapi/v3.0/messages/zko/json/multipart",
      );
      expect(sendOptions?.dispatcher).toBeUndefined();
    });
  });

  describe("sendXoevMessage", () => {
    it("posts the XML as the raw request body, without metadata", async () => {
      vi.stubEnv("AKDB_BASE_URL", "https://soaptest.akdb.de/okkommozg");
      vi.stubEnv("AKDB_CERTIFICATE_BASE64", "");
      vi.stubEnv("AKDB_CERTIFICATE_PASSPHRASE", "");
      const fetchMock = vi.mocked(fetch);
      fetchMock
        .mockResolvedValueOnce(new Response(TOKEN_RESPONSE, { status: 200 }))
        .mockResolvedValueOnce(new Response(null, { status: 204 }));

      await getOsciClient().sendXoevMessage("<xml/>");

      const [sendUrl, sendOptions] = fetchMock.mock.calls[1]!;

      expect(sendUrl).toBe("https://soaptest.akdb.de/okkommozg/restapi/v3.0/messages/xoev");
      expect(sendOptions?.headers).toEqual({
        Authorization: "Bearer token",
        "Content-Type": "application/xml; charset=UTF-8",
      });
      expect((sendOptions!.body as Buffer).toString("utf8")).toBe("<xml/>");
    });
  });

  describe("getTransportReport", () => {
    it("passes a client-certificate dispatcher when the certificate secrets are set", async () => {
      vi.stubEnv("AKDB_BASE_URL", "https://apk.akdb.de/okkommozg");
      vi.stubEnv("AKDB_CERTIFICATE_BASE64", Buffer.from("certificate").toString("base64"));
      vi.stubEnv("AKDB_CERTIFICATE_PASSPHRASE", "passphrase");
      const fetchMock = mockGetTransportReportFetch();

      await getOsciClient().getTransportReport({
        messageId: "vps_by_178357726143931b13e14-2c78-4aa6-ba2c-0d911ec02d82",
        authorityKey: "MELDID:09000099",
      });

      const [, reportOptions] = fetchMock.mock.calls[1]!;

      expect(reportOptions?.dispatcher).toBeInstanceOf(Agent);
    });

    it("requests the transport report for the given messageId and authorityKey", async () => {
      vi.stubEnv("AKDB_BASE_URL", "https://soaptest.akdb.de/okkommozg");
      vi.stubEnv("AKDB_CERTIFICATE_BASE64", "");
      vi.stubEnv("AKDB_CERTIFICATE_PASSPHRASE", "");
      const fetchMock = mockGetTransportReportFetch();

      await getOsciClient().getTransportReport({
        messageId: "vps_by_178357726143931b13e14-2c78-4aa6-ba2c-0d911ec02d82",
        authorityKey: "MELDID:09000099",
      });

      const [reportUrl, reportOptions] = fetchMock.mock.calls[1]!;

      expect(reportUrl).toBe(
        "https://soaptest.akdb.de/okkommozg/restapi/v3.0/messages/transport-report/osci",
      );
      expect(JSON.parse(reportOptions?.body as string)).toEqual({
        messageID: "vps_by_178357726143931b13e14-2c78-4aa6-ba2c-0d911ec02d82",
        serviceID:
          "http://www.xgewerbeordnung.de/spezifikation/xga/1.6/xgewo16gewerbemeldung-ext.wsdl",
        authorityKey: "MELDID:09000099",
      });
    });

    it("throws when the transport report request fails", async () => {
      vi.stubEnv("AKDB_BASE_URL", "https://soaptest.akdb.de/okkommozg");
      vi.stubEnv("AKDB_CERTIFICATE_BASE64", "");
      vi.stubEnv("AKDB_CERTIFICATE_PASSPHRASE", "");
      vi.mocked(fetch)
        .mockResolvedValueOnce(new Response(TOKEN_RESPONSE, { status: 200 }))
        .mockResolvedValueOnce(
          new Response("error", { status: 500, statusText: "Internal Server Error" }),
        );

      await expect(
        getOsciClient().getTransportReport({
          messageId: "vps_by_178357726143931b13e14-2c78-4aa6-ba2c-0d911ec02d82",
          authorityKey: "MELDID:09000099",
        }),
      ).rejects.toThrow();
    });
  });
});
