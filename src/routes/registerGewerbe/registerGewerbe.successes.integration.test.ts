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

const { mockSubmitData, mockSendMessage, mockGetGewerbeRoutingInfo } = vi.hoisted(() => ({
  mockSubmitData: vi.fn().mockResolvedValue({ submissionId: "mock-submission-id" }),
  mockSendMessage: vi.fn().mockResolvedValue({
    metadata: { source: { sourceMessageId: "mock-osci-message-id" } },
  }),
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

vi.mock("../../clients/osciClient/osciClient", () => ({
  getOsciClient: () => ({ sendMessage: mockSendMessage }),
}));

vi.mock("./getGewerbeRoutingInfo", () => ({
  getGewerbeRoutingInfo: mockGetGewerbeRoutingInfo,
}));

import app from "../../app";

import { sendFsE as mockSendFsE } from "@digitalservicebund/unternehmen-steuer-gewerbe-privat";
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
      ags: "03046001",
      ars: "084210000000",
      gewerbeamt: {
        name: "Stadt Fulda",
        adresse: { strasse: "Schlossstraße", hausnummer: "1", postleitzahl: "36037", ort: "Fulda" },
        telefon: "0661 102-0",
        onlineServices: [],
      },
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
    const elsterServerResponse =
      '<?xml version="1.0" encoding="UTF-8"?><Elster xmlns="http://www.elster.de/elsterxml/schema/v11"><TransferHeader version="11"><Verfahren>ElsterFSE</Verfahren><DatenArt>EUn</DatenArt><Vorgang>send-Auth</Vorgang><TransferTicket>eh23053phmwjw2411dsn98z8picgyoue</TransferTicket><Testmerker>700000004</Testmerker><Empfaenger id="L"><Ziel>BY</Ziel></Empfaenger><HerstellerID>49420</HerstellerID><EingangsDatum>20260818093231</EingangsDatum><RC><Rueckgabe><Code>0</Code><Text>Daten wurden erfolgreich angenommen.</Text></Rueckgabe><Stack><Code></Code><Text></Text></Stack></RC><VersionClient>ERiC Beispiele</VersionClient></TransferHeader><DatenTeil></DatenTeil></Elster>';

    it("returns the TransferTicket from the ELSTER server response as submissionId", async () => {
      vi.mocked(mockSendFsE).mockReturnValueOnce({
        success: true,
        serverResponse: elsterServerResponse,
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
