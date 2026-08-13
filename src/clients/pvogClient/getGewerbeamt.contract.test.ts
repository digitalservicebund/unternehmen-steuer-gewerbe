import { describe, expect, it } from "vitest";
import {
  fetchOrganisationUnitArs,
  fetchOrganisationUnitDetail,
  fetchOrganisationUnitTitles,
  fetchServiceDescriptionDetail,
  fetchServiceDescriptionsByArs,
  getGewerbeamt,
} from ".";

// Fixed IDs for Ulm (ARS 084210000000), discovered via a live PVOG lookup - these let each raw
// endpoint be called directly with a literal, known-valid input, without going through
// getGewerbeamt's own ARS-matching/role-selection logic (which getGewerbeamt.integration.test.ts
// already covers against mocked responses).
const ARS_ULM = "084210000000";
const LB_ID_ULM = "L100022.LB.496-99050012104000";
const ORGANISATION_UNIT_ID_ULM = "L100022.OE.6017613";

describe("getGewerbeamt raw PVOG endpoints", () => {
  it("returns the service description for Ulm (ARS 084210000000) with its lbId", async () => {
    const result = await fetchServiceDescriptionsByArs(ARS_ULM);

    expect(result.content).toContainEqual(
      expect.objectContaining({ id: LB_ID_ULM, ars: ["080000000000"] }),
    );
  });

  it("returns service description detail with the online service links for Ulm", async () => {
    const result = await fetchServiceDescriptionDetail(LB_ID_ULM, ARS_ULM);

    expect(result.onlineServiceLinks).toContainEqual(
      expect.objectContaining({
        title: "Terminvereinbarung bei den Bürgerdiensten in der Olgastraße 66, 89073 Ulm",
        uri: "http://www.ulm.de/mb",
      }),
    );
  });

  it("returns the organisation unit title for Ulm, with role 'Zuständige Stelle und Ansprechpunkt'", async () => {
    const result = await fetchOrganisationUnitTitles(ARS_ULM, LB_ID_ULM);

    expect(result).toContainEqual(
      expect.objectContaining({
        id: ORGANISATION_UNIT_ID_ULM,
        role: expect.objectContaining({ code: "01" }),
      }),
    );
  });

  it("returns organisation unit detail with address, phone and email for Ulm", async () => {
    const result = await fetchOrganisationUnitDetail(ARS_ULM, LB_ID_ULM, ORGANISATION_UNIT_ID_ULM);

    expect(result.location.addresses).toContainEqual(
      expect.objectContaining({
        street: "Olgastraße",
        houseNumber: "66",
        zip: "89073",
        city: "Ulm",
      }),
    );
    expect(result.location.communications).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "02", value: "+49 731 161 3216" }),
        expect.objectContaining({ code: "01", value: "gewerbe@ulm.de" }),
      ]),
    );
  });

  it("returns the ARS the organisation unit for Ulm is responsible for", async () => {
    const result = await fetchOrganisationUnitArs(ORGANISATION_UNIT_ID_ULM);

    expect(result).toEqual([ARS_ULM]);
  });

  it("returns the Stadt Husum for ARS 010540056056, not the Einheitlicher Ansprechpartner Schleswig-Holstein", async () => {
    const gewerbeamt = await getGewerbeamt("010540056056");

    expect(gewerbeamt!.name).toBe("Stadt Husum - Der Bürgermeister - Gewerbewesen");
  });

  it("returns the Stadt Goslar for ARS 031530017017, not the Einheitlicher Ansprechpartner Landkreis Goslar", async () => {
    const gewerbeamt = await getGewerbeamt("031530017017");

    expect(gewerbeamt!.name).toBe("Stadt Goslar - Bürgerbüro");
  });

  // temporarily skipped because of unstable API
  it.skip("returns an empty onlineServices list for Fraureuth (ARS 146120000000), which has no online services", async () => {
    const gewerbeamt = await getGewerbeamt("146120000000");

    expect(gewerbeamt!.name).toBe("Gewerbeamt");
    expect(gewerbeamt!.onlineServices).toEqual([]);
  });

  it("returns no service description for the non-existent ARS 000000000000", async () => {
    const result = await fetchServiceDescriptionsByArs("000000000000");

    expect(result.content).toEqual([]);
  });
});
