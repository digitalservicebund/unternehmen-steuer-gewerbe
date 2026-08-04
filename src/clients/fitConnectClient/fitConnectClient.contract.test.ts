import "dotenv/config";
import { describe, it, expect } from "vitest";
import { verifyDestinationSignature } from "./destinationSignature";
import { getFitConnectClient } from "./fitConnectClient";
import { getEnvironmentVariable } from "../../secretsAndEnvironmentVariables";

const DESTINATION_ID = getEnvironmentVariable("TEST_FIT_CONNECT_DESTINATION_ID_OVERRIDE");

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
    // A Zustellpunkt for the Gewerbeanmeldung is registered for this ARS in FIT-Connect testing.
    const ARS_ULM = "084210000000";
    const GEWERBEANMELDUNG_LEIKA_KEY = "99050012104000";

    it("returns a route for the Gewerbeanmeldung LEIKA key and ARS Ulm 084210000000", async () => {
      const client = getFitConnectClient();

      const result = await client.getRoutes(GEWERBEANMELDUNG_LEIKA_KEY, ARS_ULM);

      expect(result.totalCount).toBeGreaterThan(0);
      expect(typeof result.routes[0]!.destinationId).toBe("string");
    });

    it("returns a route whose destinationSignature verifies against the live key set", async () => {
      const client = getFitConnectClient();
      const result = await client.getRoutes(GEWERBEANMELDUNG_LEIKA_KEY, ARS_ULM);
      const route = result.routes[0]!;

      await expect(
        verifyDestinationSignature({
          destinationSignature: route.destinationSignature,
          destinationId: route.destinationId,
          leikaKey: GEWERBEANMELDUNG_LEIKA_KEY,
          ars: ARS_ULM,
        }),
      ).resolves.toBeUndefined();
    });
  });

  describe("fetchSubmissionEvents", () => {
    it("returns the raw events for a submission", async () => {
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

      const result = await client.fetchSubmissionEvents(submission.submissionId);

      expect(result!.count).toEqual(expect.any(Number));
      expect(result!.offset).toEqual(expect.any(Number));
      expect(result!.totalCount).toEqual(expect.any(Number));
      expect(Array.isArray(result!.eventLog)).toBe(true);
      for (const entry of result!.eventLog) {
        expect(entry).toEqual(expect.any(String));
      }
    });
  });
});
