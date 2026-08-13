import { type RegisterGewerbeRequest } from "./registerGewerbeInterfaces";
import { type CreateGewerbeanmeldungXmlData } from "../../xmlBuilders/xGewerbeordnung/gewerbeanmeldung";
import { type GewerbeRoutingInfo } from "./getGewerbeRoutingInfo";

export const registerGewerbeSampleRequestAllFieldsFilled: RegisterGewerbeRequest = {
  persönlicheDaten: {
    vorname: "Erika",
    nachname: "Mustermann",
    geburtsname: "Muster",
    geburtsdatum: "1988-09-10",
    geburtsort: "Musterstadt",
    geburtsland: "Deutschland",
    geschlecht: "keineAngabe",
    staatsangehörigkeit: "deutsch",
    adresse: {
      strasseUndHausnummer: "Musterstraße 1 a",
      postleitzahl: "03046",
      ort: "Cottbus",
    },
    telefon: "+49 234 121314",
    email: "e.mustermann@example.org",
    steuerId: "06646829576",
    religion: "nichtKirchensteuerpflichtig",
    vertrauensniveau: "substantiell",
  },
  unternehmensDaten: {
    tätigkeitsbeschreibung: "Vertrieb von Vertriebsmustern",
    tätigkeitsbeschreibungKurz: "Vertrieb von Mustern",
    tätigkeitsbereich: "handwerk",
    anmeldedatumFinanzamt: "2026-04-17",
    anmeldedatumGewerbeamt: "2026-05-18",
    gewerbeart: "hauptgewerbe",
    istReisegewerbe: false,
    rechtsform: "nichtEingetragenesEinzelunternehmen",
    gründungsart: "neugründung",
    artBetriebsstaette: "hauptniederlassung",
    beteiligungOeffentlicheHand: "nein",
    anzahlVollzeitBeschaeftigte: 2,
    anzahlTeilzeitBeschaeftigte: 1,
    gewinnErmittlung: "einnahmenüberschussrechnung",
    kleinunternehmerRegelung: false,
    umsatzGruendungsjahr: 1,
    umsatzFolgejahr: 1,
    gewinnGründungsjahr: 1,
    gewinnFolgejahr: 1,
    sollIstVersteuerung: "sollVersteuerung",
    zahllastUeberschussBetrag: 0,
    zahllastUeberschussAuswahl: "zahllast",
    umsatzsteuerImErstenJahr: -222,
    adresseAbweichend: {
      strasseUndHausnummer: "Musterstraße 2 a",
      postleitzahl: "96450",
      ort: "Coburg",
    },
    geschäftsbezeichnung: "Musterhandel",
    umsatzsteuerIdMitbeantragen: true,
  },
};

export function gewerbeanmeldungFixture(): CreateGewerbeanmeldungXmlData {
  const personId = "3f2b1b8e-6a51-4d0f-9f3f-2a5f0f0a1b2c";

  return {
    anzeigerenderId: personId,
    handelndePersonId: personId,
    handelndePersonVertrauensniveauCode: "20",
    istStorno: false,
    gemeindeSchluessel: "11000000",
    uuid: "dcfb0861-396d-4551-a995-9fedbed0e68b",
    gueltigAb: "2026-01-01",
    datumMeldung: "2020-08-26",
    grundAnmeldungSchluessel: "01",
    gewerbebetrieb: {
      gewerbebetriebID: "6b0c0b4e-2f7a-4f2a-9c0f-1d2e3f4a5b6c",
      rechtsformcode: "412000",
      geschaeftsbezeichnung: "Max Mustermann Textil & Design",
      betriebsstaette: {
        artBetriebsstaette: "01",
        anschrift: {
          strasse: "Betriebsweg",
          hausnummerVon: "2",
          postleitzahl: "12345",
          ort: "Musterstadt",
        },
      },
      taetigkeitenGesamt: {
        schwerpunkt: { taetigkeitSchwerpunkt: "Mustertätigkeit" },
      },
      istNebenerwerb: false,
      anzahlVollzeitBeschaeftigte: 1,
      anzahlTeilzeitBeschaeftigte: 0,
      istReisegewerbe: false,
      beteiligungOeffentlicheHand: "0",
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
          id: personId,
          name: {
            familienname: "Mustermann",
            vornamen: "Max",
            geburtsname: "Musterfrau",
          },
          geburt: {
            geburtsdatum: "1980-01-12",
            ort: "Musterstadt",
            staat: "Deutschland",
          },
          geschlecht: "x",
          staatsangehoerigkeit: "000",
          anschrift: {
            strasse: "Musterstraße",
            hausnummerVon: "1",
            postleitzahl: "12345",
            ort: "Musterstadt",
          },
          kommunikation: {
            telefon: "+49 123 456789",
            email: "max@mustermann.de",
          },
        },
      ],
    },
  };
}

export function gewerbeRoutingInfoFixture(): GewerbeRoutingInfo {
  return {
    ags: "11000000",
    ars: "110000000000",
    gewerbeamt: { name: "Ordnungsamt Musterstadt" },
    fitConnectDestinationInformation: {
      destinationId: "d0d0c0de-0000-4000-8000-000000000000",
    },
  };
}
