import fs from "node:fs";
import { describe, it, expect } from "vitest";
import { XMLParser } from "fast-xml-parser";
import XMLBuilder from "fast-xml-builder";
import {
  createGewerbeanmeldungXml,
  type CreateGewerbeanmeldungXmlData as DataForCreateGewerbeanmeldungXml,
} from "./gewerbeanmeldung";

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
const builder = new XMLBuilder({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  format: true,
});
// normalizes XML so that semantically equivalent XMLs can be compared as strings,
// regardless of original formatting differences (whitespace, etc.).
function normalizeXml(xml: string) {
  return builder.build(parser.parse(xml));
}

const xgewo_1_6_valid_0400 = fs.readFileSync(
  "src/resources/xml/xml-samples/custom-xgewo-1.6-valid-0400.xml",
  "utf-8",
);

const gewerbeanmeldung: DataForCreateGewerbeanmeldungXml = {
  nachrichtenkopf: {
    nachrichtenUUID: "fb62d3b3-2a84-423a-bb0a-a767d32b6342",
    erstellungszeitpunkt: "2022-09-01T11:58:01.385+02:00",
    leser: {
      kennung: "xga:121499900001",
      name: "Phantasie-Verteilplattform",
    },
    autor: {
      kennung: "ds:schnellergruenden",
      name: "Schneller Gründen",
    },
  },
  autor: {
    kennung: "MELDID:12052000",
    name: "Gewerbeamt Cottbus",
  },
  anzeigerenderId: "np-1",
  handelndePersonId: "np-1",
  handelndePersonVertrauensniveauCode: "20",
  satzErstellung: "2022-07-04T17:54:42.000+00:00",
  ereigniszeitpunkt: "2026-05-08T12:00:29.0",
  istStorno: false,
  gemeindeSchluessel: "12052000",
  uuid: "9c3511e4-6f9d-4176-8d38-bc86df543b47",
  gueltigAb: "2022-08-01",
  datumMeldung: "2022-07-02",
  grundAnmeldungSchluessel: "01",
  gewerbebetrieb: {
    gewerbebetriebID: "0c9003a6-5b4f-4a99-98ae-b2b915708c1d",
    gemeindeMeldungNr: "2015 1023",
    rechtsformcode: "411000",
    eingetragenerName: "Tibor Pick e.K.",
    eintragung: {
      artEintragung: "A",
      registergericht: { code: "G1103" },
      eintragungsnummer: 11111,
    },
    betriebsstaette: {
      artBetriebsstaette: "01",
      anschrift: {
        strasse: "Spremberger Str.",
        strassenschluessel: "0000001801",
        hausnummerVon: "90",
        postleitzahl: "03046",
        ort: "Cottbus",
      },
      kommunikation: {
        telefon: "+49 234 121314",
      },
    },
    taetigkeitenGesamt: {
      schwerpunkt: {
        taetigkeitSchwerpunkt: "Friseur",
        wirtschaftszweigschluessel: "96021",
        stichwort: "Friseurgewerbe (Damen- und Herrenfriseursalons)",
      },
      weitereTaetigkeiten: {
        taetigkeitenZusammengefasst: "Verkauf von Haarpflegeprodukten|Make-up-Beratung",
        taetigkeit: [
          {
            taetigkeitEinzeln: "Verkauf von Haarpflegeprodukten",
            wirtschaftszweigschluessel: "47750",
            stichwort: "Haarbehandlungsmittel, zubereitete, Einzelhandel",
          },
          {
            taetigkeitEinzeln: "Make-up-Beratung",
            wirtschaftszweigschluessel: "96022",
            stichwort: "Typstylist",
          },
        ],
      },
    },
    istNebenerwerb: true,
    anzahlVollzeitBeschaeftigte: 0,
    anzahlTeilzeitBeschaeftigte: 2,
    istReisegewerbe: false,
    beteiligungOeffentlicheHand: "0",
    betriebArt: {
      industrie: false,
      handwerk: true,
      handel: false,
      sonstiges: false,
    },
    handwerkskarte: {
      status: "1",
      ausgestelltAm: "2012-03-01",
      ausgestelltVonPLZ: "03046",
      ausgestelltVonOrt: "Cottbus",
      ausgestelltVonSchluessel: "00007",
    },
  },
  referenzierteSubjekte: {
    natuerlichePerson: [
      {
        id: "np-1",
        name: {
          familienname: "Pick",
          geburtsname: "Rodríguez",
          vornamen: "Tibor",
        },
        geburt: {
          geburtsdatum: "1965-10-12",
          ort: "Santiago",
          staat: "Chile",
        },
        geschlecht: "m",
        staatsangehoerigkeit: "332",
        anschrift: {
          strasse: "Ewald-Hase-Str.",
          hausnummerVon: "4",
          postleitzahl: "03044",
          ort: "Cottbus",
        },
        kommunikation: {
          telefon: "+49 355 141455",
        },
        aufenthaltstitel: {
          status: "1",
          ausgestelltAm: "2002-01-02",
          ausgestelltVonName: "Stadt Cottbus",
          ausgestelltVonPLZ: "03044",
          ausgestelltVonOrt: "Cottbus",
        },
      },
    ],
  },
};

