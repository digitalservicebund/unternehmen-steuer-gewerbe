// Raw PVOG response shapes for the scenarios covered by getGewerbeamt.contract.test.ts.
// Recorded from a real run against https://pvog.fitko.net (2026-07-17), trimmed to the fields
// getGewerbeamt.ts reads - the full responses also carry large HTML description/detail blocks
// that are irrelevant here.
//
// Drift: fraureuthPvogResponses is empty (identical shape to unknownArsPvogResponses) because
// PVOG no longer has any service description for ARS 146120000000 - confirming the original
// "unstable API" backlog comment. The scenario this fixture was meant for (a Gewerbeamt found,
// but with no online services) can no longer be produced from real data, so its test is skipped
// in both getGewerbeamt.contract.test.ts and getGewerbeamt.integration.test.ts.
import type { Gewerbeamt } from "./getGewerbeamt";

const ULM_TERMINVEREINBARUNG_URL = "http://www.ulm.de/mb";

export const ULM_ARS = "084210000000";
export const FRAUREUTH_ARS = "146120000000";
export const UNKNOWN_ARS = "000000000000";

export const ulmPvogResponses = {
  serviceDescriptions: {
    content: [{ id: "L100022.LB.496-99050012104000", ars: ["080000000000"] }],
  },
  serviceDescriptionDetail: {
    onlineServiceLinks: [
      {
        title: "Gewerbe anmelden",
        uri: "https://www.service-bw.de/onlineantraege/onlineantrag?prozessKey=m40169.gewerbe_anmelden_ludwigsburg&regionIds=2079&leistungId=496",
      },
      {
        title: "Gewerberegisteranzeige",
        description:
          "<p>\n\tZur Anmeldung bedarf es lediglich einer kurzen Registrierung als Benutzer des E-Bürgerdienstes Gewerbeanzeige. Mittels des daraufhin an Ihre angegeben E-Mail-Adresse gesandten Aktivierungscodes legitimieren Sie sich bitte als tatsächlich eingetragener Nutzer. Bei juristischen Personen schicken Sie uns bitte noch Ihren Handelsregisterauszug zu.</p>",
        uri: "https://aipkogema-ebd.dvvbw.de/ebd-gwr/index.jsp?ags=08421000",
      },
      {
        title: "Terminvereinbarung bei den Bürgerdiensten in der Olgastraße 66, 89073 Ulm",
        uri: ULM_TERMINVEREINBARUNG_URL,
      },
      {
        title: "Gewerbeanmeldung",
        uri: "https://gewerbe.komm.one/intelliform/forms/pool/Behoerde/Gewerbeverfahren/Gewerbeanmeldung/index?caller=084210000000",
      },
    ],
  },
  organisationUnits: [
    {
      id: "L100022.OE.6017613",
      title:
        "Bürgerdienste - Gewerbean-, um-, abmeldungen, Reisegewerbekarten, Gaststättenrecht, Gesundheitswesen, Waffen- und Sprengstoffwesen",
      role: { code: "01", name: "Zuständige Stelle und Ansprechpunkt" },
    },
  ],
  organisationUnitDetail: {
    title:
      "Bürgerdienste - Gewerbean-, um-, abmeldungen, Reisegewerbekarten, Gaststättenrecht, Gesundheitswesen, Waffen- und Sprengstoffwesen",
    location: {
      addresses: [
        { code: "001", street: "Olgastraße", houseNumber: "66", zip: "89073", city: "Ulm" },
      ],
      communications: [
        { code: "02", value: "+49 731 161 3216" },
        { code: "04", value: "+49 731 161 3211" },
        { code: "01", value: "gewerbe@ulm.de" },
      ],
    },
  },
};

export const fraureuthPvogResponses = {
  serviceDescriptions: { content: [] },
  serviceDescriptionDetail: { onlineServiceLinks: [] },
  organisationUnits: [],
  organisationUnitDetail: { title: "", location: { addresses: [], communications: [] } },
};

export const unknownArsPvogResponses = {
  serviceDescriptions: { content: [] },
  serviceDescriptionDetail: { onlineServiceLinks: [] },
  organisationUnits: [],
  organisationUnitDetail: { title: "", location: { addresses: [], communications: [] } },
};

// Expected getGewerbeamt() output for each scenario, i.e. ulmPvogResponses mapped through
// getGewerbeamt.ts's own logic (toAdresse, findCommunicationValue, the onlineServices map).
// Used by getGewerbeamt.contract.test.ts for full-input-in/full-output-out comparisons against
// the real API; getGewerbeamt.integration.test.ts keeps its own granular per-field assertions.
export const ulmGewerbeamt: Gewerbeamt = {
  name: "Bürgerdienste - Gewerbean-, um-, abmeldungen, Reisegewerbekarten, Gaststättenrecht, Gesundheitswesen, Waffen- und Sprengstoffwesen",
  adresse: { strasse: "Olgastraße", hausnummer: "66", postleitzahl: "89073", ort: "Ulm" },
  telefon: "+49 731 161 3216",
  email: "gewerbe@ulm.de",
  onlineServices: [
    {
      title: "Gewerbe anmelden",
      description: undefined,
      uri: "https://www.service-bw.de/onlineantraege/onlineantrag?prozessKey=m40169.gewerbe_anmelden_ludwigsburg&regionIds=2079&leistungId=496",
    },
    {
      title: "Gewerberegisteranzeige",
      description:
        "<p>\n\tZur Anmeldung bedarf es lediglich einer kurzen Registrierung als Benutzer des E-Bürgerdienstes Gewerbeanzeige. Mittels des daraufhin an Ihre angegeben E-Mail-Adresse gesandten Aktivierungscodes legitimieren Sie sich bitte als tatsächlich eingetragener Nutzer. Bei juristischen Personen schicken Sie uns bitte noch Ihren Handelsregisterauszug zu.</p>",
      uri: "https://aipkogema-ebd.dvvbw.de/ebd-gwr/index.jsp?ags=08421000",
    },
    {
      title: "Terminvereinbarung bei den Bürgerdiensten in der Olgastraße 66, 89073 Ulm",
      description: undefined,
      uri: ULM_TERMINVEREINBARUNG_URL,
    },
    {
      title: "Gewerbeanmeldung",
      description: undefined,
      uri: "https://gewerbe.komm.one/intelliform/forms/pool/Behoerde/Gewerbeverfahren/Gewerbeanmeldung/index?caller=084210000000",
    },
  ],
};

// Pre-drift intent for the skipped Fraureuth case (see comment above) - not derived from any
// real recording, since PVOG no longer returns this scenario at all.
export const fraureuthGewerbeamt: Gewerbeamt = {
  name: "Gewerbeamt",
  adresse: undefined,
  telefon: undefined,
  email: undefined,
  onlineServices: [],
};
