import { describe, it, expect } from "vitest";
import { lookupRequestContext } from "./lookupRequestContext";
import { registerGewerbeCompleteRequest } from "./testHelpers";

describe("lookupRequestContext", () => {
  describe("AGS (Amtlicher Gemeindeschlüssel)", () => {
    it("returns AGS 02000000 if persönlicheDaten.adresse.postleitzahl is 21149 and there is no adresseAbweichend of the company", async () => {
      const result = await lookupRequestContext({
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

      expect(result.ags).toBe("02000000");
    });

    it("returns AGS 11000000 if company has adresseAbweichend.postleitzahl of 10969", async () => {
      const result = await lookupRequestContext({
        ...registerGewerbeCompleteRequest,
        unternehmensDaten: {
          ...registerGewerbeCompleteRequest.unternehmensDaten,
          adresseAbweichend: {
            ...registerGewerbeCompleteRequest.unternehmensDaten.adresseAbweichend!,
            postleitzahl: "10969",
          },
        },
      });

      expect(result.ags).toBe("11000000");
    });
  });
});
