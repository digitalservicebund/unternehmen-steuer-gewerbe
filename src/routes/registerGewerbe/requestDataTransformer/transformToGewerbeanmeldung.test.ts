import { describe, it, expect } from "vitest";
import { transformToGewerbeanmeldung } from "./transformToGewerbeanmeldung";
import { type RegisterGewerbeRequest } from "../registerGewerbeInterfaces";
import { registerGewerbeCompleteRequest } from "../testHelpers";

const testContext = { ags: "03046001", destinationId: "00000000-0000-0000-0000-000000000002" };

describe("transformToGewerbeanmeldung", () => {
  it("maps default values, applies the geschlecht fallback if the geschlecht is not given and drops optional fields", () => {
    const request: RegisterGewerbeRequest = {
      ...registerGewerbeCompleteRequest,
      persönlicheDaten: {
        ...registerGewerbeCompleteRequest.persönlicheDaten,
        geburtsname: undefined,
        geschlecht: undefined,
        geburtsort: undefined,
        geburtsland: undefined,
      },
      unternehmensDaten: {
        ...registerGewerbeCompleteRequest.unternehmensDaten,
        adresseAbweichend: undefined,
      },
    };
    const result = transformToGewerbeanmeldung(request, testContext);
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
        ...registerGewerbeCompleteRequest,
        unternehmensDaten: {
          ...registerGewerbeCompleteRequest.unternehmensDaten,
          adresseAbweichend: {
            strasseUndHausnummer: "Betriebsweg 42a",
            postleitzahl: "23936",
            ort: "Testorf-Steinfort",
          },
        },
      },
      testContext,
    );

    expect(result.gewerbebetrieb!.betriebsstaette!.anschrift).toEqual({
      strasse: "Betriebsweg",
      hausnummerVon: "42a",
      postleitzahl: "23936",
      ort: "Testorf-Steinfort",
    });
  });

  it("uses context.ags as gemeindeSchluessel", () => {
    const result = transformToGewerbeanmeldung(registerGewerbeCompleteRequest, testContext);

    expect(result.gemeindeSchluessel).toBe(testContext.ags);
  });
});
