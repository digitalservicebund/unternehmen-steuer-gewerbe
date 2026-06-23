import { randomUUID } from "node:crypto";
import { type CreateGewerbeanmeldungXmlData } from "../../../xmlBuilders/xGewerbeordnung/gewerbeanmeldung";
import { type RegisterGewerbeRequest } from "../registerGewerbeInterfaces";
import { type GewerbeRoutingInfo } from "../getGewerbeRoutingInfo";
import { splitStrasseHausnummer } from "../../../helpers/formFieldTransformations";
import {
  VERTRAUENSNIVEAU,
  RECHTSFORM,
  STAATSANGEHOERIGKEIT,
  getGemeindeschluesselErgaenzung,
} from "./xGewerbeordnungCodes";

// Transforms a RegisterGewerbeRequest into a complete Gewerbeanmeldung structure.
// NOTE: several values are hardcoded placeholders and will be generated / fetched from other sources later.
export function transformToGewerbeanmeldung(
  data: RegisterGewerbeRequest,
  routingInfo: GewerbeRoutingInfo,
): CreateGewerbeanmeldungXmlData {
  const adresseAbweichend = data.unternehmensDaten.adresseAbweichend;

  const betriebsStrasseHausnummer = splitStrasseHausnummer(
    adresseAbweichend?.strasseUndHausnummer ?? data.persönlicheDaten.adresse.strasseUndHausnummer,
  );
  const personStrasseHausnummer = splitStrasseHausnummer(
    data.persönlicheDaten.adresse.strasseUndHausnummer,
  );

  const betriebsPlz = adresseAbweichend?.postleitzahl ?? data.persönlicheDaten.adresse.postleitzahl;

  const gemeindeSchluessel = routingInfo.ags;
  const autorKennung = `MELDID:${gemeindeSchluessel}`;
  const personId = randomUUID();

  return {
    nachrichtenkopf: {
      nachrichtenUUID: randomUUID(),
      erstellungszeitpunkt: new Date().toISOString(),
      leser: { kennung: "xga:000000000001", name: "Gewerbeamt Muster" },
      autor: { kennung: "ds:schnellergruenden", name: "Schneller Gründen" },
    },
    autor: { kennung: autorKennung, name: "Behörde" },
    anzeigerenderId: personId,
    handelndePersonId: personId,
    handelndePersonVertrauensniveauCode: VERTRAUENSNIVEAU[data.persönlicheDaten.vertrauensniveau],
    satzErstellung: new Date().toISOString(),
    ereigniszeitpunkt: new Date().toISOString(),
    istStorno: false,
    gemeindeSchluessel,
    gemeindeschluesselErgaenzung: getGemeindeschluesselErgaenzung(gemeindeSchluessel, betriebsPlz),
    uuid: randomUUID(),
    gueltigAb: data.unternehmensDaten.tätigkeitsbeginn,
    datumMeldung: new Date().toISOString().split("T")[0]!,
    grundAnmeldungSchluessel: "01", // 01 = Neugründung. See https://www.xrepository.de/api/xrepository/urn:xoev-de:xgewerbeordnung:codeliste:grundfueranmeldung_3:technischerBestandteilGenericode
    bisherigeUnfallversicherung: undefined, // Not used as long as we only support 'grundAnmeldungSchluessel: "01"' (Neugründung)
    gewerbebetrieb: {
      gewerbebetriebID: randomUUID(),
      gemeindeMeldungNr: "2024 0001",
      rechtsformcode: RECHTSFORM.nichtEingetragenesEinzelunternehmen,
      // We currently only support non-registered sole proprietorships (412000), which must
      // not carry a registered name (SCH-0205), so eingetragenerName stays undefined.
      eingetragenerName: undefined,
      betriebsstaette: {
        artBetriebsstaette: "01",
        anschrift: {
          strasse: betriebsStrasseHausnummer.strasse,
          hausnummerVon: betriebsStrasseHausnummer.hausnummer,
          hausnummerBis: betriebsStrasseHausnummer.hausnummerBis,
          postleitzahl: betriebsPlz,
          ort: adresseAbweichend?.ort ?? data.persönlicheDaten.adresse.ort,
        },
      },
      taetigkeitenGesamt: {
        schwerpunkt: {
          taetigkeitSchwerpunkt: data.unternehmensDaten.tätigkeitsbeschreibung,
        },
      },
      istNebenerwerb: data.unternehmensDaten.gewerbeart === "nebengewerbe",
      anzahlVollzeitBeschaeftigte: 0,
      anzahlTeilzeitBeschaeftigte: 0,
      // For later: this property has a cross-relation to artNiederlassung (which we don't have, right now)
      istReisegewerbe: false,
      beteiligungOeffentlicheHand: "0",
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
          id: personId,
          name: {
            familienname: data.persönlicheDaten.nachname,
            geburtsname: data.persönlicheDaten.geburtsname,
            vornamen: data.persönlicheDaten.vorname,
          },
          geburt: {
            geburtsdatum: data.persönlicheDaten.geburtsdatum,
            ort: data.persönlicheDaten.geburtsort,
            staat: data.persönlicheDaten.geburtsland,
          },
          geschlecht: data.persönlicheDaten.geschlecht ?? "x",
          staatsangehoerigkeit: STAATSANGEHOERIGKEIT[data.persönlicheDaten.staatsangehörigkeit],
          anschrift: {
            strasse: personStrasseHausnummer.strasse,
            hausnummerVon: personStrasseHausnummer.hausnummer,
            hausnummerBis: personStrasseHausnummer.hausnummerBis,
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
