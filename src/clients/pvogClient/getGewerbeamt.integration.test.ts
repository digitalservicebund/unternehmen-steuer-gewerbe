import { afterEach, describe, expect, it, vi } from "vitest";

const { mockFetchJson } = vi.hoisted(() => ({
  mockFetchJson: vi.fn(),
}));

vi.mock("../../helpers/fetchJson", () => ({
  fetchJson: mockFetchJson,
}));

import { getGewerbeamt } from ".";

const PVOG_SUCHDIENST_API_URL = "https://pvog.fitko.net/suchdienst/api";
const VALID_DATE = new Date().toISOString().split("T")[0]!;

interface MockedPvogResponses {
  serviceDescriptions?: object;
  serviceDescriptionDetail?: object;
  organisationUnits?: object[];
  organisationUnitDetail?: object;
}

// mocks the results of the four PVOG requests getGewerbeamt makes, in call order
function mockPvogApi(overrides: MockedPvogResponses) {
  const responses: MockedPvogResponses = {
    serviceDescriptions: { content: [{ id: "L1.LB.1", ars: ["080000000000"] }] },
    serviceDescriptionDetail: { onlineServiceLinks: [] },
    organisationUnits: [{ id: "L1.OE.1", title: "Gewerbeamt", role: { code: "01", name: "" } }],
    organisationUnitDetail: {
      title: "Gewerbeamt",
      location: { addresses: [], communications: [] },
    },
    ...overrides,
  };

  mockFetchJson
    .mockResolvedValueOnce(responses.serviceDescriptions)
    .mockResolvedValueOnce(responses.serviceDescriptionDetail)
    .mockResolvedValueOnce(responses.organisationUnits)
    .mockResolvedValueOnce(responses.organisationUnitDetail);
}

describe("getGewerbeamt with mocked PVOG responses", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("uses the service description whose ARS matches the searched ARS most precisely", async () => {
    mockPvogApi({
      serviceDescriptions: {
        content: [
          { id: "L1.LB.HESSEN", ars: ["060000000000"] },
          { id: "L1.LB.FRANKFURT", ars: ["990000000000", "064120000000"] },
        ],
      },
    });

    await getGewerbeamt("064120000000");

    expect(mockFetchJson).toHaveBeenCalledWith(
      `${PVOG_SUCHDIENST_API_URL}/v6/servicedescriptions/L1.LB.FRANKFURT/detail`,
      { params: { ars: "064120000000" } },
    );
  });

  it("prefers an organisation unit with a responsible role over an Ansprechpunkt", async () => {
    mockPvogApi({
      organisationUnits: [
        { id: "L1.OE.ANSPRECHPUNKT", title: "", role: { code: "03", name: "Ansprechpunkt" } },
        { id: "L1.OE.ZUSTAENDIG", title: "", role: { code: "02", name: "Zuständige Stelle" } },
      ],
    });

    await getGewerbeamt("064120000000");

    expect(mockFetchJson).toHaveBeenCalledWith(
      `${PVOG_SUCHDIENST_API_URL}/v5/organisationunits/detail`,
      {
        params: {
          ars: "064120000000",
          lbId: "L1.LB.1",
          q: "L1.OE.ZUSTAENDIG",
          validDate: VALID_DATE,
        },
      },
    );
  });

  it("treats an organisation unit without a role element as responsible", async () => {
    mockPvogApi({
      organisationUnits: [{ id: "L1.OE.OHNE_ROLLE", title: "" }],
    });

    await getGewerbeamt("064120000000");

    expect(mockFetchJson).toHaveBeenCalledWith(
      `${PVOG_SUCHDIENST_API_URL}/v5/organisationunits/detail`,
      {
        params: {
          ars: "064120000000",
          lbId: "L1.LB.1",
          q: "L1.OE.OHNE_ROLLE",
          validDate: VALID_DATE,
        },
      },
    );
  });

  it("falls back to the first organisation unit when no unit has a responsible role", async () => {
    mockPvogApi({
      organisationUnits: [
        { id: "L1.OE.ERSTER", title: "", role: { code: "03", name: "Ansprechpunkt" } },
        { id: "L1.OE.ZWEITER", title: "", role: { code: "03", name: "Ansprechpunkt" } },
      ],
    });

    await getGewerbeamt("064120000000");

    expect(mockFetchJson).toHaveBeenCalledWith(
      `${PVOG_SUCHDIENST_API_URL}/v5/organisationunits/detail`,
      {
        params: { ars: "064120000000", lbId: "L1.LB.1", q: "L1.OE.ERSTER", validDate: VALID_DATE },
      },
    );
  });

  it("throws when no organisation unit was found", async () => {
    mockPvogApi({ organisationUnits: [] });

    await expect(getGewerbeamt("064120000000")).rejects.toThrow(
      "No organisation unit found for ARS 064120000000 and lbId L1.LB.1",
    );
  });

  it("prefers the Hausanschrift over other addresses", async () => {
    mockPvogApi({
      organisationUnitDetail: {
        title: "Gewerbeamt",
        location: {
          addresses: [
            { city: "Postfachstadt", code: "002" },
            { city: "Ulm", code: "001" },
          ],
          communications: [],
        },
      },
    });

    const gewerbeamt = await getGewerbeamt("064120000000");

    expect(gewerbeamt!.adresse?.ort).toBe("Ulm");
  });

  it("falls back to the first address when there is no Hausanschrift", async () => {
    mockPvogApi({
      organisationUnitDetail: {
        title: "Gewerbeamt",
        location: {
          addresses: [{ city: "Postfachstadt", code: "002" }],
          communications: [],
        },
      },
    });

    const gewerbeamt = await getGewerbeamt("064120000000");

    expect(gewerbeamt!.adresse?.ort).toBe("Postfachstadt");
  });

  it("returns no adresse when the organisation unit has no addresses", async () => {
    mockPvogApi({});

    const gewerbeamt = await getGewerbeamt("064120000000");

    expect(gewerbeamt!.adresse).toBeUndefined();
  });

  it("trims padding whitespace from the PVOG response values", async () => {
    mockPvogApi({
      serviceDescriptionDetail: {
        onlineServiceLinks: [{ title: "  Online-Dienst  ", uri: "  https://example.org  " }],
      },
      organisationUnitDetail: {
        title: "  Stadt Fulda  ",
        location: {
          addresses: [
            {
              street: "Schlossstraße  ",
              houseNumber: "1   ",
              zip: " 36037",
              city: "Fulda ",
              code: "001",
            },
          ],
          communications: [{ code: "02", value: " 0661 102-0 " }],
        },
      },
    });

    const gewerbeamt = await getGewerbeamt("064120000000");

    expect(gewerbeamt!.name).toBe("Stadt Fulda");
    expect(gewerbeamt!.adresse).toEqual({
      strasse: "Schlossstraße",
      hausnummer: "1",
      postleitzahl: "36037",
      ort: "Fulda",
    });
    expect(gewerbeamt!.telefon).toBe("0661 102-0");
    expect(gewerbeamt!.onlineServices).toEqual([
      { title: "Online-Dienst", description: undefined, uri: "https://example.org" },
    ]);
  });
});
