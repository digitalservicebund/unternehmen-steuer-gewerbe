import {
  formatDatumDE,
  splitStrasseHausnummer,
  splitTelefonnummer,
} from "../../helpers/stringParsers";
import { type RegisterGewerbeRequest } from "./registerGewerbeInterfaces";
import { type ElsterFsEEUn } from "../../private/xmlBuilders/elsterFsE/elsterFsEEUn";

function toAnredeId(geschlecht: "d" | "w" | "m" | undefined): string | undefined {
  if (geschlecht === "m") return "1";
  if (geschlecht === "w") return "2";
  return undefined; // "d" (divers) hat keinen ELSTER-Code
}

export function transformToEUnFsE(data: RegisterGewerbeRequest): ElsterFsEEUn {
  const persönlicheStrasseHausnummer = splitStrasseHausnummer(
    data.persönlicheDaten.adresse.strasseUndHausnummer,
  );
  const { intVorw, natVorw, rufNr } = splitTelefonnummer(data.persönlicheDaten.telefon);

  return {
    transferHeader: {
      verfahren: "ElsterFSE",
      datenArt: "EUn",
      vorgang: "send-Auth",
      testmerker: "700000004",
      herstellerID: "74931",
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
      ordnungskriterium: { ordNrArt: "S" },
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
            // stNr: undefined,
            // religion: undefined,
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
        unternehmen: {
          entsprichtWohnanschrift: data.unternehmensDaten.adresseAbweichend === undefined,
        },
        betrBeginn: {
          betriebsbeginn: formatDatumDE(data.unternehmensDaten.tätigkeitsbeginn),
        },
        gruendungsangaben: {
          gruendungsForm: {
            gruendungsArt: "1",
            uebertrStichtag: undefined,
          },
        },
      },
      // festsetzungsAngaben: {
      //   voraussichtlicheEinkuenfte: {
      //     einkVermVerp: {
      //       gruendJahrA: undefined,
      //       folgeJahrA: undefined,
      //     },
      //   },
      // },
      gewinnErmittlgsAngaben: {
        gewinnErmittlung: undefined,
      },
      umsatzsteuer: {
        gesUmsatz: {
          gruendJahr: undefined,
          folgeJahr: undefined,
        },
        kleinunternehmerRegelung: {
          kleinUnternUSt: undefined,
        },
        zahllastUeberschuss: {
          auswahl: undefined,
          betrag: undefined,
        },
        durchschnittssatzbesteuerung: {
          merkerDurchschnittssatzbesteuerung: undefined,
          umsatzArt: undefined,
          inanspruchVerzicht: { anspruchDurchschnitt: undefined },
        },
      },
    },
  };
}
