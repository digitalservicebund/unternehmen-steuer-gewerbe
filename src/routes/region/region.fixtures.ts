// Client-level fixtures (pvogClient + ERiC Finanzamt lookup return values) for the scenarios
// covered by region.contract.test.ts. One level up from raw PVOG JSON: these are what
// getLocationsDetails/getGewerbeamt/getFinanzamtId themselves would resolve to, since those
// clients are what's mocked here (region.unit.test.ts already covers the route's own
// orchestration logic with synthetic data; these fixtures instead mirror the contract test's
// real PLZ/ARS scenarios). Not literal recordings of a live API response, since capturing those
// requires network/1Password access this environment doesn't have.
import type { Gewerbeamt } from "../../clients/pvogClient/getGewerbeamt";
import type { LocationDetails } from "../../clients/pvogClient/getLocationsDetails";
import type { z } from "@hono/zod-openapi";
import type { RegionResponseSchema } from "./regionInterfaces";

const ULM_TERMINVEREINBARUNG_URL = "http://www.ulm.de/mb";
const EGEWERBE_SH_URL =
  "https://am.schleswig-holstein.de/intelliform/forms/SH/standard/eGewerbe/eGewerbeAnmeldung/index";

type RegionResponseBody = z.infer<typeof RegionResponseSchema>;
type RegionOffice = RegionResponseBody["gewerbeaemter"][number];

export const plz25813Locations: LocationDetails[] = [
  { ars: "010540056056", name: "Husum", plz: "25813" },
  { ars: "010545453118", name: "Schwesing", plz: "25813" },
  { ars: "010545453119", name: "Ostenfeld", plz: "25813" },
  { ars: "010545453120", name: "Wobbenbüll", plz: "25813" },
];

export const plz25813FinanzamtIds = ["FA_HUSUM"];

export const plz89073Locations: LocationDetails[] = [
  { ars: "084210000000", name: "Ulm", plz: "89073" },
];

export const plz89073FinanzamtIds = ["FA_ULM"];

export const marktstrasse25813Locations: LocationDetails[] = [
  { ars: "010540056056", name: "Husum", plz: "25813", strasse: "Marktstraße" },
];

export const marktstrasse25813FinanzamtIds = ["FA_HUSUM"];

export const dorfstrasseLuetjenholmLocations: LocationDetails[] = [
  { ars: "010545494080", name: "Lütjenholm", plz: "25842", strasse: "Dorfstraße" },
];

export const dorfstrasseLuetjenholmFinanzamtIds = ["FA_NORDFRIESLAND"];

export const gewerbeamtFor = (name: string): Gewerbeamt => ({
  name,
  adresse: { strasse: "Amtstraße", hausnummer: "1", postleitzahl: "00000", ort: name },
  telefon: "0000 000000",
  email: "amt@example.de",
  onlineServices: [],
});

export const amtMittleresNordfrieslandGewerbeamt: Gewerbeamt = gewerbeamtFor(
  "Amt Mittleres Nordfriesland - Ordnungsabteilung",
);

export const finanzamtDetailsFor = (name: string) => ({
  name,
  hausanschrift: { strasse: "Finanzstraße", hausnummer: "1", postleitzahl: "00000", ort: name },
  telefonnummer: "0000 000000",
});

// Shared building blocks for the response bodies below - AKDB/PVOG return the same Finanzamt and
// the same Schleswig-Holstein "Einheitlicher Ansprechpartner" service description across several
// PLZ/ARS scenarios, so these mirror that real-world repetition rather than restating it per-fixture.
const finanzamtNordfriesland = {
  name: "Finanzamt Nordfriesland",
  strasseUndHausnummer: "Herzog-Adolf-Straße 18",
  postleitzahl: "25813",
  ort: "Husum",
  telefon: "04841 8949-0",
};

const leistungUeberEinheitlichenAnsprechpartner = {
  title: "Leistung über den Einheitlichen Ansprechpartner beantragen",
  description:
    "Für die Gewerbeanmeldung über den Einheitlichen Ansprechpartner Schleswig-Holstein steht Ihnen ein elektronischer Antrag (Antragsassistent) zur Verfügung",
  uri: EGEWERBE_SH_URL,
};

const amtVioelGewerbeamt: RegionOffice = {
  name: "Amt Viöl - Ordnungsamt - Bürgerservice",
  strasseUndHausnummer: "Westerende 41",
  postleitzahl: "25884",
  ort: "Viöl",
  telefon: "04843 2090-98",
  email: "Buergerservice@amt-vioel.de",
  onlineServices: [
    leistungUeberEinheitlichenAnsprechpartner,
    { title: "Gewerbe online anmelden", uri: EGEWERBE_SH_URL },
  ],
};

