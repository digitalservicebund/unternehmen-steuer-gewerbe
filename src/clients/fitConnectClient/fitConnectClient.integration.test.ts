import "dotenv/config";
import { describe, it, expect } from "vitest";
import { getFitConnectClient } from "./fitConnectClient";
import { getEnvironmentVariable } from "../../secretsAndEnvironmentVariables";

const DESTINATION_ID = getEnvironmentVariable("FIT_CONNECT_DESTINATION_ID");

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

  describe("getRoutes", () => {
    it.skip("returns a routing result for a known leiKa key and AGS", async () => {
      const client = getFitConnectClient();

      const result = await client.getRoutes(
        "99050012104000",
        "14612000", // AGS Dresden
      );
      expect(Array.isArray(result.routes)).toBe(true);
      expect(typeof result.count).toBe("number");
      expect(typeof result.routes[0]!.destinationId).toBe("string");
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
