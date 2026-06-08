import { randomUUID } from "node:crypto";
import { type CreateGewerbeanmeldungXmlData } from "../../../xmlBuilders/xGewerbeordnung/gewerbeanmeldung";
import { type RegisterGewerbeRequest } from "../registerGewerbeInterfaces";
import { splitStrasseHausnummer } from "../../../helpers/formFieldTransformations";
import { getAGSandARS } from "../../../clients/pvogClient/pvogClient";
import { VERTRAUENSNIVEAU, RECHTSFORM } from "./xGewerbeordnungCodes";

// Transforms a RegisterGewerbeRequest into a complete Gewerbeanmeldung structure.
// NOTE: several values are hardcoded placeholders and will be generated / fetched from other sources later.
export async function transformToGewerbeanmeldung(
  data: RegisterGewerbeRequest,
): Promise<CreateGewerbeanmeldungXmlData> {
  const adresseAbweichend = data.unternehmensDaten.adresseAbweichend;

  const betriebsStrasseHausnummer = splitStrasseHausnummer(
    adresseAbweichend?.strasseUndHausnummer ?? data.persönlicheDaten.adresse.strasseUndHausnummer,
  );
  const personStrasseHausnummer = splitStrasseHausnummer(
    data.persönlicheDaten.adresse.strasseUndHausnummer,
  );

  const gemeindeSchluessel = await getAgsFromRegisterGewerbeRequestData(data);

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
    uuid: randomUUID(),
    gueltigAb: data.unternehmensDaten.tätigkeitsbeginn,
    datumMeldung: new Date().toISOString().split("T")[0]!,
    grundAnmeldungSchluessel: "01", // 01 = Neugründung. See https://www.xrepository.de/api/xrepository/urn:xoev-de:xgewerbeordnung:codeliste:grundfueranmeldung_3:technischerBestandteilGenericode
    bisherigeUnfallversicherung: undefined, // Not used as long as we only support 'grundAnmeldungSchluessel: "01"' (Neugründung)
    gewerbebetrieb: {
      gewerbebetriebID: randomUUID(),
      gemeindeMeldungNr: "2024 0001",
      rechtsformcode: RECHTSFORM[data.unternehmensDaten.rechtsform],
      // A non-registered sole proprietorship must not carry a registered name (SCH-0205),
      // so the provided eingetragenerName is ignored for that legal form.
      eingetragenerName:
        data.unternehmensDaten.rechtsform === "nichtEingetragenesEinzelunternehmen"
          ? undefined
          : data.unternehmensDaten.eingetragenerName,
      betriebsstaette: {
        artBetriebsstaette: "01",
        anschrift: {
          strasse: betriebsStrasseHausnummer.strasse,
          hausnummerVon: betriebsStrasseHausnummer.hausnummer,
          hausnummerBis: betriebsStrasseHausnummer.hausnummerBis,
          postleitzahl:
            adresseAbweichend?.postleitzahl ?? data.persönlicheDaten.adresse.postleitzahl,
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
          staatsangehoerigkeit: "000",
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

async function getAgsFromRegisterGewerbeRequestData(data: RegisterGewerbeRequest): Promise<string> {
  if (data.unternehmensDaten.adresseAbweichend?.postleitzahl)
    return (await getAGSandARS(data.unternehmensDaten.adresseAbweichend.postleitzahl)).ags;
  else return (await getAGSandARS(data.persönlicheDaten.adresse.postleitzahl)).ags;
}
