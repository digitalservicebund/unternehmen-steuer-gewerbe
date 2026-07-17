// Client-level fixtures (pvogClient + ERiC Finanzamt lookup return values) for the scenarios
// covered by region.contract.test.ts. One level up from raw PVOG JSON: these are what
// getLocationsDetails/getGewerbeamt/getFinanzamtId themselves would resolve to, since those
// clients are what's mocked here (region.unit.test.ts already covers the route's own
// orchestration logic with synthetic data; these fixtures instead mirror the contract test's
// real PLZ/ARS scenarios). Not literal recordings of a live API response, since capturing those
// requires network/1Password access this environment doesn't have.
import type { Gewerbeamt } from "../../clients/pvogClient/getGewerbeamt";
import type { LocationDetails } from "../../clients/pvogClient/getLocationsDetails";

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
