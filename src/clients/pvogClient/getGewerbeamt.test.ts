import { describe, expect, it } from "vitest";
import { getGewerbeamt } from ".";

describe("getGewerbeamt", () => {
  it("returns the Gewerbeamt Ulm with address, contact details and online service links for ARS 084210000000", async () => {
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
          description: undefined,
          title: "Gewerbe anmelden",
          uri: "https://www.service-bw.de/onlineantraege/onlineantrag?prozessKey=m40169.gewerbe_anmelden_ludwigsburg&regionIds=2079&leistungId=496",
        },
        {
          title: "Gewerberegisteranzeige",
          description:
            "<p>\n\tZur Anmeldung bedarf es lediglich einer kurzen Registrierung als Benutzer des E-Bürgerdienstes Gewerbeanzeige. Mittels des daraufhin an Ihre angegeben E-Mail-Adresse gesandten Aktivierungscodes legitimieren Sie sich bitte als tatsächlich eingetragener Nutzer. Bei juristischen Personen schicken Sie uns bitte noch Ihren Handelsregisterauszug zu.</p>\n",
          uri: "https://aipkogema-ebd.dvvbw.de/ebd-gwr/index.jsp?ags=08421000",
        },
        {
          description: undefined,
          title: "Terminvereinbarung bei den Bürgerdiensten in der Olgastraße 66, 89073 Ulm",
          uri: "http://www.ulm.de/mb",
        },
        {
          description: undefined,
          title: "Gewerbeanmeldung",
          uri: "https://gewerbe.komm.one/intelliform/forms/pool/Behoerde/Gewerbeverfahren/Gewerbeanmeldung/index?caller=084210000000",
        },
      ],
    });
  });

  // temporarily skipped because of unstable API - proper fix (separate contract and unit tests) is in our backlog
  it.skip("returns an empty onlineServiceLinks list for Fraureuth (ARS 146120000000), which has no online services", async () => {
    const gewerbeamt = await getGewerbeamt("146120000000");

    expect(gewerbeamt.name).toBe("Gewerbeamt");
    expect(gewerbeamt.onlineServiceLinks).toEqual([]);
  });

  it("throws if no service description was found for ARS 000000000000", async () => {
    await expect(getGewerbeamt("000000000000")).rejects.toThrow(
      "No service description found for ARS 000000000000",
    );
  });
});
