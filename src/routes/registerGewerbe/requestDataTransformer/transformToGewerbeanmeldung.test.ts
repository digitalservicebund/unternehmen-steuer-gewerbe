import { describe, it, expect } from "vitest";
import { transformToGewerbeanmeldung } from "./transformToGewerbeanmeldung";
import { type RegisterGewerbeRequest } from "../registerGewerbeInterfaces";
import { registerGewerbeCompleteRequest } from "../testHelpers";

describe("transformToGewerbeanmeldung", () => {
  it("maps default values, applies the geschlecht fallback if the geschlecht is not given and drops optional fields", async () => {
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
    const result = await transformToGewerbeanmeldung(request);
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
      postleitzahl: "12345",
      ort: "Musterstadt",
    });
    expect(person.geschlecht).toBe("x");
    expect(person.name!.geburtsname).toBeUndefined();
  });

  it("uses adresseAbweichend as betriebsstaette anschrift when provided", async () => {
    const result = await transformToGewerbeanmeldung({
      ...registerGewerbeCompleteRequest,
      unternehmensDaten: {
        ...registerGewerbeCompleteRequest.unternehmensDaten,
        adresseAbweichend: {
          strasseUndHausnummer: "Betriebsweg 42a",
          postleitzahl: "23936",
          ort: "Testorf-Steinfort",
        },
      },
    });

    expect(result.gewerbebetrieb!.betriebsstaette!.anschrift).toEqual({
      strasse: "Betriebsweg",
      hausnummerVon: "42a",
      postleitzahl: "23936",
      ort: "Testorf-Steinfort",
    });
  });

  describe("AGS (Amtlicher Gemeindeschlüssel)", () => {
    it("returns AGS 02000000 if persönlicheDaten.adresse.postleitzahl is 21149 and there is no adresseAbweichend of the company", async () => {
      const result = await transformToGewerbeanmeldung({
        ...registerGewerbeCompleteRequest,
        persönlicheDaten: {
          ...registerGewerbeCompleteRequest.persönlicheDaten,
          adresse: {
            ...registerGewerbeCompleteRequest.persönlicheDaten.adresse,
            postleitzahl: "21149",
          },
        },
        unternehmensDaten: {
          ...registerGewerbeCompleteRequest.unternehmensDaten,
          adresseAbweichend: undefined,
        },
      });

      expect(result.gemeindeSchluessel).toBe("02000000");
    });

    it("returns AGS 11000000 if company has adresseAbweichend.postleitzahl of 10969", async () => {
      const result = await transformToGewerbeanmeldung({
        ...registerGewerbeCompleteRequest,
        unternehmensDaten: {
          ...registerGewerbeCompleteRequest.unternehmensDaten,
          adresseAbweichend: {
            ...registerGewerbeCompleteRequest.unternehmensDaten.adresseAbweichend!,
            postleitzahl: "10969",
          },
        },
      });

      expect(result.gemeindeSchluessel).toBe("11000000");
    });
  });
});
