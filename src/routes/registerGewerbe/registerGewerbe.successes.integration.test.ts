import { describe, it, expect, vi, afterEach } from "vitest";
import { XMLParser } from "fast-xml-parser";

// Note 1: mocking is "global" on file level, therefore we have separate files for tests that mock and those that don't.
// Note 2: We need to mock here, such that the private library correctly initializes their internal libraries before the tests are run.
vi.mock("@digitalservicebund/unternehmen-steuer-gewerbe-privat", () => ({
  validateFsE: vi.fn().mockReturnValue({ valid: true }),
  createElsterFsEEUnXml: vi.fn().mockReturnValue("<xml/>"),
  sendFsE: vi.fn().mockReturnValue({ success: true }),
  getFinanzamtId: vi.fn().mockReturnValue(["mock-finanzamt-id"]),
  getFinanzamtDetailsById: vi.fn().mockReturnValue({
    name: "Finanzamt Mock",
    hausanschrift: {
      strasse: "Mockstraße",
      hausnummer: "1",
      postleitzahl: "00000",
      ort: "Mockstadt",
    },
    telefonnummer: "0000 000-0",
  }),
}));

const { mockSubmitData, mockGetGewerbeRoutingInfo } = vi.hoisted(() => ({
  mockSubmitData: vi.fn().mockResolvedValue({ submissionId: "mock-submission-id" }),
  mockGetGewerbeRoutingInfo: vi.fn().mockResolvedValue({
    ags: "03046001",
    ars: "084210000000",
    gewerbeamt: {
      name: "Stadt Fulda",
      adresse: { strasse: "Schlossstraße", hausnummer: "1", postleitzahl: "36037", ort: "Fulda" },
      telefon: "0661 102-0",
      onlineServices: [],
    },
    fitConnectDestinationInformation: { destinationId: "mock-destination-id" },
  }),
}));

vi.mock("../../clients/fitConnectClient/fitConnectClient", () => ({
  getFitConnectClient: () => ({ submitData: mockSubmitData }),
}));

vi.mock("./getGewerbeRoutingInfo", () => ({
  getGewerbeRoutingInfo: mockGetGewerbeRoutingInfo,
}));

import app from "../../app";

import { registerGewerbeSampleRequestAllFieldsFilled } from "./testHelpers";
import { HttpStatusCode } from "../../helpers/httpStatusCodes";

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });

