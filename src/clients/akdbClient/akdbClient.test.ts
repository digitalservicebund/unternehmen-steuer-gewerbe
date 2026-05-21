import { describe, it, expect, vi, beforeEach } from "vitest";
import { AkdbClient } from "./akdbClient";

const BASE_URL = "https://soaptest.akdb.de/okkomm";
const ACCESS_TOKEN = "test-access-token";

const defaultConfig = {
  baseUrl: BASE_URL,
  username: "test-user",
  password: "test-password",
};

const tokenResponse = {
  access_token: ACCESS_TOKEN,
  token_type: "Bearer",
  expires_in: 3600,
};

const errorResponse = {
  error: "invalid_request",
  error_description: "Unknown sender",
};

const okXml = `<?xml version="1.0" encoding="UTF-8"?>
<xga:alg.gewerbemeldung.0300 xmlns:xga="http://www.xgewerbeordnung.de/spezifikation/xga/1.6">
</xga:alg.gewerbemeldung.0300>`;

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

let mockFetch: ReturnType<typeof vi.fn>;
let client: AkdbClient;

describe("AkdbClient", () => {
  beforeEach(() => {
    mockFetch = vi.fn();
    client = new AkdbClient({ ...defaultConfig, fetch: mockFetch as typeof globalThis.fetch });
  });

  describe("fetchToken", () => {
    it("requests a token with client credentials and returns the token response", async () => {
      mockFetch.mockResolvedValueOnce(jsonResponse(tokenResponse));

      const result = await client.fetchToken();

      expect(result).toEqual(tokenResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        `${BASE_URL}/restapi/v3.0/messages/token`,
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `grant_type=client_credentials&client_id=${defaultConfig.username}&client_secret=${defaultConfig.password}`,
        }),
      );
    });

    it("throws when the token endpoint returns an error", async () => {
      mockFetch.mockResolvedValueOnce(new Response("Unauthorized", { status: 401 }));

      await expect(client.fetchToken()).rejects.toThrow(
        `POST ${BASE_URL}/restapi/v3.0/messages/token: Unauthorized`,
      );
    });
  });

  describe("sendXoevMessage (ok)", () => {
    it("sends an XML message and resolves on empty 200 response", async () => {
      mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }));

      await expect(client.sendXoevMessage(okXml, ACCESS_TOKEN)).resolves.toBeUndefined();

      expect(mockFetch).toHaveBeenCalledWith(
        `${BASE_URL}/restapi/v3.0/messages/xoev`,
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/xml",
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
          body: okXml,
        }),
      );
    });
  });

  describe("sendXoevMessage (nok)", () => {
    it("throws with the error body when the server rejects the message", async () => {
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(errorResponse), { status: 400 }));

      await expect(client.sendXoevMessage(okXml, ACCESS_TOKEN)).rejects.toThrow(
        `POST ${BASE_URL}/restapi/v3.0/messages/xoev:`,
      );
    });
  });
});
