import { describe, expect, it } from "vitest";
import { getLocationsDetails } from "./getLocationsDetails";
import {
  dorfstrasse25842WithOrt,
  dorfstrasse25842WithOrtQuery,
  dorfstrasse25842WithoutOrt,
  dorfstrasse25842WithoutOrtQuery,
  marktstrasse25813Query,
  noLocations,
  nonExistentPlzQuery,
  plz17337Locations,
  plz17337Query,
  plz25813AllMunicipalities,
  plz25813Narrowed,
  plz25813Query,
  ulmLocations,
  ulmQuery,
} from "./getLocationsDetails.fixtures";

describe("getLocationsDetails", () => {
  it("returns only locations with the ARS 084210000000 of Ulm for zip code 89073, which spans a single municipality", async () => {
    expect(await getLocationsDetails(ulmQuery)).toEqual(ulmLocations);
  });

  it("returns the ARS-List of all municipalities for zip code 25813 (Husum, Schwesing, ...) when no street is given, since that PLZ spans several municipalities", async () => {
    expect(await getLocationsDetails(plz25813Query)).toEqual(plz25813AllMunicipalities);
  });

  it("narrows ARS down to 010540056056 (single municipality Husum) when not only the zip code 25813, but also the street name Marktstraße 1 is given", async () => {
    expect(await getLocationsDetails(marktstrasse25813Query)).toEqual(plz25813Narrowed);
  });

  it("returns different municipalities for Dorfstraße 1 in 25842 depending on whether an ort is given", async () => {
    expect(await getLocationsDetails(dorfstrasse25842WithoutOrtQuery)).toEqual(
      dorfstrasse25842WithoutOrt,
    );
    expect(await getLocationsDetails(dorfstrasse25842WithOrtQuery)).toEqual(
      dorfstrasse25842WithOrt,
    );
  });

  it("returns three entries (one entry per ARS) for the zip code 17337 without duplicates", async () => {
    expect(await getLocationsDetails(plz17337Query)).toEqual(plz17337Locations);
  });

  it("returns an empty array for the non-existent zip code 00000 instead of throwing", async () => {
    expect(await getLocationsDetails(nonExistentPlzQuery)).toEqual(noLocations);
  });
});
