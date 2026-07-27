import { describe, it, expect, vi, beforeAll } from "vitest";
import { z } from "@hono/zod-openapi";

const { mockGetGewerbeRoutingInfo } = vi.hoisted(() => ({
  mockGetGewerbeRoutingInfo: vi.fn().mockResolvedValue({
    ags: "09463000",
    ars: "094630000000",
    gewerbeamt: {
      name: "Stadt Coburg",
      adresse: { strasse: "Markt", hausnummer: "1", postleitzahl: "96450", ort: "Coburg" },
      onlineServices: [],
    },
    fitConnectDestinationInformation: null,
  }),
}));

// Routing is mocked so the submission takes the OSCI branch, independently of what the routing
// service answers and of a configured FIT_CONNECT_DESTINATION_ID. Everything after that -
// transform, XML validation, PDF receipt and the OSCI send itself - runs for real.
vi.mock("./getGewerbeRoutingInfo", () => ({
  getGewerbeRoutingInfo: mockGetGewerbeRoutingInfo,
}));

// spy-mock so the metadata can be redirected to the registered AKDB test authority
vi.mock("../../clients/osciClient/metadata", { spy: true });

import app from "../../app";
import { createMetadata } from "../../clients/osciClient/metadata";
import { registerGewerbeSampleRequestAllFieldsFilled } from "./testHelpers";
import { RegisterGewerbeResponseSchema } from "./registerGewerbeInterfaces";
import { HttpStatusCode } from "../../helpers/httpStatusCodes";

// Contract test against the real AKDB OKKOMM test API (soaptest.akdb.de), which only accepts
// this registered test authority as target. Requires AKDB_BASE_URL / AKDB_USERNAME / AKDB_PASSWORD.
const AKDB_TEST_AUTHORITY_ID = "MELDID:09000099";

describe("Route /api/v1/register-gewerbe (Gewerbeanmeldung via OSCI)", { timeout: 15_000 }, () => {
  let response: Response;
  let json: z.infer<typeof RegisterGewerbeResponseSchema>;

  beforeAll(async () => {
    const metadata = createMetadata({ targetId: AKDB_TEST_AUTHORITY_ID });
    // TODO: remove this override once our sender id "ds:schnellergruenden" is registered
    metadata.metadata.source.sourceId = "xga:090010030000";
    vi.mocked(createMetadata).mockReturnValueOnce(metadata);

    response = await app.request("/api/v1/register-gewerbe?only=gewerbeanmeldung", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerGewerbeSampleRequestAllFieldsFilled),
    });
    json = await response.json();
  }, 15_000);

  it("returns 200 OK with success=true for the Gewerbeanmeldung", () => {
    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(json.gewerbeanmeldung!.success).toBe(true);
  });

  it("returns the ars and the OSCI message id as submissionId, without a fitConnectDestinationId", () => {
    expect(json.gewerbeanmeldung!.submissionId).toBeTruthy();
    expect(json.gewerbeanmeldung!.ars).toBe("094630000000");
    expect(json.gewerbeanmeldung!.fitConnectDestinationId).toBeUndefined();
  });
});
