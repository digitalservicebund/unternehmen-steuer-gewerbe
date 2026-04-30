import { randomUUID } from "node:crypto";
import type { Gewerbeanmeldung } from "../../xmlBuilders/xGewerbeordnung/gewerbeanmeldung";
import { RegisterGewerbeRequest } from "./registerGewerbeInterfaces";
import { splitStrasseHausnummer } from "../../helpers/data";


// Transforms a RegisterGewerbeRequest into a complete Gewerbeanmeldung structure.
// NOTE: several values are hardcoded placeholders and will be generated / fetched from other sources later.
export function transformToGewerbeanmeldung(data: RegisterGewerbeRequest): Gewerbeanmeldung {
  const adresseAbweichend = data.unternehmensDaten.adresseAbweichend;

  const betriebsStrasseHausnummer = splitStrasseHausnummer(
    adresseAbweichend?.strasseUndHausnummer || data.persönlicheDaten.adresse.strasseUndHausnummer,
  );
  const personStrasseHausnummer = splitStrasseHausnummer(
    data.persönlicheDaten.adresse.strasseUndHausnummer,
  );

  return {
    nachrichtenkopf: {
      nachrichtenUUID: randomUUID(),
      erstellungszeitpunkt: new Date().toISOString(),
      leser: { kennung: "xga:000000000001", name: "Gewerbeamt Muster" },
      autor: { kennung: "MELDID:00000000", name: "Schneller Gruenden OSS" },
    },
    autor: { kennung: "MELDID:00000000", name: "Schneller Gruenden OSS" },
    satzErstellung: new Date().toISOString(),
    ereigniszeitpunkt: new Date().toISOString(),
    istStorno: false,
    gemeindeSchluessel: "00000000",
    uuid: randomUUID(),
    gueltigAb: data.unternehmensDaten.tätigkeitsbeginn,
    datumMeldung: new Date().toISOString().split("T")[0]!,
    grundAnmeldungSchluessel: "01", // 01 = Neugründung. See https://www.xrepository.de/api/xrepository/urn:xoev-de:xgewerbeordnung:codeliste:grundfueranmeldung_3:technischerBestandteilGenericode
    bisherigeUnfallversicherung: undefined, // Not used as long as we only support 'grundAnmeldungSchluessel: "01"' (Neugründung)
    gewerbebetrieb: {
      gewerbebetriebID: randomUUID(),
      gemeindeMeldungNr: "2024 0001",
      rechtsformcode: "411000",
      eingetragenerName: "Muster GmbH",
      betriebsstaette: {
        artBetriebsstaette: "01",
        anschrift: {
          strasse: betriebsStrasseHausnummer.strasse,
          hausnummerVon: betriebsStrasseHausnummer.hausnummer,
          postleitzahl:
            adresseAbweichend?.postleitzahl || data.persönlicheDaten.adresse.postleitzahl,
          ort: adresseAbweichend?.ort || data.persönlicheDaten.adresse.ort,
        },
      },
      taetigkeitenGesamt: {
        schwerpunkt: {
          taetigkeitSchwerpunkt: data.unternehmensDaten.tätigkeitsbeschreibung,
          wirtschaftszweigschluessel: "47990",
        },
      },
      istNebenerwerb: data.unternehmensDaten.gewerbeart === "nebengewerbe",
      anzahlVollzeitBeschaeftigte: 0,
      anzahlTeilzeitBeschaeftigte: 0,
      istReisegewerbe: data.unternehmensDaten.istReisegewerbe,
      betriebArt: {
        industrie: data.unternehmensDaten.tätigkeitsbereich === "industrie",
        handwerk: data.unternehmensDaten.tätigkeitsbereich === "handwerk",
        handel: data.unternehmensDaten.tätigkeitsbereich === "handel",
        sonstiges: data.unternehmensDaten.tätigkeitsbereich === "sonstiges",
      },
    },
    referenzierteSubjekte: {
      natuerlichePerson: [
        {
          id: randomUUID(),
          name: {
            familienname: data.persönlicheDaten.nachname,
            vornamen: data.persönlicheDaten.vorname,
            geburtsname: data.persönlicheDaten.geburtsname,
          },
          geburt: {
            geburtsdatum: data.persönlicheDaten.geburtsdatum,
            ort: data.persönlicheDaten.geburtsort,
            staat: data.persönlicheDaten.geburtsland,
          },
          geschlecht: data.persönlicheDaten.geschlecht || "x",
          staatsangehoerigkeit: "000",
          anschrift: {
            strasse: personStrasseHausnummer.strasse,
            hausnummerVon: personStrasseHausnummer.hausnummer,
            postleitzahl: data.persönlicheDaten.adresse.postleitzahl,
            ort: data.persönlicheDaten.adresse.ort,
          },
          kommunikation: {
            telefon: data.persönlicheDaten.telefon,
            email: data.persönlicheDaten.email,
          },
        },
      ],
    },
  };
}
