import { describe, expect, it } from "vitest";
import { getGewerbeamt } from "./getGewerbeamt";

describe("getGewerbeamt", () => {
  it("should return the Gewerbeamt Ulm with address, contact details and online service links for ARS 084210000000", async () => {
    const gewerbeamt = await getGewerbeamt("084210000000");

    expect(gewerbeamt).toEqual({
      name: "Bürgerdienste - Gewerbean-, um-, abmeldungen, Reisegewerbekarten, Gaststättenrecht, Gesundheitswesen, Waffen- und Sprengstoffwesen",
      adresse: {
        strasse: "Olgastraße",
        hausnummer: "66",
        postleitzahl: "89073",
        ort: "Ulm",
      },
      telefon: "+49 731 161 3216",
      email: "gewerbe@ulm.de",
      onlineServiceLinks: [
        {
          title: "Gewerbe anmelden",
          uri: "https://www.service-bw.de/onlineantraege/onlineantrag?prozessKey=m40169.gewerbe_anmelden_ludwigsburg&regionIds=2079&leistungId=496",
        },
        {
          title: "Gewerberegisteranzeige",
          uri: "https://aipkogema-ebd.dvvbw.de/ebd-gwr/index.jsp?ags=08421000",
        },
        {
          title: "Terminvereinbarung bei den Bürgerdiensten in der Olgastraße 66, 89073 Ulm",
          uri: "http://www.ulm.de/mb",
        },
      ],
    });
  });

  it("should return an empty onlineServiceLinks list for Fraureuth (ARS 146120000000), which has no online services", async () => {
    const gewerbeamt = await getGewerbeamt("146120000000");

    expect(gewerbeamt.name).toBe("Gewerbeamt");
    expect(gewerbeamt.onlineServiceLinks).toEqual([]);
  });

  it("should throw if no service description was found for ARS 000000000000", async () => {
    await expect(getGewerbeamt("000000000000")).rejects.toThrow(
      "No service description found for ARS 000000000000",
    );
  });
});
