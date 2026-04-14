import { describe, it, expect } from "vitest";
import { XMLParser, XMLBuilder } from "fast-xml-parser";
import { xGewerbeanmeldung0300, type Anmeldung } from "./gewerbeanmeldung";

// Make sure that both XMLs are equally formatted
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
const builder = new XMLBuilder({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  format: true,
});
const normalizeXml = (xml: string) => builder.build(parser.parse(xml));

// source https://www.xrepository.de/api/xrepository/urn:xoev-de:kosit:standard:xgewerbeordnung_1.6:dokument:Validator-Konfiguration__01.08.2025_
const xgewo_1_6_valid = `
<?xml version="1.0" encoding="UTF-8"?>
<xga:alg.gewerbemeldung.0300
  xmlns:xga="http://www.xgewerbeordnung.de/spezifikation/xga/1.6"
  xmlns:erl="http://www.xgewerbeordnung.de/spezifikation/erl/1.6"
  xmlns:bk="http://www.xgewerbeordnung.de/spezifikation/baukasten/1.6"
  xmlns:nachr="urn:xoev-de:xunternehmen:standard:basismodul:nachrichtenstruktur_1.2"
  xmlns:np="urn:xoev-de:xunternehmen:standard:basismodul:natuerlicheperson_1.2"
  xmlns:jp="urn:xoev-de:xunternehmen:standard:basismodul:juristischeperson_1.2"
  xmlns:rpg="urn:xoev-de:xunternehmen:standard:basismodul:rechtsfaehigepersonengesellschaft_1.2"
  xmlns:eintr="urn:xoev-de:xunternehmen:standard:basismodul:eintragung_1.2"
  xmlns:rf="urn:xoev-de:xunternehmen:standard:basismodul:rechtsform_1.2"
  xmlns:bn-g2g="http://xoev.de/schemata/basisnachricht/g2g/1_1"
  xmlns:bn-beh="http://xoev.de/schemata/basisnachricht/behoerde/1_1"
  xmlns:bn-kom="http://xoev.de/schemata/basisnachricht/kommunikation/1_1"
  xmlns:komm="urn:xoev-de:xunternehmen:standard:basismodul:kommunikation_1.2"
  xmlns:wt="urn:xoev-de:xunternehmen:standard:basismodul:wirtschaftlichetaetigkeit_1.2"
  xmlns:ename="urn:xoev-de:xunternehmen:standard:basismodul:eingetragenername_1.2"
  xmlns:eintragung="urn:xoev-de:xunternehmen:standard:basismodul:eintragung_1.2"
  xmlns:adr="urn:xoev-de:xunternehmen:standard:basismodul:adressen_1.2"
  xmlns:antr="urn:xoev-de:xunternehmen:standard:basismodul:antraege-anzeigen_1.2"
  xmlns:lc="urn:xoev-de:kosit:xoev:datentyp:din-91379_2022-08"
  xmlns:code="http://xoev.de/schemata/code/1_0"
  xmlns:dat="urn:xoev-de:xunternehmen:standard:basismodul:datumsangaben_1.2"
  xmlns:gv="urn:xoev-de:xunternehmen:standard:basismodul:gesetzlichervertreter_1.2"
  xmlns:ges="urn:xoev-de:xunternehmen:standard:basismodul:gesellschafter_1.2"
  xmlns:spv="urn:xoev-de:xunternehmen:standard:basismodul:sonstigepersonenvereinigung_1.2"
  xmlns:bspv="urn:xoev-de:xunternehmen:standard:basismodul:beteiligtersonstigepersonenvereinigung_1.2"
  produkt="XGA-Testsuite"
  produkthersteller="KoSIT"
  produktversion="2024"
  standard="XGewerbeordnung"
  version="1.6"
  test="100">
  <bn-g2g:nachrichtenkopf.g2g>
    <bn-g2g:identifikation.nachricht>
        <bn-g2g:nachrichtenUUID>fb62d3b3-2a84-423a-bb0a-a767d32b6342</bn-g2g:nachrichtenUUID>
        <bn-g2g:nachrichtentyp listURI="urn:xoev-de:xgewerbeordnung:codeliste:nachrichtentypen"
                              listVersionID="1.6">
          <code>0300</code>
        </bn-g2g:nachrichtentyp>
        <bn-g2g:erstellungszeitpunkt>2022-09-01T11:58:01.385+02:00</bn-g2g:erstellungszeitpunkt>
    </bn-g2g:identifikation.nachricht>
    <bn-g2g:leser>
        <bn-beh:verzeichnisdienst listVersionID="1">
          <code>DVDV</code>
        </bn-beh:verzeichnisdienst>
        <bn-beh:kennung>xga:121499900001</bn-beh:kennung>
        <bn-beh:name>Phantasie-Verteilplattform</bn-beh:name>
    </bn-g2g:leser>
    <bn-g2g:autor>
        <bn-beh:verzeichnisdienst listVersionID="1">
          <code>DVDV</code>
        </bn-beh:verzeichnisdienst>
        <bn-beh:kennung>MELDID:12052000</bn-beh:kennung>
        <bn-beh:name>Gewerbeamt Cottbus</bn-beh:name>
    </bn-g2g:autor>
  </bn-g2g:nachrichtenkopf.g2g>
  <xga:satz>
    <xga:anmeldung>
        <xga:autor>
          <bn-beh:verzeichnisdienst listVersionID="1">
              <code>DVDV</code>
          </bn-beh:verzeichnisdienst>
          <bn-beh:kennung>MELDID:12052000</bn-beh:kennung>
          <bn-beh:name>Gewerbeamt Cottbus</bn-beh:name>
        </xga:autor>
        <xga:satzErstellung>2022-07-04T17:54:42.000+00:00</xga:satzErstellung>
        <xga:ereigniszeitpunkt>2026-05-08T12:00:29.0</xga:ereigniszeitpunkt>
        <xga:istStorno>false</xga:istStorno>
        <xga:gemeindeSchluessel listVersionID="2020-03-31">
          <code>12052000</code>
        </xga:gemeindeSchluessel>
        <xga:uuid>9c3511e4-6f9d-4176-8d38-bc86df543b47</xga:uuid>
        <xga:gueltigAb>2022-08-01</xga:gueltigAb>
        <xga:datumMeldung>2022-07-02</xga:datumMeldung>
        <xga:gewerbebetrieb>
          <xga:gewerbebetriebID>0c9003a6-5b4f-4a99-98ae-b2b915708c1d</xga:gewerbebetriebID>
          <xga:gemeindeMeldungNr>2015 1023</xga:gemeindeMeldungNr>
          <rf:rechtsform>
              <rf:rechtsformcode listVersionID="2.2">
                <code>411000</code>
              </rf:rechtsformcode>
          </rf:rechtsform>
          <wt:wirtschaftlichTaetiger.id>np-1</wt:wirtschaftlichTaetiger.id>
          <ename:eingetragenerName>Tibor Pick e.K.</ename:eingetragenerName>
          <bk:eintragung>
              <eintragung:artEintragung listVersionID="1">
                <code>A</code>
              </eintragung:artEintragung>
              <eintragung:registergericht.code listVersionID="12">
                <code>G1103</code>
              </eintragung:registergericht.code>
              <eintragung:eintragungsnummer>11111</eintragung:eintragungsnummer>
          </bk:eintragung>
          <xga:betriebsstaette>
              <wt:artBetriebsstaette listVersionID="1">
                <code>01</code>
              </wt:artBetriebsstaette>
              <bk:anschrift>
                <bk:strassenanschriftInland>
                    <adr:strasse>Spremberger Str.</adr:strasse>
                    <bk:strassenschluessel>0000001801</bk:strassenschluessel>
                    <bk:hausnummerVon>90</bk:hausnummerVon>
                    <adr:postleitzahl>03046</adr:postleitzahl>
                    <adr:ort>Cottbus</adr:ort>
                </bk:strassenanschriftInland>
              </bk:anschrift>
              <bk:kommunikation>
                <komm:telefon>+49 234 121314</komm:telefon>
              </bk:kommunikation>
          </xga:betriebsstaette>
          <xga:taetigkeitenGesamt>
              <xga:schwerpunkt>
                <xga:taetigkeitSchwerpunkt>Friseur</xga:taetigkeitSchwerpunkt>
                <wt:wirtschaftszweig>
                    <wt:wirtschaftszweigschluessel>96021</wt:wirtschaftszweigschluessel>
                    <wt:versionWirtschaftszweigklassifikation listVersionID="1">
                      <code>WZ-2008</code>
                    </wt:versionWirtschaftszweigklassifikation>
                </wt:wirtschaftszweig>
                <xga:stichwort>Friseurgewerbe (Damen- und Herrenfriseursalons)</xga:stichwort>
              </xga:schwerpunkt>
              <xga:weitereTaetigkeiten>
                <xga:taetigkeitenZusammengefasst>Verkauf von Haarpflegeprodukten|Make-up-Beratung</xga:taetigkeitenZusammengefasst>
                <xga:taetigkeit>
                    <xga:taetigkeitEinzeln>Verkauf von Haarpflegeprodukten</xga:taetigkeitEinzeln>
                    <wt:wirtschaftszweig>
                      <wt:wirtschaftszweigschluessel>47750</wt:wirtschaftszweigschluessel>
                      <wt:versionWirtschaftszweigklassifikation listVersionID="1">
                        <code>WZ-2008</code>
                      </wt:versionWirtschaftszweigklassifikation>
                    </wt:wirtschaftszweig>
                    <xga:stichwort>Haarbehandlungsmittel, zubereitete, Einzelhandel</xga:stichwort>
                </xga:taetigkeit>
                <xga:taetigkeit>
                    <xga:taetigkeitEinzeln>Make-up-Beratung</xga:taetigkeitEinzeln>
                    <wt:wirtschaftszweig>
                      <wt:wirtschaftszweigschluessel>96022</wt:wirtschaftszweigschluessel>
                      <wt:versionWirtschaftszweigklassifikation listVersionID="1">
                        <code>WZ-2008</code>
                      </wt:versionWirtschaftszweigklassifikation>
                    </wt:wirtschaftszweig>
                    <xga:stichwort>Typstylist</xga:stichwort>
                </xga:taetigkeit>
              </xga:weitereTaetigkeiten>
          </xga:taetigkeitenGesamt>
          <xga:gewerbetreibender>
            <xga:gewerbetreibender.id>np-1</xga:gewerbetreibender.id>
            <xga:istNebenerwerb>true</xga:istNebenerwerb>
          </xga:gewerbetreibender>
          <xga:anzahlVollzeitBeschaeftigte>0</xga:anzahlVollzeitBeschaeftigte>
          <xga:anzahlTeilzeitBeschaeftigte>2</xga:anzahlTeilzeitBeschaeftigte>
          <xga:istReisegewerbe>false</xga:istReisegewerbe>
          <xga:beteiligungOeffentlicheHand>
            <code>0</code>
          </xga:beteiligungOeffentlicheHand>
          <xga:betriebArt>
            <xga:industrie>false</xga:industrie>
            <xga:handwerk>true</xga:handwerk>
            <xga:handel>false</xga:handel>
            <xga:sonstiges>false</xga:sonstiges>
          </xga:betriebArt>
          <xga:handwerkskarte>
            <xga:status>
              <code>1</code>
            </xga:status>
            <xga:ausgestelltAm>2012-03-01</xga:ausgestelltAm>
            <xga:ausgestelltVonPLZ>03046</xga:ausgestelltVonPLZ>
            <xga:ausgestelltVonOrt>Cottbus</xga:ausgestelltVonOrt>
            <xga:ausgestelltVonSchluessel listVersionID="5">
              <code>00007</code>
            </xga:ausgestelltVonSchluessel>
          </xga:handwerkskarte>
        </xga:gewerbebetrieb>
        <xga:referenzierteSubjekte>
          <xga:natuerlichePerson>
            <np:natuerlichePerson.id>np-1</np:natuerlichePerson.id>
            <np:name>
              <np:familienname>Pick</np:familienname>
              <np:geburtsname>Rodríguez</np:geburtsname>
              <np:vornamen>Tibor</np:vornamen>
            </np:name>
            <bk:geburt>
              <np:geburtsdatum>
                <dat:datum>1965-10-12</dat:datum>
              </np:geburtsdatum>
              <adr:ort>Santiago</adr:ort>
              <bk:staat>Chile</bk:staat>
            </bk:geburt>
            <np:geschlecht listVersionID="1">
              <code>m</code>
            </np:geschlecht>
            <np:staatsangehoerigkeit listVersionID="2020-05-11">
              <code>332</code>
            </np:staatsangehoerigkeit>
            <bk:anschrift>
              <bk:strassenanschriftInland>
                <adr:strasse>Ewald-Hase-Str.</adr:strasse>
                <bk:hausnummerVon>4</bk:hausnummerVon>
                <adr:postleitzahl>03044</adr:postleitzahl>
                <adr:ort>Cottbus</adr:ort>
              </bk:strassenanschriftInland>
            </bk:anschrift>
            <bk:kommunikation>
              <komm:telefon>+49 355 141455</komm:telefon>
            </bk:kommunikation>
            <xga:aufenthaltstitel>
              <xga:status>
                <code>1</code>
              </xga:status>
              <xga:ausgestelltAm>2002-01-02</xga:ausgestelltAm>
              <xga:ausgestelltVonName>Stadt Cottbus</xga:ausgestelltVonName>
              <xga:ausgestelltVonPLZ>03044</xga:ausgestelltVonPLZ>
              <xga:ausgestelltVonOrt>Cottbus</xga:ausgestelltVonOrt>
            </xga:aufenthaltstitel>
          </xga:natuerlichePerson>
        </xga:referenzierteSubjekte>
        <xga:grundAnmeldungSchluessel>
          <code>01</code>
        </xga:grundAnmeldungSchluessel>
    </xga:anmeldung>
  </xga:satz>
</xga:alg.gewerbemeldung.0300>`;

