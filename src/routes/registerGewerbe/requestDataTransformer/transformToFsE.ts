import {
  formatDatumDE,
  getBetriebsAdresse,
  splitStrasseHausnummer,
  splitTelefonnummer,
} from "../../../helpers/formFieldTransformations";
import { type RegisterGewerbeRequest } from "../registerGewerbeInterfaces";
import { type ElsterFsEEUn } from "@digitalservicebund/unternehmen-steuer-gewerbe-privat";
import { getEnvironmentVariable } from "../../../secretsAndEnvironmentVariables";
import {
  RELIGIONSSCHLUESSEL,
  GEWINN_ERMITTLUNG,
  SOLL_IST_VERSTEUERUNG,
  IST_VERSTEUERUNG_GRUND,
  ZAHLLAST_UEBERSCHUSS,
} from "./fsECodes";

function getKleinunternehmerRegelung(data: RegisterGewerbeRequest) {
  return data.unternehmensDaten.kleinunternehmerRegelung
    ? { kleinUnternUSt: true }
    : { kleinUnternUStVerzicht: true };
}

function getUnternehmen(data: RegisterGewerbeRequest) {
  const { adresse, adresseAbweichend, geschäftsbezeichnung } = data.unternehmensDaten;
  if (adresse === undefined && adresseAbweichend === undefined) {
    return { entsprichtWohnanschrift: true, abwFirmenname: geschäftsbezeichnung };
  }
  const betriebsAdresse = getBetriebsAdresse({
    adresse,
    adresseAbweichend,
    persönlicheAdresse: data.persönlicheDaten.adresse,
  });
  return {
    abwFirmenname: geschäftsbezeichnung,
    adrkette: {
      strAdr: {
        str: betriebsAdresse.strasse,
        hausNr: betriebsAdresse.hausnummer,
        hausNrZu: betriebsAdresse.hausnummerBis,
        adressErg: betriebsAdresse.hausnummerZusatz?.trim(),
        plz: betriebsAdresse.postleitzahl,
        ort: betriebsAdresse.ort,
      },
    },
  };
}

function getUstIdNr(data: RegisterGewerbeRequest) {
  if (data.unternehmensDaten.umsatzsteuerIdMitbeantragen === true)
    return {
      uStIdAntrag: {
        merkerAntragUStId: true,
      },
    };

  return undefined;
}

function getIstVersteuerungGrund({
  istVersteuerungGrund,
}: RegisterGewerbeRequest["unternehmensDaten"]) {
  if (istVersteuerungGrund === undefined) {
    return {};
  }
  return { [IST_VERSTEUERUNG_GRUND[istVersteuerungGrund]]: true };
}

function getZahllastUeberschuss({
  zahllastUeberschussAuswahl,
  zahllastUeberschussBetrag,
}: RegisterGewerbeRequest["unternehmensDaten"]) {
  return {
    auswahl: ZAHLLAST_UEBERSCHUSS[zahllastUeberschussAuswahl],
    betrag: zahllastUeberschussBetrag,
  };
}

function ensureEricHerstellerId() {
  if (getEnvironmentVariable("ERIC_HERSTELLERID") === "")
    throw new Error("ERIC_HERSTELLERID not set");
}
// run once so we fail on start if not set
ensureEricHerstellerId();

function determineFinanzamtIdOrDefault(id?: string): string {
  if (!id) return defaultFinanzamtId;
  if (getEnvironmentVariable("ERIC_ENABLE_CUSTOM_FINANZAMT_IDS") !== "true")
    return defaultFinanzamtId;

  return id;
}

// default from ERiC docs
export const defaultFinanzamtId = "9198";

