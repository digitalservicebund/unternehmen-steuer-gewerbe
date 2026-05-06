import { type RegisterGewerbeRequest } from "./registerGewerbeInterfaces";

export const registerGewerbeCompleteRequest: RegisterGewerbeRequest = {
  persönlicheDaten: {
    vorname: "Erika",
    nachname: "Mustermann",
    geburtsname: "Muster",
    geburtsdatum: "1988-09-10",
    geschlecht: "d",
    geburtsort: "Musterstadt",
    geburtsland: "Deutschland",
    staatsangehörigkeitDeutsch: true,
    adresse: {
      strasseUndHausnummer: "Musterstraße 1",
      postleitzahl: "12345",
      ort: "Musterstadt",
    },
    telefon: "+49 234 121314",
    email: "e.mustermann@example.org",
    religion: "nichtKirchensteuerpflichtig",
  },
  unternehmensDaten: {
    tätigkeitsbeschreibung: "Vertrieb von Vertriebsmustern",
    tätigkeitsbereich: "handwerk",
    tätigkeitsbeginn: "2026-04-17",
    gewerbeart: "hauptgewerbe",
    gewinnErmittlung: "einnahmenüberschussrechnung",
    kleinunternehmerRegelung: false,
    umsatzGruendungsjahr: 1,
    umsatzFolgejahr: 1,
    sollIstVersteuerung: "sollVersteuerung",
    zahllastUeberschussAuswahl: "zahllast",
    zahllastUeberschussBetrag: 0,
    adresseAbweichend: {
      strasseUndHausnummer: "Musterstraße 2",
      postleitzahl: "67890",
      ort: "Musterstadt",
    },
  },
};
