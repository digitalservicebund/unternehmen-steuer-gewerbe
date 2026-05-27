import "dotenv/config";
import { describe, it, expect } from "vitest";
import { getFitConnectClient } from "./fitConnectClient";
import { getSecret } from "../../secrets";

const DESTINATION_ID = getSecret("FIT_CONNECT_DESTINATION_ID");

describe("FitConnectClient", () => {
  describe("submitData", () => {
    it("authenticates, creates submission, encrypts, and sends", async () => {
      const client = getFitConnectClient();

      const result = await client.submitData({
        destinationId: DESTINATION_ID,
        publicService: {
          identifier: "urn:de:fim:leika:leistung:99050012104000",
          name: "Gewerbe Anmeldung",
        },
        data: "<test>hello</test>",
        dataSchema: {
          schemaUri: "urn:xoev-de:kosit:standard:xgewerbeordnung",
          mimeType: "application/xml",
        },
      });

      expect(result.submissionId).toBeDefined();
      expect(result.destinationId).toBe(DESTINATION_ID);
    });
  });

  describe("getSubmissionEvents", () => {
    it("returns events for a submission", async () => {
      const client = getFitConnectClient();

      const submission = await client.submitData({
        destinationId: DESTINATION_ID,
        publicService: {
          identifier: "urn:de:fim:leika:leistung:99050012104000",
          name: "Gewerbe Anmeldung",
        },
        data: "<test>hello</test>",
        dataSchema: {
          schemaUri: "urn:xoev-de:kosit:standard:xgewerbeordnung",
          mimeType: "application/xml",
        },
      });

      const result = await client.getSubmissionEvents(submission.submissionId, DESTINATION_ID);

      expect(result.eventLog).toBeDefined();
    });
  });
});