const einheitlicherAnsprechpartnerGewerbeamt = (zweiteLeistungTitel: string): RegionOffice => ({
  name: "Einheitlicher Ansprechpartner Schleswig-Holstein",
  strasseUndHausnummer: "Deliusstraße 10",
  postleitzahl: "24114",
  ort: "Kiel",
  telefon: "+49 431 530550-0",
  email: "info@ea-sh.de",
  onlineServices: [
    leistungUeberEinheitlichenAnsprechpartner,
    { title: zweiteLeistungTitel, uri: EGEWERBE_SH_URL },
  ],
});

const amtNordseeTreeneGewerbeamt: RegionOffice = {
  name: "Amt Nordsee-Treene",
  strasseUndHausnummer: "Schulweg 19",
  postleitzahl: "25866",
  ort: "Mildstedt",
  telefon: "04841 9920",
  email: "info@amt-nordsee-treene.de",
  onlineServices: [
    leistungUeberEinheitlichenAnsprechpartner,
    { title: "Gewerbe anmelden", uri: EGEWERBE_SH_URL },
  ],
};

// Full /api/v1/region/{plz} response bodies, recorded from a real run against the app
// (real PVOG lookups + the local, offline ERiC Finanzamt lookup) on 2026-07-17. Used by
// region.contract.test.ts for full-input/full-output comparisons; region.integration.test.ts
// keeps its own client-level mocks (above) and granular assertions.
export const plz25813GetAllOfficesResponse: RegionResponseBody = {
  supported: true,
  finanzaemter: [finanzamtNordfriesland],
  gewerbeaemter: [
    amtVioelGewerbeamt,
    einheitlicherAnsprechpartnerGewerbeamt("Gewerbe online anmelden direkt über Stadt Husum"),
    amtNordseeTreeneGewerbeamt,
    // Simonsberg and Südermarsch both fall under the same Amt as Ostenfeld/Mildstedt, hence the
    // duplicate entry - one per municipality (ARS), same as getLocationsDetails returns 4 for this PLZ.
    amtNordseeTreeneGewerbeamt,
  ],
};

export const plz89073DefaultResponse: RegionResponseBody = {
  supported: false,
  finanzaemter: [
    {
      name: "Finanzamt Ulm",
      strasseUndHausnummer: "Wagnerstr. 2",
      postleitzahl: "89077",
      ort: "Ulm",
      telefon: "0731/1030",
    },
  ],
  gewerbeaemter: [
    {
      name: "Bürgerdienste - Gewerbean-, um-, abmeldungen, Reisegewerbekarten, Gaststättenrecht, Gesundheitswesen, Waffen- und Sprengstoffwesen",
      strasseUndHausnummer: "Olgastraße 66",
      postleitzahl: "89073",
      ort: "Ulm",
      telefon: "+49 731 161 3216",
      email: "gewerbe@ulm.de",
      onlineServices: [
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
  ],
};

export const plz00000DefaultResponse: RegionResponseBody = {
  supported: false,
  finanzaemter: [],
  gewerbeaemter: [],
};

export const plz25813DefaultResponse: RegionResponseBody = {
  supported: true,
  finanzaemter: [finanzamtNordfriesland],
  gewerbeaemter: [amtVioelGewerbeamt],
};

export const plz25813Marktstrasse1Response: RegionResponseBody = {
  supported: true,
  finanzaemter: [finanzamtNordfriesland],
  gewerbeaemter: [
    einheitlicherAnsprechpartnerGewerbeamt("Gewerbe online anmelden direkt über Stadt Husum"),
  ],
};

export const plz25842DorfstrasseLutjenholmResponse: RegionResponseBody = {
  supported: true,
  finanzaemter: [finanzamtNordfriesland],
  gewerbeaemter: [
    {
      name: "Amt Mittleres Nordfriesland - Ordnungsabteilung",
      strasseUndHausnummer: "Theodor-Storm-Straße 2",
      postleitzahl: "25821",
      ort: "Bredstedt",
      telefon: "+49 4671 9192-0",
      email: "info@amnf.de",
      onlineServices: [
        leistungUeberEinheitlichenAnsprechpartner,
        {
          title: "Gewerbe online anmelden Amt Mittleres Nordfriesland",
          uri: EGEWERBE_SH_URL,
        },
      ],
    },
  ],
};
