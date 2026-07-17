import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { getOsciClient } from "./osciClient";
import { createMetadata } from "./metadata";

// spy-mock so the temporary alg.0300 tests can inject overridden metadata into sendMessage
vi.mock("./metadata", { spy: true });

// Integration tests against the real AKDB OKKOMM test API (soaptest.akdb.de).
// Require AKDB_BASE_URL / AKDB_USERNAME / AKDB_PASSWORD to be configured.

const samplesDir = path.resolve(
  new URL(".", import.meta.url).pathname,
  "../../resources/xml/xml-samples",
);
function readSample(fileName: string) {
  return readFileSync(path.join(samplesDir, fileName), "utf8");
}

// too unreliable; proper fix: https://github.com/digitalservicebund/unternehmen-steuer-gewerbe/pull/296
describe.skip("osciClient", () => {
  const osciClient = getOsciClient();

  describe("sendMessage", () => {
    // alg.0300 is only used temporarily for testing; in production we will exclusively send ext.gewerbemeldung.0400
    it("successfully sends a valid alg.gewerbemeldung.0300", async () => {
      const metadata = createMetadata({ targetId: "MELDID:09000099" });

      // createMetadata defaults to ext.0400; override the message-type-specific fields for alg.0300.
      metadata.metadata.source.sourceId = "xga:090010030000";
      metadata.metadata.target.targetOperation =
        "alg.gewerbemeldung.0300##http://www.xgewerbeordnung.de/spezifikation/xga/1.6/xgewo16gewerbemeldung-alg-Aufsichtsbehoerden.wsdl##xga";
      metadata.payload.request.message.contentReference =
        "form-data://message/payload.ok.alg.gewerbemeldung.0300.xml";

      vi.mocked(createMetadata).mockReturnValueOnce(metadata);

      const result = await osciClient.sendMessage({
        targetId: "MELDID:09000099",
        message: readSample("payload.ok.alg.gewerbemeldung.0300.xml"),
      });

      expect(result).toBeDefined();
      expect(result!.metadata.reply!.replyType).toBe("OK");
    });

    it("successfully sends a valid ext.gewerbemeldung.0400", async () => {
      const metadata = createMetadata({ targetId: "MELDID:09000099" });

      // TODO: remove this override once our sender id "ds:schnellergruenden" is registered
      metadata.metadata.source.sourceId = "xga:090010030000";

      vi.mocked(createMetadata).mockReturnValueOnce(metadata);

      const result = await osciClient.sendMessage({
        targetId: "MELDID:09000099",
        message: readSample("custom-xgewo-1.6-valid-0400.xml"),
      });

      expect(result.metadata.reply.replyType).toBe("OK");
    });

    it("throws for an invalid Gewerbemeldung", async () => {
      const metadata = createMetadata({ targetId: "MELDID:12052000" });

      // createMetadata defaults to ext.0400; override the message-type-specific fields for alg.0300.
      metadata.metadata.source.sourceId = "xga:090010050000";
      metadata.metadata.target.targetOperation =
        "alg.gewerbemeldung.0300##http://www.xgewerbeordnung.de/spezifikation/xga/1.6/xgewo16gewerbemeldung-alg-Aufsichtsbehoerden.wsdl##xga";
      metadata.payload.request.message.contentReference =
        "form-data://message/payload.nok.alg.gewerbemeldung.0300.xml";

      vi.mocked(createMetadata).mockReturnValueOnce(metadata);

      await expect(
        osciClient.sendMessage({
          targetId: "MELDID:12052000",
          message: readSample("payload.nok.alg.gewerbemeldung.0300.xml"),
        }),
      ).rejects.toThrow();
    });
  });

  describe("getTransportReport", () => {
    it("successfully fetches the transport report for a sent message", async () => {
      const metadata = createMetadata({ targetId: "MELDID:09000099" });

      // TODO: remove this override once our sender id "ds:schnellergruenden" is registered
      metadata.metadata.source.sourceId = "xga:090010030000";

      vi.mocked(createMetadata).mockReturnValueOnce(metadata);

      const sendResult = await osciClient.sendMessage({
        targetId: "MELDID:09000099",
        message: readSample("custom-xgewo-1.6-valid-0400.xml"),
      });

      const report = await osciClient.getTransportReport({
        messageId: sendResult.metadata.source.sourceMessageId,
        authorityKey: "MELDID:09000099",
      });

      expect(report.identifiers.messageID).toBe(sendResult.metadata.source.sourceMessageId);
      expect(report.tracks.length).toBeGreaterThan(0);
    });
  });
});
