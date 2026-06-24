import {
  formatDatumDE,
  splitStrasseHausnummer,
  splitTelefonnummer,
} from "../../../helpers/formFieldTransformations";
import { type RegisterGewerbeRequest } from "../registerGewerbeInterfaces";
import { type ElsterFsEEUn } from "@digitalservicebund/unternehmen-steuer-gewerbe-privat";
import { getSecret } from "../../../secrets";
import {
  RELIGIONSSCHLUESSEL,
  GEWINN_ERMITTLUNG,
  SOLL_IST_VERSTEUERUNG,
  ZAHLLAST_UEBERSCHUSS,
} from "./fsECodes";

function toAnredeId(geschlecht: "d" | "w" | "m" | undefined): string | undefined {
  if (geschlecht === "m") return "1";
  if (geschlecht === "w") return "2";
  return undefined; // "d" (divers) hat keinen ELSTER-Code
}

function getKleinunternehmerRegelung(data: RegisterGewerbeRequest) {
  return data.unternehmensDaten.kleinunternehmerRegelung
    ? { kleinUnternUSt: true }
    : { kleinUnternUStVerzicht: true };
}

function getUnternehmensAnschrift(data: RegisterGewerbeRequest) {
  const { adresseAbweichend } = data.unternehmensDaten;
  if (adresseAbweichend === undefined) {
    return { entsprichtWohnanschrift: true };
  }
  const { strasse, hausnummer, hausnummerBis } = splitStrasseHausnummer(
    adresseAbweichend.strasseUndHausnummer,
  );
  return {
    adrkette: {
      strAdr: {
        str: strasse,
        hausNr: hausnummer,
        hausNrZu: hausnummerBis,
        plz: adresseAbweichend.postleitzahl,
        ort: adresseAbweichend.ort,
      },
    },
  };
}

function getUstIdNr(data: RegisterGewerbeRequest) {
  if (data.unternehmensDaten.umsatzSteuerMitbeantragen === true)
    return {
      uStIdAntrag: {
        merkerAntragUStId: true,
      },
    };

  return undefined;
}

export function transformToEUnFsE(data: RegisterGewerbeRequest): ElsterFsEEUn {
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
      herstellerID: getSecret("ERIC_HERSTELLERID"),
      datenLieferant: "ERiC Projekt",
      datei: { verschluesselung: "CMSEncryptedData", kompression: "GZIP" },
      versionClient: "ERiC Beispiele",
    },
    nutzdatenHeader: {
      nutzdatenTicket: "11",
      empfaenger: { id: "F", value: "9198" },
    },
    eUn: {
      fragebogenTyp: "AUFNTAET",
      ordnungskriterium: {
        ordNrArt: data.persönlicheDaten.steuernummer ? "S" : "O",
      },
      allgAngaben: {
        inhaber: {
          natPers: {
            anredeId: toAnredeId(data.persönlicheDaten.geschlecht),
            vorname: data.persönlicheDaten.vorname,
            name: data.persönlicheDaten.nachname,
            //titel: undefined,
            gebName: data.persönlicheDaten.geburtsname,
            gebDat: formatDatumDE(data.persönlicheDaten.geburtsdatum),
            // berufsbez: undefined,
            // persIdNr: undefined,
            stNr: data.persönlicheDaten.steuernummer,
            religion: RELIGIONSSCHLUESSEL[data.persönlicheDaten.religion],
            adrkette: {
              strAdr: {
                str: persönlicheStrasseHausnummer.strasse,
                hausNr: persönlicheStrasseHausnummer.hausnummer,
                hausNrZu: persönlicheStrasseHausnummer.hausnummerBis,
                // adressErg: undefined,
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
        unternehmen: getUnternehmensAnschrift(data),
        betrBeginn: {
          betriebsbeginn: formatDatumDE(data.unternehmensDaten.tätigkeitsbeginn),
        },
        gruendungsangaben: {
          gruendungsForm: {
            gruendungsArt: "1",
            uebertrStichtag: formatDatumDE(data.unternehmensDaten.gründungsdatum),
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
        },
        zahllastUeberschuss: {
          auswahl: ZAHLLAST_UEBERSCHUSS[data.unternehmensDaten.zahllastUeberschussAuswahl],
          betrag: data.unternehmensDaten.zahllastUeberschussBetrag,
        },
        uStIdNr: getUstIdNr(data),
      },
    },
  };
}
