import { randomUUID } from "node:crypto";
import { type CreateGewerbeanmeldungXmlData } from "../../../xmlBuilders/xGewerbeordnung/gewerbeanmeldung";
import { type RegisterGewerbeRequest } from "../registerGewerbeInterfaces";
import { type GewerbeRoutingInfo } from "../getGewerbeRoutingInfo";
import { splitStrasseHausnummer } from "../../../helpers/formFieldTransformations";
import {
  VERTRAUENSNIVEAU,
  RECHTSFORM,
  STAATSANGEHOERIGKEIT,
  HAMBURG_GEMEINDESCHLUESSEL,
  HAMBURG_STADTBEZIRK_PLZ,
} from "./xGewerbeordnungCodes";
import { Anschrift } from "../../../xmlBuilders/xGewerbeordnung/buildingBlocks/anschrift";

// xGewerbeordnung has no separate field for the Hausnummer-Zusatz, so it is appended to
// hausnummerVon directly (e.g. "21a")
function joinHausnummerUndZusatz(
  hausnummer: string | undefined,
  zusatz: string | undefined,
): string {
  return `${hausnummer ?? ""}${zusatz ?? ""}`;
}

function getBetriebsAnschriftWithFallbackToPersönlicheDaten(
  adresseAbweichend: RegisterGewerbeRequest["unternehmensDaten"]["adresseAbweichend"],
  privateAdresse: RegisterGewerbeRequest["persönlicheDaten"]["adresse"],
): Anschrift {
  const betriebsAdresse = adresseAbweichend ?? privateAdresse;
  const { strasse, hausnummer, hausnummerBis, hausnummerZusatz } = splitStrasseHausnummer(
    betriebsAdresse.strasseUndHausnummer,
  );
  return {
    strasse,
    hausnummerVon: joinHausnummerUndZusatz(hausnummer, hausnummerZusatz),
    hausnummerBis,
    postleitzahl: betriebsAdresse.postleitzahl,
    ort: betriebsAdresse.ort,
  };
}

/**
 * Resolves the Gemeindeschlüssel-Ergänzung Code for Hamburg.
 * Returns undefined for non-Hamburg municipalities
 */
function getGemeindeschluesselErgaenzung(
  gemeindeSchluessel: string,
  betriebsPlz: string | undefined,
) {
  if (betriebsPlz === undefined || gemeindeSchluessel !== HAMBURG_GEMEINDESCHLUESSEL) {
    return undefined;
  }

  for (const [gemeindeschluesselErgaenzung, plzList] of Object.entries(HAMBURG_STADTBEZIRK_PLZ)) {
    if (plzList.includes(betriebsPlz)) {
      return gemeindeschluesselErgaenzung;
    }
  }

  return undefined;
}

// Transforms a RegisterGewerbeRequest into a complete Gewerbeanmeldung structure.
// NOTE: several values are hardcoded placeholders and will be generated / fetched from other sources later.
export function transformToGewerbeanmeldung(
  data: RegisterGewerbeRequest,
  routingInfo: GewerbeRoutingInfo,
): CreateGewerbeanmeldungXmlData {
  const personStrasseHausnummer = splitStrasseHausnummer(
    data.persönlicheDaten.adresse.strasseUndHausnummer,
  );

  const betriebsAnschrift = getBetriebsAnschriftWithFallbackToPersönlicheDaten(
    data.unternehmensDaten.adresseAbweichend,
    data.persönlicheDaten.adresse,
  );

  const gemeindeSchluessel = routingInfo.ags;
  const gewerbeamtKennung = `MELDID:${gemeindeSchluessel}`;
  const gewerbeamtName = routingInfo.gewerbeamt.name || "Gewerbeamt";
  const personId = randomUUID();

  return {
    nachrichtenkopf: {
      nachrichtenUUID: randomUUID(),
      erstellungszeitpunkt: new Date().toISOString(),
      leser: { kennung: gewerbeamtKennung, name: gewerbeamtName },
      autor: { kennung: "ds:schnellergruenden", name: "Schneller Gründen" },
    },
    autor: { kennung: gewerbeamtKennung, name: gewerbeamtName },
    anzeigerenderId: personId,
    handelndePersonId: personId,
    handelndePersonVertrauensniveauCode: VERTRAUENSNIVEAU[data.persönlicheDaten.vertrauensniveau],
    satzErstellung: new Date().toISOString(),
    ereigniszeitpunkt: new Date().toISOString(),
    istStorno: false,
    gemeindeSchluessel,
    gemeindeschluesselErgaenzung: getGemeindeschluesselErgaenzung(
      gemeindeSchluessel,
      betriebsAnschrift.postleitzahl,
    ),
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
        anschrift: betriebsAnschrift,
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
            ort: data.persönlicheDaten.geburtsort ?? "keine Angabe",
            staat: data.persönlicheDaten.geburtsland,
          },
          geschlecht: data.persönlicheDaten.geschlecht ?? "x",
          staatsangehoerigkeit: STAATSANGEHOERIGKEIT[data.persönlicheDaten.staatsangehörigkeit],
          anschrift: {
            strasse: personStrasseHausnummer.strasse,
            hausnummerVon: joinHausnummerUndZusatz(
              personStrasseHausnummer.hausnummer,
              personStrasseHausnummer.hausnummerZusatz,
            ),
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
