// Raw PVOG /v3/locations responses for the scenarios covered by getLocationsDetails.contract.test.ts.
// Recorded from a real run against https://pvog.fitko.net (2026-07-17), trimmed to the fields
// LocationDetails declares (the real responses also carry arsFederalstate/koordinaten/hausnummer,
// which getLocationsDetails's return type doesn't expose).
import type { LocationDetails } from "./getLocationsDetails";

export const ulmLocations: LocationDetails[] = [
  { ars: "084210000000", name: "Ulm, Donau 'Mitte'", plz: "89073", gemeinde: "Ulm" },
];

export const plz25813AllMunicipalities: LocationDetails[] = [
  { ars: "010545453118", name: "Schwesing", plz: "25813", gemeinde: "Schwesing" },
  { ars: "010540056056", name: "Husum, Nordsee", plz: "25813", gemeinde: "Husum" },
  {
    ars: "010545492120",
    name: "Simonsberg bei Husum, Nordsee",
    plz: "25813",
    gemeinde: "Simonsberg",
  },
  {
    ars: "010545492132",
    name: "Südermarsch bei Husum, Nordsee",
    plz: "25813",
    gemeinde: "Südermarsch",
  },
];

export const plz25813Narrowed: LocationDetails[] = [
  {
    ars: "010540056056",
    name: "Husum, Nordsee",
    plz: "25813",
    strasse: "Marktstraße",
    gemeinde: "Husum",
  },
];

export const dorfstrasse25842WithoutOrt: LocationDetails[] = [
  {
    ars: "010545494093",
    name: "Ockholm",
    plz: "25842",
    strasse: "Dorfstraße",
    gemeinde: "Ockholm",
  },
  {
    ars: "010545494080",
    name: "Lütjenholm",
    plz: "25842",
    strasse: "Dorfstraße",
    gemeinde: "Lütjenholm",
  },
  {
    ars: "010545494075",
    name: "Langenhorn bei Husum, Nordsee",
    plz: "25842",
    strasse: "Dorfstraße",
    gemeinde: "Langenhorn",
  },
];

export const dorfstrasse25842WithOrt: LocationDetails[] = [
  {
    ars: "010545494080",
    name: "Lütjenholm",
    plz: "25842",
    strasse: "Dorfstraße",
    gemeinde: "Lütjenholm",
  },
];

export const plz17337Locations: LocationDetails[] = [
  { ars: "130755560042", name: "Groß Luckow", plz: "17337", gemeinde: "Groß Luckow" },
  { ars: "120730579579", name: "Uckerland 'Jagow'", plz: "17337", gemeinde: "Uckerland" },
  { ars: "130715164132", name: "Schönhausen, Mecklenburg", plz: "17337", gemeinde: "Schönhausen" },
];

export const noLocations: LocationDetails[] = [];
