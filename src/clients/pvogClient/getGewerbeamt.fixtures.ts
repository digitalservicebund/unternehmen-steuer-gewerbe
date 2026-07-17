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
          "Zur Anmeldung bedarf es lediglich einer kurzen Registrierung als Benutzer des E-Bürgerdienstes Gewerbeanzeige.",
        uri: "https://aipkogema-ebd.dvvbw.de/ebd-gwr/index.jsp?ags=08421000",
      },
      {
        title: "Terminvereinbarung bei den Bürgerdiensten in der Olgastraße 66, 89073 Ulm",
        uri: "http://www.ulm.de/mb",
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