const anmeldung: Anmeldung = {
  nachrichtenkopf: {
    nachrichtenUUID: "fb62d3b3-2a84-423a-bb0a-a767d32b6342",
    erstellungszeitpunkt: "2022-09-01T11:58:01.385+02:00",
    leser: {
      kennung: "xga:121499900001",
      name: "Phantasie-Verteilplattform",
    },
    autor: {
      kennung: "MELDID:12052000",
      name: "Gewerbeamt Cottbus",
    },
  },
  autor: {
    kennung: "MELDID:12052000",
    name: "Gewerbeamt Cottbus",
  },
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

describe("xGewerbeanmeldung0300", () => {
  it("creates a valid xGewerbeordnung 1.6 xml", () => {
    expect(normalizeXml(xGewerbeanmeldung0300(anmeldung))).toBe(normalizeXml(xgewo_1_6_valid));
  });

  it("works without optional fields", () => {
    const minimal: Anmeldung = {
      nachrichtenkopf: {
        nachrichtenUUID: "00000000-0000-0000-0000-000000000001",
        erstellungszeitpunkt: "2024-01-01T10:00:00.000+01:00",
        leser: { kennung: "xga:000000000001", name: "Empfänger" },
        autor: { kennung: "MELDID:00000000", name: "Gewerbeamt Muster" },
      },
      autor: { kennung: "MELDID:00000000", name: "Gewerbeamt Muster" },
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
          },
        ],
      },
    };
    const xml = xGewerbeanmeldung0300(minimal);
    expect(xml).toContain("<xga:alg.gewerbemeldung.0300");
    expect(xml).not.toContain("<bk:kommunikation>");
    expect(xml).not.toContain("<xga:handwerkskarte>");
    expect(xml).not.toContain("<xga:weitereTaetigkeiten>");
    expect(xml).not.toContain("<xga:beteiligungOeffentlicheHand>");
    expect(xml).not.toContain("<xga:aufenthaltstitel>");
  });

  it("escapes XML special characters in text fields", () => {
    const withSpecials: Anmeldung = {
      ...anmeldung,
      autor: { ...anmeldung.autor, name: "Amt <Müller & Söhne>" },
      gewerbebetrieb: {
        ...anmeldung.gewerbebetrieb,
        eingetragenerName: "Müller & Söhne GmbH",
        taetigkeitenGesamt: {
          ...anmeldung.gewerbebetrieb.taetigkeitenGesamt,
          schwerpunkt: {
            ...anmeldung.gewerbebetrieb.taetigkeitenGesamt.schwerpunkt,
            stichwort: "A > B & C < D",
          },
        },
      },
    };

    const generatedXml = xGewerbeanmeldung0300(withSpecials);

    expect(() => parser.parse(generatedXml)).not.toThrow();
    const parsed = parser.parse(generatedXml);
    const anmeldungNode = parsed["xga:alg.gewerbemeldung.0300"]["xga:satz"]["xga:anmeldung"];
    expect(anmeldungNode["xga:autor"]["bn-beh:name"]).toBe("Amt <Müller & Söhne>");
    expect(anmeldungNode["xga:gewerbebetrieb"]["ename:eingetragenerName"]).toBe(
      "Müller & Söhne GmbH",
    );
    expect(
      anmeldungNode["xga:gewerbebetrieb"]["xga:taetigkeitenGesamt"]["xga:schwerpunkt"][
        "xga:stichwort"
      ],
    ).toBe("A > B & C < D");

    expect(generatedXml).not.toContain("Müller & Söhne GmbH");
    expect(generatedXml).toContain("Müller &amp; Söhne GmbH");
    expect(generatedXml).toContain("A &gt; B &amp; C &lt; D");
  });

  it("throws when the natuerlichePerson array is empty", () => {
    const withoutPerson: Anmeldung = {
      ...anmeldung,
      referenzierteSubjekte: { natuerlichePerson: [] },
    };
    expect(() => xGewerbeanmeldung0300(withoutPerson)).toThrow(/natuerlichePerson\[0\]/);
  });

  it("includes housenumber range and suffix in the business address", () => {
    const withRange: Anmeldung = {
      ...anmeldung,
      gewerbebetrieb: {
        ...anmeldung.gewerbebetrieb,
        betriebsstaette: {
          ...anmeldung.gewerbebetrieb.betriebsstaette,
          anschrift: {
            ...anmeldung.gewerbebetrieb.betriebsstaette.anschrift,
            hausnummerVon: "90",
            hausnummerBis: "94",
            hausnummernzusatz: "a",
          },
        },
      },
    };

    const parsed = parser.parse(xGewerbeanmeldung0300(withRange));
    const anschrift =
      parsed["xga:alg.gewerbemeldung.0300"]["xga:satz"]["xga:anmeldung"]["xga:gewerbebetrieb"][
        "xga:betriebsstaette"
      ]["bk:anschrift"]["bk:strassenanschriftInland"];
    expect(anschrift["bk:hausnummerVon"]).toBe(90);
    expect(anschrift["bk:hausnummerBis"]).toBe(94);
    expect(anschrift["bk:hausnummernzusatz"]).toBe("a");
  });

  it("includes fax, email and website even when phone is missing", () => {
    const withoutPhone: Anmeldung = {
      ...anmeldung,
      gewerbebetrieb: {
        ...anmeldung.gewerbebetrieb,
        betriebsstaette: {
          ...anmeldung.gewerbebetrieb.betriebsstaette,
          kommunikation: {
            telefax: "+49 234 555000",
            email: "kontakt@example.de",
            webseite: "https://example.de",
          },
        },
      },
    };

    const generatedXml = xGewerbeanmeldung0300(withoutPhone);
    const parsed = parser.parse(generatedXml);
    const kommunikation =
      parsed["xga:alg.gewerbemeldung.0300"]["xga:satz"]["xga:anmeldung"]["xga:gewerbebetrieb"][
        "xga:betriebsstaette"
      ]["bk:kommunikation"];
    expect(kommunikation["komm:telefax"]).toBe("+49 234 555000");
    expect(kommunikation["komm:email"]).toBe("kontakt@example.de");
    expect(kommunikation["komm:webseite"]).toBe("https://example.de");
    expect(kommunikation["komm:telefon"]).toBeUndefined();
  });

  it("creates every natuerlichePerson entry when the array contains multiple", () => {
    const firstPerson = anmeldung.referenzierteSubjekte.natuerlichePerson[0]!;
    const multiPerson: Anmeldung = {
      ...anmeldung,
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

    const parsed = parser.parse(xGewerbeanmeldung0300(multiPerson));
    const personen =
      parsed["xga:alg.gewerbemeldung.0300"]["xga:satz"]["xga:anmeldung"][
        "xga:referenzierteSubjekte"
      ]["xga:natuerlichePerson"];
    expect(Array.isArray(personen)).toBe(true);
    expect(personen).toHaveLength(2);
    expect(personen[0]["np:natuerlichePerson.id"]).toBe("np-1");
    expect(personen[1]["np:natuerlichePerson.id"]).toBe("np-2");
    expect(personen[1]["np:name"]["np:familienname"]).toBe("Zweitperson");
  });
});