describe("createGewerbeanmeldungXml", () => {
  it("throws when the generated XML is invalid", async () => {
    const withoutPerson: DataForCreateGewerbeanmeldungXml = {
      ...gewerbeanmeldung,
      referenzierteSubjekte: { natuerlichePerson: [] },
    };

    await expect(createGewerbeanmeldungXml(withoutPerson)).rejects.toThrow(
      "Generated XGewerbeanmeldung is invalid.",
    );
  });

  it("does not crash with an empty input but fails only on XML validation", async () => {
    await expect(createGewerbeanmeldungXml({})).rejects.toThrow(
      "Generated XGewerbeanmeldung is invalid.",
    );
  });

  it("does not crash when all nested objects are present but all fields are undefined", async () => {
    await expect(
      createGewerbeanmeldungXml({
        nachrichtenkopf: { leser: {}, autor: {} },
        autor: {},
        bisherigeUnfallversicherung: {},
        gewerbebetrieb: {
          eintragung: { registergericht: {} },
          betriebsstaette: { anschrift: {}, kommunikation: {} },
          taetigkeitenGesamt: {
            schwerpunkt: {},
            weitereTaetigkeiten: { taetigkeit: [{}] },
          },
          betriebArt: {},
          handwerkskarte: {},
        },
        referenzierteSubjekte: {
          natuerlichePerson: [
            {
              name: {},
              geburt: {},
              anschrift: {},
              kommunikation: {},
              aufenthaltstitel: {},
            },
          ],
        },
      }),
    ).rejects.toThrow("Generated XGewerbeanmeldung is invalid.");
  });

  it("maps Gewerbeanmeldung data to the correct xGewerbeordnung 1.6 XML structure", async () => {
    expect(normalizeXml(await createGewerbeanmeldungXml(gewerbeanmeldung))).toBe(
      normalizeXml(xgewo_1_6_valid_0400),
    );
  });

  it("omits optional XML elements when data is not provided", async () => {
    const minimal: DataForCreateGewerbeanmeldungXml = {
      nachrichtenkopf: {
        nachrichtenUUID: "00000000-0000-0000-0000-000000000001",
        erstellungszeitpunkt: "2024-01-01T10:00:00.000+01:00",
        leser: { kennung: "xga:000000000001", name: "Empfänger" },
        autor: { kennung: "MELDID:00000000", name: "Gewerbeamt Muster" },
      },
      autor: { kennung: "MELDID:00000000", name: "Gewerbeamt Muster" },
      handelndePersonVertrauensniveauCode: "20",
      satzErstellung: "2024-01-01T09:00:00.000+01:00",
      ereigniszeitpunkt: "2024-01-02T08:00:00.0",
      istStorno: false,
      gemeindeSchluessel: "00000000",
      uuid: "00000000-0000-0000-0000-000000000002",
      gueltigAb: "2024-01-02",
      datumMeldung: "2024-01-01",
      grundAnmeldungSchluessel: "01",
      gewerbebetrieb: {
        gewerbebetriebID: "00000000-0000-0000-0000-000000000003",
        gemeindeMeldungNr: "2024 0001",
        rechtsformcode: "411000",
        eingetragenerName: "Muster GmbH",
        beteiligungOeffentlicheHand: "0",
        betriebsstaette: {
          artBetriebsstaette: "01",
          anschrift: {
            strasse: "Musterstraße",
            hausnummerVon: "1",
            postleitzahl: "12345",
            ort: "Musterstadt",
          },
        },
        taetigkeitenGesamt: {
          schwerpunkt: {
            taetigkeitSchwerpunkt: "Handel",
            wirtschaftszweigschluessel: "47990",
            stichwort: "Einzelhandel",
          },
        },
        istNebenerwerb: false,
        anzahlVollzeitBeschaeftigte: 0,
        anzahlTeilzeitBeschaeftigte: 0,
        istReisegewerbe: false,
        betriebArt: {
          industrie: false,
          handwerk: false,
          handel: true,
          sonstiges: false,
        },
      },
      referenzierteSubjekte: {
        natuerlichePerson: [
          {
            id: "np-1",
            name: { familienname: "Muster", vornamen: "Max" },
            geburt: { geburtsdatum: "1980-01-01", ort: "Berlin", staat: "Deutschland" },
            geschlecht: "m",
            staatsangehoerigkeit: "000",
            anschrift: {
              strasse: "Musterstraße",
              hausnummerVon: "1",
              postleitzahl: "12345",
              ort: "Musterstadt",
            },
          },
        ],
      },
    };
    const xml = await createGewerbeanmeldungXml(minimal);
    expect(xml).toContain("<xga:ext.gewerbemeldung.0400");
    expect(xml).not.toContain("<bk:kommunikation>");
    expect(xml).not.toContain("<xga:handwerkskarte>");
    expect(xml).not.toContain("<xga:weitereTaetigkeiten>");
    expect(xml).not.toContain("<xga:aufenthaltstitel>");
    expect(xml).not.toContain("<bk:bisherigeUnfallversicherung>");
    expect(xml).not.toContain("<antr:anzeigender.id>");
    expect(xml).not.toContain("<antr:handelndePerson.id>");
    expect(xml).not.toContain("<antr:ansprechpartner.id>");
  });

  it("includes ansprechpartner.id when provided", async () => {
    const xml = await createGewerbeanmeldungXml({
      ...gewerbeanmeldung,
      ansprechpartnerId: "np-1",
    });
    expect(xml).toContain("<antr:ansprechpartner.id>np-1</antr:ansprechpartner.id>");
  });

  it(`escapes XML special characters (<, >, &, ', ") in text fields`, async () => {
    const withSpecials: DataForCreateGewerbeanmeldungXml = {
      ...gewerbeanmeldung,
      autor: { ...gewerbeanmeldung.autor, name: "Amt <Müller & Söhne>" },
      gewerbebetrieb: {
        ...gewerbeanmeldung.gewerbebetrieb,
        eingetragenerName: `Müller & <Söhne> "GmbH" 'Co.'`,
        taetigkeitenGesamt: {
          ...gewerbeanmeldung.gewerbebetrieb!.taetigkeitenGesamt,
          schwerpunkt: {
            ...gewerbeanmeldung.gewerbebetrieb!.taetigkeitenGesamt!.schwerpunkt,
            stichwort: "A > B & C < D",
          },
        },
      },
    };

    const generatedXml = await createGewerbeanmeldungXml(withSpecials);

    expect(generatedXml).not.toContain(`Müller & <Söhne> "GmbH" 'Co.'`);
    expect(generatedXml).toContain("Müller &amp; &lt;Söhne&gt; &quot;GmbH&quot; &apos;Co.&apos;");
    expect(generatedXml).toContain("A &gt; B &amp; C &lt; D");
  });

  it("includes housenumber range and suffix in the business address", async () => {
    const withRange: DataForCreateGewerbeanmeldungXml = {
      ...gewerbeanmeldung,
      gewerbebetrieb: {
        ...gewerbeanmeldung.gewerbebetrieb,
        betriebsstaette: {
          ...gewerbeanmeldung.gewerbebetrieb!.betriebsstaette,
          anschrift: {
            ...gewerbeanmeldung.gewerbebetrieb!.betriebsstaette!.anschrift,
            hausnummerVon: "90",
            hausnummerBis: "94",
          },
        },
      },
    };

    const parsed = parser.parse(await createGewerbeanmeldungXml(withRange));
    const anschrift =
      parsed["xga:ext.gewerbemeldung.0400"]["xga:satz"]["xga:anmeldung"]["xga:gewerbebetrieb"][
        "xga:betriebsstaette"
      ]["bk:anschrift"]["bk:strassenanschriftInland"];
    expect(anschrift["bk:hausnummerVon"]).toBe(90);
    expect(anschrift["bk:hausnummerBis"]).toBe(94);
  });

  it("includes fax, email and website even when phone is missing", async () => {
    const withoutPhone: DataForCreateGewerbeanmeldungXml = {
      ...gewerbeanmeldung,
      gewerbebetrieb: {
        ...gewerbeanmeldung.gewerbebetrieb,
        betriebsstaette: {
          ...gewerbeanmeldung.gewerbebetrieb!.betriebsstaette,
          kommunikation: {
            telefax: "+49 234 555000",
            email: "kontakt@example.de",
            webAdresse: "https://example.de",
          },
        },
      },
    };

    const generatedXml = await createGewerbeanmeldungXml(withoutPhone);
    const parsed = parser.parse(generatedXml);
    const kommunikation =
      parsed["xga:ext.gewerbemeldung.0400"]["xga:satz"]["xga:anmeldung"]["xga:gewerbebetrieb"][
        "xga:betriebsstaette"
      ]["bk:kommunikation"];
    expect(kommunikation["komm:telefax"]).toBe("+49 234 555000");
    expect(kommunikation["komm:eMail"]).toBe("kontakt@example.de");
    expect(kommunikation["komm:webAdresse"]).toBe("https://example.de");
    expect(kommunikation["komm:telefon"]).toBeUndefined();
  });

  it("creates every natuerlichePerson entry when the array contains multiple", async () => {
    const firstPerson = gewerbeanmeldung.referenzierteSubjekte!.natuerlichePerson![0]!;
    const multiPerson: DataForCreateGewerbeanmeldungXml = {
      ...gewerbeanmeldung,
      referenzierteSubjekte: {
        natuerlichePerson: [
          firstPerson,
          {
            ...firstPerson,
            id: "np-2",
            name: { familienname: "Zweitperson", vornamen: "Anna" },
          },
        ],
      },
    };

    const parsed = parser.parse(await createGewerbeanmeldungXml(multiPerson));
    const personen =
      parsed["xga:ext.gewerbemeldung.0400"]["xga:satz"]["xga:anmeldung"][
        "xga:referenzierteSubjekte"
      ]["xga:natuerlichePerson"];
    expect(Array.isArray(personen)).toBe(true);
    expect(personen).toHaveLength(2);
    expect(personen[0]["np:natuerlichePerson.id"]).toBe("np-1");
    expect(personen[1]["np:natuerlichePerson.id"]).toBe("np-2");
    expect(personen[1]["np:name"]["np:familienname"]).toBe("Zweitperson");
  });

  it("includes bisherigeUnfallversicherung element when provided", async () => {
    const withUnfallversicherung: DataForCreateGewerbeanmeldungXml = {
      ...gewerbeanmeldung,
      grundAnmeldungSchluessel: "02", // Verlegung des Betriebs aus einem anderen Meldebezirk
      bisherigeUnfallversicherung: { traeger: "08", unternehmensnummer: "123456789012345" },
    };

    const xml = await createGewerbeanmeldungXml(withUnfallversicherung);
    expect(xml).toContain("<bk:bisherigeUnfallversicherung>");
    expect(xml).toContain("<code>08</code>");
    expect(xml).toContain("<bk:unternehmensnummer>123456789012345</bk:unternehmensnummer>");
  });

  it("includes gemeindeschluesselErgaenzung for Hamburg (schematron rule SCH-0189)", async () => {
    const hamburg: DataForCreateGewerbeanmeldungXml = {
      ...gewerbeanmeldung,
      autor: { ...gewerbeanmeldung.autor, kennung: "MELDID:02000000" },
      gemeindeSchluessel: "02000000",
      gemeindeschluesselErgaenzung: "02100000",
      gewerbebetrieb: {
        ...gewerbeanmeldung.gewerbebetrieb,
        betriebsstaette: {
          ...gewerbeanmeldung.gewerbebetrieb!.betriebsstaette,
          anschrift: {
            ...gewerbeanmeldung.gewerbebetrieb!.betriebsstaette!.anschrift,
            postleitzahl: "22767",
            ort: "Hamburg",
          },
        },
      },
    };

    const xml = await createGewerbeanmeldungXml(hamburg);
    expect(xml).toContain(
      '<xga:gemeindeschluesselErgaenzung listVersionID="1"><code>02100000</code></xga:gemeindeschluesselErgaenzung>',
    );
  });

  it("rejects a Hamburg Gewerbeanmeldung without gemeindeschluesselErgaenzung (schematron rule SCH-0189 violation)", async () => {
    const hamburgWithoutErgaenzung: DataForCreateGewerbeanmeldungXml = {
      ...gewerbeanmeldung,
      autor: { ...gewerbeanmeldung.autor, kennung: "MELDID:02000000" },
      gemeindeSchluessel: "02000000",
    };

    await expect(createGewerbeanmeldungXml(hamburgWithoutErgaenzung)).rejects.toThrow(
      "Generated XGewerbeanmeldung is invalid.",
    );
  });

  it("includes bisherigeUnfallversicherung without unternehmensnummer when omitted", async () => {
    const withUnfallversicherungButNoUnternehmensummer: DataForCreateGewerbeanmeldungXml = {
      ...gewerbeanmeldung,
      grundAnmeldungSchluessel: "02",
      bisherigeUnfallversicherung: { traeger: "08" },
    };

    const xml = await createGewerbeanmeldungXml(withUnfallversicherungButNoUnternehmensummer);
    expect(xml).toContain("<bk:bisherigeUnfallversicherung>");
    expect(xml).not.toContain("bk:unternehmensnummer");
  });
});
