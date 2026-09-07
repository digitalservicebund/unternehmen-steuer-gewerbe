import { vi } from "vitest";

// Note: mocking is "global" on file level, therefore we have separate files for tests that mock and those that don't.
import "../../testSupport/mockUnternehmenSteuerGewerbePrivat";

const { mockSubmitData, mockSendMessage, mockGetGewerbeRoutingInfo, fuldaRoutingInfoFixture } =
  vi.hoisted(() => {
    const fuldaRoutingInfoFixture = {
      ags: "03046001",
      ars: "084210000000",
      gewerbeamt: {
        name: "Stadt Fulda",
        adresse: { strasse: "Schlossstraße", hausnummer: "1", postleitzahl: "36037", ort: "Fulda" },
        telefon: "0661 102-0",
        onlineServices: [],
      },
      fitConnectDestinationInformation: { destinationId: "mock-destination-id" },
    };

    return {
      mockSubmitData: vi.fn().mockResolvedValue({ submissionId: "mock-submission-id" }),
      mockSendMessage: vi.fn().mockResolvedValue({
        metadata: { source: { sourceMessageId: "mock-osci-message-id" } },
      }),
      mockGetGewerbeRoutingInfo: vi.fn().mockResolvedValue(fuldaRoutingInfoFixture),
      fuldaRoutingInfoFixture,
    };
  });

vi.mock("../../clients/fitConnectClient/fitConnectClient", () => ({
  getFitConnectClient: () => ({ submitData: mockSubmitData }),
}));

vi.mock("../../clients/osciClient/osciClient", () => ({
  getOsciClient: () => ({ sendMessage: mockSendMessage }),
}));

vi.mock("./getGewerbeRoutingInfo", () => ({
  getGewerbeRoutingInfo: mockGetGewerbeRoutingInfo,
}));

export { mockSubmitData, mockSendMessage, mockGetGewerbeRoutingInfo, fuldaRoutingInfoFixture };

import app from "../../app";
import { registerGewerbeSampleRequestAllFieldsFilled } from "./testHelpers";

export function postRegisterGewerbe(
  data = registerGewerbeSampleRequestAllFieldsFilled,
  queryString = "",
) {
  return app.request(`/api/v1/register-gewerbe${queryString}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
