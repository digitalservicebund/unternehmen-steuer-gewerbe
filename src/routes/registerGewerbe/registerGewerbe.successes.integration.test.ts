import { describe, it, expect, vi, afterEach } from "vitest";
import { XMLParser } from "fast-xml-parser";

import {
  mockSubmitData,
  mockSendMessage,
  mockGetGewerbeRoutingInfo,
  fuldaRoutingInfoFixture,
  postRegisterGewerbe,
} from "./registerGewerbeIntegrationTestSetup";
import { sendFsE as mockSendFsE } from "@digitalservicebund/unternehmen-steuer-gewerbe-privat";
import {
  elsterServerResponseFixture,
  registerGewerbeSampleRequestAllFieldsFilled,
} from "./testHelpers";
import { HttpStatusCode } from "../../helpers/httpStatusCodes";

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });

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

  describe("Betriebsstätten-Anschrift in the submitted xGewerbeanmeldung", () => {
    it("splits the hausnummer range 1C-1E into hausnummerVon and hausnummerBis", async () => {
      mockSubmitData.mockClear();

      const response = await postRegisterGewerbe({
        ...registerGewerbeSampleRequestAllFieldsFilled,
        unternehmensDaten: {
          ...registerGewerbeSampleRequestAllFieldsFilled.unternehmensDaten,
          adresse: {
            strasse: "Domstraße",
            hausnummer: "1C-1E",
            postleitzahl: "36037",
            ort: "Fulda",
          },
        },
      });

      // a 200 also means the generated XML passed XSD and Schematron validation
      expect(response.status).toEqual(HttpStatusCode.Ok);

      const submittedXml = mockSubmitData.mock.calls[0]![0].data;
      const xGewO = parser.parse(submittedXml)["xga:ext.gewerbemeldung.0400"];
      const anschrift =
        xGewO["xga:satz"]["xga:anmeldung"]["xga:gewerbebetrieb"]["xga:betriebsstaette"][
          "bk:anschrift"
        ]["bk:strassenanschriftInland"];

      expect(anschrift).toEqual({
        "adr:strasse": "Domstraße",
        "bk:hausnummerVon": "1C",
        "bk:hausnummerBis": "1E",
        // the XML parser turns the numeric PLZ into a number
        "adr:postleitzahl": 36037,
        "adr:ort": "Fulda",
      });
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
        fitConnectDestinationInformation: { destinationId: "mock-destination-id" },
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
    it("returns the ars 084210000000 and the FIT-Connect destinationId the submission was sent to", async () => {
      const response = await postRegisterGewerbe();
      const json = await response.json();

      expect(response.status).toEqual(HttpStatusCode.Ok);
      expect(json.gewerbeanmeldung.ars).toBe("084210000000");
      expect(json.gewerbeanmeldung.fitConnectDestinationId).toBe("mock-destination-id");
    });
  });

  describe("OSCI submission when no FIT-Connect destination exists", () => {
    const routingInfoWithoutFitConnect = {
      ...fuldaRoutingInfoFixture,
      fitConnectDestinationInformation: null,
    };

    it("sends the Gewerbeanmeldung XML via OSCI to MELDID:03046001", async () => {
      mockSendMessage.mockClear();
      mockGetGewerbeRoutingInfo.mockResolvedValueOnce(routingInfoWithoutFitConnect);

      const response = await postRegisterGewerbe();
      expect(response.status).toEqual(HttpStatusCode.Ok);

      const [{ targetId, message }] = mockSendMessage.mock.calls[0]!;
      expect(targetId).toBe("MELDID:03046001");
      const xGewO = parser.parse(message)["xga:ext.gewerbemeldung.0400"];
      expect(xGewO["xga:satz"]["xga:anmeldung"]["xga:autor"]["bn-beh:kennung"]).toBe(
        "MELDID:03046001",
      );
    });

    it("returns the OSCI sourceMessageId as submissionId and no fitConnectDestinationId", async () => {
      mockGetGewerbeRoutingInfo.mockResolvedValueOnce(routingInfoWithoutFitConnect);

      const response = await postRegisterGewerbe();
      const json = await response.json();

      expect(response.status).toEqual(HttpStatusCode.Ok);
      expect(json.gewerbeanmeldung.success).toBe(true);
      expect(json.gewerbeanmeldung.submissionId).toBe("mock-osci-message-id");
      expect(json.gewerbeanmeldung.ars).toBe("084210000000");
      expect(json.gewerbeanmeldung.fitConnectDestinationId).toBeUndefined();
    });
  });

  describe("fseÜbermittlung submissionId", () => {
    it("returns the TransferTicket from the ELSTER server response as submissionId", async () => {
      vi.mocked(mockSendFsE).mockReturnValueOnce({
        success: true,
        serverResponse: elsterServerResponseFixture("eh23053phmwjw2411dsn98z8picgyoue"),
      });

      const response = await postRegisterGewerbe();
      const json = await response.json();

      expect(response.status).toEqual(HttpStatusCode.Ok);
      expect(json.fseÜbermittlung.submissionId).toBe("eh23053phmwjw2411dsn98z8picgyoue");
    });

    it("returns no submissionId when sendFsE returns no serverResponse", async () => {
      vi.mocked(mockSendFsE).mockReturnValueOnce({ success: true });

      const response = await postRegisterGewerbe();
      const json = await response.json();

      expect(response.status).toEqual(HttpStatusCode.Ok);
      expect(json.fseÜbermittlung.success).toBe(true);
      expect(json.fseÜbermittlung.submissionId).toBeUndefined();
    });
  });

  describe("gewinnGründungsjahr and gewinnFolgejahr", () => {
    it("accepts negative values (a projected loss)", async () => {
      const response = await postRegisterGewerbe({
        ...registerGewerbeSampleRequestAllFieldsFilled,
        unternehmensDaten: {
          ...registerGewerbeSampleRequestAllFieldsFilled.unternehmensDaten,
          gewinnGründungsjahr: -5000,
          gewinnFolgejahr: -1000,
        },
      });

      expect(response.status).toEqual(HttpStatusCode.Ok);
    });
  });
});
