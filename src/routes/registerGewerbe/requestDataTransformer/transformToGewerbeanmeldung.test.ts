import { describe, it, expect } from "vitest";
import { transformToGewerbeanmeldung } from "./transformToGewerbeanmeldung";
import { type RegisterGewerbeRequest } from "../registerGewerbeInterfaces";
import { registerGewerbeSampleRequestAllFieldsFilled } from "../testHelpers";

const testRoutingInfo = {
  ags: "03046001",
  ars: "030460014004",
  fitConnectDestinationInformation: { destinationId: "00000000-0000-0000-0000-000000000002" },
};

describe("transformToGewerbeanmeldung", () => {
  it("maps default values, applies the geschlecht fallback if the geschlecht is not given and drops optional fields", () => {
    const request: RegisterGewerbeRequest = {
      ...registerGewerbeSampleRequestAllFieldsFilled,
      persönlicheDaten: {
        ...registerGewerbeSampleRequestAllFieldsFilled.persönlicheDaten,
        geburtsname: undefined,
        geschlecht: undefined,
        geburtsort: undefined,
        geburtsland: undefined,
      },
      unternehmensDaten: {
        ...registerGewerbeSampleRequestAllFieldsFilled.unternehmensDaten,
        adresseAbweichend: undefined,
      },
    };
    const result = transformToGewerbeanmeldung(request, testRoutingInfo);
    const person = result.referenzierteSubjekte!.natuerlichePerson![0]!;

    expect(result.gewerbebetrieb!.istNebenerwerb).toBe(false);
    expect(result.gewerbebetrieb!.betriebArt).toEqual({
      industrie: false,
      handwerk: true,
      handel: false,
      sonstiges: false,
    });
    expect(result.gewerbebetrieb!.betriebsstaette!.anschrift).toEqual({
      strasse: "Musterstraße",
      hausnummerVon: "1",
      postleitzahl: "03046",
      ort: "Cottbus",
    });
    expect(person.geschlecht).toBe("x");
    expect(person.name!.geburtsname).toBeUndefined();
  });

  it("uses adresseAbweichend as betriebsstaette anschrift when provided", () => {
    const result = transformToGewerbeanmeldung(
      {
        ...registerGewerbeSampleRequestAllFieldsFilled,
        unternehmensDaten: {
          ...registerGewerbeSampleRequestAllFieldsFilled.unternehmensDaten,
          adresseAbweichend: {
            strasseUndHausnummer: "Betriebsweg 42a",
            postleitzahl: "23936",
            ort: "Testorf-Steinfort",
          },
        },
      },
      testRoutingInfo,
    );

    expect(result.gewerbebetrieb!.betriebsstaette!.anschrift).toEqual({
      strasse: "Betriebsweg",
      hausnummerVon: "42a",
      postleitzahl: "23936",
      ort: "Testorf-Steinfort",
    });
  });

  it("uses routingInfo.ags as gemeindeSchluessel", () => {
    const result = transformToGewerbeanmeldung(
      registerGewerbeSampleRequestAllFieldsFilled,
      testRoutingInfo,
    );

    expect(result.gemeindeSchluessel).toBe(testRoutingInfo.ags);
  });
});
