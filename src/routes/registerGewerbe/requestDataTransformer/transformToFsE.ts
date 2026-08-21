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
  GRUENDUNGSART,
  ROLLE_KONTOINHABER,
  BANKKONTO_STEUERART,
} from "./fsECodes";

// FsE only allows digits in HausNr, so everything after the leading number — Zusatz, separator and
// a bis-Hausnummer — has to go into HausNrZu (e.g. "1C-1E" => hausNr "1", hausNrZu "C-1E")
function createHausNrZu(
  hausnummerZusatz: string | undefined,
  hausnummerBis: string | undefined,
): string | undefined {
  const bis = hausnummerBis === undefined ? "" : `-${hausnummerBis}`;
  const hausNrZu = `${hausnummerZusatz?.trim() ?? ""}${bis}`;
  return hausNrZu === "" ? undefined : hausNrZu;
}

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
        hausNrZu: createHausNrZu(betriebsAdresse.hausnummerZusatz, betriebsAdresse.hausnummerBis),
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

// FsE_EUn XSD: EigenerWebshop/OnlineMarktplaetze are JaTrueBaseSType (only "true" is a valid
// value), so "false" must be omitted rather than transmitted.
function getOnlinehandel({ onlinehandel }: RegisterGewerbeRequest["unternehmensDaten"]) {
  if (onlinehandel === undefined) return undefined;
  return {
    eigenerWebshop: onlinehandel.eigenerWebshop ? true : undefined,
    adresseEigenerWebshop: onlinehandel.adresseEigenerWebshop,
    onlineMarktplaetze: onlinehandel.onlineMarktplaetze ? true : undefined,
    onlineMarktplatz: onlinehandel.onlineMarktplatz,
  };
}

// FsE_EUn XSD: InfluencerUmsatz is JaTrueBaseSType (only "true" is a valid value), so "false"
// must be omitted rather than transmitted.
function getInfluencer({ influencer }: RegisterGewerbeRequest["unternehmensDaten"]) {
  if (influencer === undefined) return undefined;
  return {
    influencerUmsatz: influencer.influencerUmsatz ? true : undefined,
    plattform: influencer.plattform,
  };
}

type BankKontoEingabe = NonNullable<
  RegisterGewerbeRequest["unternehmensDaten"]["bankKonto"]
>["personensteuerkonto"];

// In FsE, domestic accounts go into "Iban"; foreign ones go into "IbanAusland" and also need
// a Bic (see FsE_EUn XSD: "BIC zur ausländischen IBAN"). Domestic IBANs start with the "DE"
// country code (ISO 13616); anything else is foreign.
function createBankKonto(konto: BankKontoEingabe, steuerart: string) {
  const istInland = konto.iban.slice(0, 2).toUpperCase() === "DE";
  return {
    ...(istInland ? { iban: konto.iban } : { ibanAusland: konto.iban, bic: konto.bic }),
    steuerart,
    kontoinhaber: {
      rolleKontoinhaber: ROLLE_KONTOINHABER[konto.kontoinhaber],
      abwKontoinhaber: konto.kontoinhaberName,
    },
  };
}

function getBankKonto({ unternehmensDaten: { bankKonto } }: RegisterGewerbeRequest) {
  if (bankKonto === undefined) return undefined;
  return [
    createBankKonto(bankKonto.personensteuerkonto, BANKKONTO_STEUERART.personensteuern),
    ...(bankKonto.betriebssteuerkonto
      ? [createBankKonto(bankKonto.betriebssteuerkonto, BANKKONTO_STEUERART.betriebssteuern)]
      : []),
  ];
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
                hausNrZu: createHausNrZu(
                  persönlicheStrasseHausnummer.hausnummerZusatz,
                  persönlicheStrasseHausnummer.hausnummerBis,
                ),
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
          // FsE GewerbeArt allows at most 200 characters
          gewerbeArt:
            data.unternehmensDaten.tätigkeitsbeschreibungKurz ??
            data.unternehmensDaten.tätigkeitsbeschreibung.slice(0, 200),
        },
        bankKonto: getBankKonto(data),
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
            gruendungsArt: GRUENDUNGSART[data.unternehmensDaten.gründungsart],
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
        onlinehandel: getOnlinehandel(data.unternehmensDaten),
        influencer: getInfluencer(data.unternehmensDaten),
      },
    },
  };
}