function postRegisterGewerbe(data = registerGewerbeSampleRequestAllFieldsFilled, queryString = "") {
  return app.request(`/api/v1/register-gewerbe${queryString}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

describe("Route /api/v1/register-gewerbe (with ERiC mocked)", () => {
  afterEach(() => vi.restoreAllMocks());

  describe("Gewerbeamt officeDetails", () => {
    it("returns the responsible Gewerbeamt address, joining strasse and hausnummer", async () => {
      const response = await postRegisterGewerbe();
      const json = await response.json();

      expect(response.status).toEqual(HttpStatusCode.Ok);
      expect(json.gewerbeanmeldung.officeDetails).toEqual({
        name: "Stadt Fulda",
        strasseUndHausnummer: "Schlossstraße 1",
        postleitzahl: "36037",
        ort: "Fulda",
        telefon: "0661 102-0",
        onlineServices: [],
      });
    });

    it("omits optional fields when the Gewerbeamt has no address or phone number", async () => {
      mockGetGewerbeRoutingInfo.mockResolvedValueOnce({
        ags: "03046001",
        ars: "084210000000",
        gewerbeamt: { name: "Gewerbeamt Minimal", onlineServices: [] },
        fitConnectDestinationInformation: { destinationId: "mock-destination-id" },
      });

      const response = await postRegisterGewerbe();
      const json = await response.json();

      expect(response.status).toEqual(HttpStatusCode.Ok);
      expect(json.gewerbeanmeldung.officeDetails).toEqual({
        name: "Gewerbeamt Minimal",
        onlineServices: [],
      });
    });

    it("returns only the street when the Gewerbeamt address has no house number", async () => {
      mockGetGewerbeRoutingInfo.mockResolvedValueOnce({
        ags: "03046001",
        ars: "084210000000",
        gewerbeamt: {
          name: "Stadt Fulda",
          adresse: { strasse: "Schlossstraße", postleitzahl: "36037", ort: "Fulda" },
          onlineServices: [],
        },
        fitConnectDestinationInformation: { destinationId: "mock-destination-id" },
      });

      const response = await postRegisterGewerbe();
      const json = await response.json();

      expect(response.status).toEqual(HttpStatusCode.Ok);
      expect(json.gewerbeanmeldung.officeDetails!.strasseUndHausnummer).toEqual("Schlossstraße");
    });
  });

  describe("Autorenkennung in the submitted xGewerbeanmeldung", () => {
    it("uses 'ds:schnellergruenden' for the nachrichtenkopf autor but NOT for the xga:autor (Behörde)", async () => {
      mockSubmitData.mockClear();

      const response = await postRegisterGewerbe();
      expect(response.status).toEqual(HttpStatusCode.Ok);

      const submittedXml = mockSubmitData.mock.calls[0]![0].data;
      const xGewO = parser.parse(submittedXml)["xga:ext.gewerbemeldung.0400"];

      expect(xGewO["bn-g2g:nachrichtenkopf.g2g"]["bn-g2g:autor"]["bn-beh:kennung"]).toBe(
        "ds:schnellergruenden",
      );

      const behoerdeKennung = xGewO["xga:satz"]["xga:anmeldung"]["xga:autor"]["bn-beh:kennung"];
      expect(behoerdeKennung).not.toBe("ds:schnellergruenden");
      expect(behoerdeKennung).toMatch(/^MELDID:/);
    });
  });

  describe("gemeindeschluesselErgaenzung for Hamburg", () => {
    it("includes the Hamburg Stadtbezirk gemeindeschluesselErgaenzung derived from the betriebsstaette PLZ", async () => {
      mockSubmitData.mockClear();
      mockGetGewerbeRoutingInfo.mockResolvedValueOnce({
        ags: "02000000",
        ars: "020000000000",
        gewerbeamt: {
          name: "Stadt Hamburg",
          adresse: {
            strasse: "Rathausmarkt",
            hausnummer: "1",
            postleitzahl: "20095",
            ort: "Hamburg",
          },
          onlineServices: [],
        },
      });

      const response = await postRegisterGewerbe({
        ...registerGewerbeSampleRequestAllFieldsFilled,
        unternehmensDaten: {
          ...registerGewerbeSampleRequestAllFieldsFilled.unternehmensDaten,
          adresseAbweichend: {
            strasseUndHausnummer: "Reeperbahn 1",
            postleitzahl: "22767",
            ort: "Hamburg",
          },
        },
      });

      expect(response.status).toEqual(HttpStatusCode.Ok);

      const submittedXml = mockSubmitData.mock.calls[0]![0].data;
      expect(submittedXml).toContain(
        '<xga:gemeindeschluesselErgaenzung listVersionID="1"><code>02100000</code></xga:gemeindeschluesselErgaenzung>',
      );
    });
  });

  describe("routing context for the events endpoint", () => {
    it("returns the ars 084210000000 and the FIT-Connect destinationId fa63ede0-0ef6-4ca6-abd2-6bd16729ddc1 the submission was sent to", async () => {
      const response = await postRegisterGewerbe();
      const json = await response.json();

      expect(response.status).toEqual(HttpStatusCode.Ok);
      expect(json.gewerbeanmeldung.ars).toBe("084210000000");
      expect(json.gewerbeanmeldung.fitConnectDestinationId).toBe(
        "fa63ede0-0ef6-4ca6-abd2-6bd16729ddc1",
      );
    });
  });
});
