// Raw PVOG /v3/locations responses for the scenarios covered by getLocationsDetails.contract.test.ts.
// Recorded verbatim from a real run against https://pvog.fitko.net (2026-07-17).
//
// getLocationsDetails is a pure pass-through: fetchJson<LocationDetails[]> only casts the type,
// it doesn't strip anything at runtime - so the real response's extra fields (arsFederalstate,
// koordinaten, hausnummer) really do flow through to callers, even though LocationDetails doesn't
// declare them. These fixtures are intentionally left untyped as LocationDetails[] so they can
// keep those extra fields without an excess-property error, matching real runtime behavior for
// the full-input/full-output comparisons in both getLocationsDetails.contract.test.ts (real call)
// and getLocationsDetails.integration.test.ts (mocked).
import type { LocationQuery } from "./getLocationsDetails";

export const ulmQuery: LocationQuery = { plz: "89073" };
export const plz25813Query: LocationQuery = { plz: "25813" };
export const marktstrasse25813Query: LocationQuery = {
  plz: "25813",
  strasse: "Marktstraße",
  hausnummer: "1",
};
export const dorfstrasse25842WithoutOrtQuery: LocationQuery = {
  plz: "25842",
  strasse: "Dorfstraße",
  hausnummer: "1",
};
export const dorfstrasse25842WithOrtQuery: LocationQuery = {
  plz: "25842",
  ort: "Lütjenholm",
  strasse: "Dorfstraße",
  hausnummer: "1",
};
export const plz17337Query: LocationQuery = { plz: "17337" };
export const nonExistentPlzQuery: LocationQuery = { plz: "00000" };

export const ulmLocations = [
  {
    ars: "084210000000",
    arsFederalstate: "08",
    name: "Ulm, Donau 'Mitte'",
    gemeinde: "Ulm",
    plz: "89073",
    koordinaten: ["9.993427", "48.400896"],
  },
];

export const plz25813AllMunicipalities = [
  {
    ars: "010545453118",
    arsFederalstate: "01",
    name: "Schwesing",
    gemeinde: "Schwesing",
    plz: "25813",
    koordinaten: ["9.134622", "54.493899"],
  },
  {
    ars: "010540056056",
    arsFederalstate: "01",
    name: "Husum, Nordsee",
    gemeinde: "Husum",
    plz: "25813",
    koordinaten: ["9.050149", "54.476472"],
  },
  {
    ars: "010545492120",
    arsFederalstate: "01",
    name: "Simonsberg bei Husum, Nordsee",
    gemeinde: "Simonsberg",
    plz: "25813",
    koordinaten: ["8.97196", "54.436567"],
  },
  {
    ars: "010545492132",
    arsFederalstate: "01",
    name: "Südermarsch bei Husum, Nordsee",
    gemeinde: "Südermarsch",
    plz: "25813",
    koordinaten: ["9.08199", "54.425929"],
  },
];

export const plz25813Narrowed = [
  {
    ars: "010540056056",
    arsFederalstate: "01",
    name: "Husum, Nordsee",
    gemeinde: "Husum",
    plz: "25813",
    strasse: "Marktstraße",
    hausnummer: "1",
    koordinaten: ["9.046297", "54.482164"],
  },
];

export const dorfstrasse25842WithoutOrt = [
  {
    ars: "010545494093",
    arsFederalstate: "01",
    name: "Ockholm",
    gemeinde: "Ockholm",
    plz: "25842",
    strasse: "Dorfstraße",
    hausnummer: "1",
    koordinaten: ["8.817099", "54.665374"],
  },
  {
    ars: "010545494080",
    arsFederalstate: "01",
    name: "Lütjenholm",
    gemeinde: "Lütjenholm",
    plz: "25842",
    strasse: "Dorfstraße",
    hausnummer: "1",
    koordinaten: ["9.018424", "54.684057"],
  },
  {
    ars: "010545494075",
    arsFederalstate: "01",
    name: "Langenhorn bei Husum, Nordsee",
    gemeinde: "Langenhorn",
    plz: "25842",
    strasse: "Dorfstraße",
    hausnummer: "1",
    koordinaten: ["8.956566", "54.687068"],
  },
];

export const dorfstrasse25842WithOrt = [
  {
    ars: "010545494080",
    arsFederalstate: "01",
    name: "Lütjenholm",
    gemeinde: "Lütjenholm",
    plz: "25842",
    strasse: "Dorfstraße",
    hausnummer: "1",
    koordinaten: ["9.018424", "54.684057"],
  },
];

export const plz17337Locations = [
  {
    ars: "130755560042",
    arsFederalstate: "13",
    name: "Groß Luckow",
    gemeinde: "Groß Luckow",
    plz: "17337",
    koordinaten: ["13.829164", "53.53597"],
  },
  {
    ars: "120730579579",
    arsFederalstate: "12",
    name: "Uckerland 'Jagow'",
    gemeinde: "Uckerland",
    plz: "17337",
    koordinaten: ["13.786048", "53.416251"],
  },
  {
    ars: "130715164132",
    arsFederalstate: "13",
    name: "Schönhausen, Mecklenburg",
    gemeinde: "Schönhausen",
    plz: "17337",
    koordinaten: ["13.700496", "53.552733"],
  },
];

export const noLocations: never[] = [];