export function transformToEUnFsE(
  data: RegisterGewerbeRequest,
  finanzamtId?: string,
): ElsterFsEEUn {
  const persönlicheStrasseHausnummer = splitStrasseHausnummer(
    data.persönlicheDaten.adresse.strasseUndHausnummer,
  );
  const { intVorw, natVorw, rufNr } = splitTelefonnummer(data.persönlicheDaten.telefon);

  // All the commented-out fields are not required, technically. But I assume some of them
  // have an impact on taxes, etc., so I am not sure what we can really leave out at the moment.
  // I wanted to keep them in to have it visible
  return {
    transferHeader: {
      verfahren: "ElsterFSE",
      datenArt: "EUn",
      vorgang: "send-Auth",
      testmerker: "700000004",
      herstellerID: getEnvironmentVariable("ERIC_HERSTELLERID"),
      datenLieferant: "ERiC Projekt",
      datei: { verschluesselung: "CMSEncryptedData", kompression: "GZIP" },
      versionClient: "ERiC Beispiele",
    },
    nutzdatenHeader: {
      nutzdatenTicket: "11",
      empfaenger: {
        id: "F",
        value: determineFinanzamtIdOrDefault(finanzamtId),
      },
    },
    eUn: {
      fragebogenTyp: "AUFNTAET",
      ordnungskriterium: {
        ordNrArt: data.persönlicheDaten.steuernummer ? "S" : "O",
      },
      allgAngaben: {
        inhaber: {
          natPers: {
            vorname: data.persönlicheDaten.vorname,
            name: data.persönlicheDaten.nachname,
            //titel: undefined,
            gebName: data.persönlicheDaten.geburtsname,
            gebDat: formatDatumDE(data.persönlicheDaten.geburtsdatum),
            // berufsbez: undefined,
            persIdNr: data.persönlicheDaten.steuerId,
            stNr: data.persönlicheDaten.steuernummer,
            religion: RELIGIONSSCHLUESSEL[data.persönlicheDaten.religion],
            adrkette: {
              strAdr: {
                str: persönlicheStrasseHausnummer.strasse,
                hausNr: persönlicheStrasseHausnummer.hausnummer,
                hausNrZu: persönlicheStrasseHausnummer.hausnummerBis,
                adressErg: persönlicheStrasseHausnummer.hausnummerZusatz?.trim(),
                plz: data.persönlicheDaten.adresse.postleitzahl,
                ort: data.persönlicheDaten.adresse.ort,
              },
              // auslAdr: {
              //   str: undefined,
              //   hausNr: undefined,
              //   hausNrZu: undefined,
              //   adressErg: undefined,
              //   auslPlz: undefined,
              //   ort: undefined,
              //   staatId: undefined,
              // },
            },
            // standEhe: {
            //   merker: undefined,
            //   von: undefined
            // },
          },
        },
        // ehegatte: {
        //   natPers: {
        //     anredeId: undefined,
        //     vorname: undefined,
        //     name: undefined,
        //     gebName: undefined,
        //     gebDat: undefined,
        //     berufsbez: undefined,
        //     persIdNr: undefined,
        //     religion: undefined,
        //     adrkette: {
        //       strAdr: {
        //         str: undefined,
        //         hausNr: undefined,
        //         hausNrZu: undefined,
        //         adressErg: undefined,
        //         plz: undefined,
        //         ort: undefined,
        //       },
        //     },
        //   },
        // },
        komm: {
          tel: [
            {
              intVorw,
              natVorw,
              rufNr,
            },
          ],
          web: {
            adresse: undefined,
          },
        },
        artTaet: {
          gewerbeArt: data.unternehmensDaten.tätigkeitsbeschreibung,
        },
        // bankKonto: {
        //   iban: undefined,
        //   steuerart: undefined,
        //   kontoinhaber: {
        //     rolleKontoinhaber: undefined
        //   },
        // },
        // steuerberater: {
        //   natPers: {
        //     anredeId: undefined,
        //     vorname: undefined,
        //     name: undefined,
        //     vorsatz: undefined,
        //     zusatz: undefined,
        //     adrkette: {
        //       auslAdr: {
        //         str: undefined,
        //         hausNr: undefined,
        //         hausNrZu: undefined,
        //         adressErg: undefined,
        //         auslPlz: undefined,
        //         ort: undefined,
        //         staatId: undefined,
        //       },
        //       postfAdr: { postfach: undefined, plz: undefined, ort: undefined },
        //     },
        //     komm: {
        //       tel: [
        //         { intVorw: undefined, natVorw: undefined, rufNr: undefined },
        //         { intVorw: undefined, natVorw: undefined, rufNr: undefined },
        //       ],
        //     },
        //   },
        // },
        // empfangsbev: {
        //   empfBevollmSteuerberater: undefined,
        //   natPers: {
        //     anredeId: undefined,
        //     vorname: undefined,
        //     name: undefined,
        //     adrkette: {
        //       strAdr: {
        //         str: undefined,
        //         hausNr: undefined,
        //         hausNrZu: undefined,
        //         adressErg: undefined,
        //         plz: undefined,
        //         ort: undefined,
        //       },
        //     },
        //     komm: { tel: [{ intVorw: undefined, natVorw: undefined, rufNr: undefined }] },
        //   },
        // },
        // bisherigeVerhaeltnisse: {
        //   adrkette: {
        //     strAdr: {
        //       str: undefined,
        //       hausNr: undefined,
        //       hausNrZu: undefined,
        //       adressErg: undefined,
        //       plz: undefined,
        //       ort: undefined,
        //     },
        //   },
        // },
      },
      betrieb: {
        unternehmen: getUnternehmen(data),
        betrBeginn: {
          betriebsbeginn: formatDatumDE(data.unternehmensDaten.anmeldedatumFinanzamt),
        },
        gruendungsangaben: {
          gruendungsForm: {
            gruendungsArt: "1",
            uebertrStichtag: formatDatumDE(data.unternehmensDaten.anmeldedatumFinanzamt),
          },
        },
      },
      festsetzungsAngaben: {
        voraussichtlicheEinkuenfte: {
          einkGewBetr: {
            gruendJahrA: data.unternehmensDaten.gewinnGründungsjahr,
            folgeJahrA: data.unternehmensDaten.gewinnFolgejahr,
          },
        },
      },
      gewinnErmittlgsAngaben: {
        gewinnErmittlung: GEWINN_ERMITTLUNG[data.unternehmensDaten.gewinnErmittlung],
      },
      umsatzsteuer: {
        gesUmsatz: {
          gruendJahr: data.unternehmensDaten.umsatzGruendungsjahr,
          folgeJahr: data.unternehmensDaten.umsatzFolgejahr,
        },
        kleinunternehmerRegelung: getKleinunternehmerRegelung(data),
        sollIstVersteuerung: {
          auswahlSollIstVerst: SOLL_IST_VERSTEUERUNG[data.unternehmensDaten.sollIstVersteuerung],
          ...getIstVersteuerungGrund(data.unternehmensDaten),
        },
        zahllastUeberschuss: getZahllastUeberschuss(data.unternehmensDaten),
        uStIdNr: getUstIdNr(data),
      },
    },
  };
}
