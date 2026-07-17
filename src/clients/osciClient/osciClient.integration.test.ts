import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { fetch, Response } from "undici";
import { getOsciClient } from "./osciClient";
import { createMetadata } from "./metadata";
import {
  sendAlg0300OkResponseBody,
  sendExt0400OkResponseBody,
  sendInvalidPayloadErrorResponse,
  tokenResponseBody,
  transportReportResponseBody,
} from "./osciClient.fixtures";

// mock only fetch; the client builds a real Agent from the certificate secrets
vi.mock("undici", async (importOriginal) => {
  const actual = await importOriginal<typeof import("undici")>();
  return { ...actual, fetch: vi.fn() };
});

// spy-mock so the alg.0300 tests can inject overridden metadata into sendMessage, same as the contract test
vi.mock("./metadata", { spy: true });

const samplesDir = path.resolve(
  new URL(".", import.meta.url).pathname,
  "../../resources/xml/xml-samples",
);
function readSample(fileName: string) {
  return readFileSync(path.join(samplesDir, fileName), "utf8");
}

function mockTokenThen(responseBody: string, status = 200) {
  vi.mocked(fetch)
    .mockResolvedValueOnce(new Response(tokenResponseBody, { status: 200 }))
    .mockResolvedValueOnce(new Response(responseBody, { status }));
}

// Mocked counterpart of osciClient.contract.test.ts - same scenarios and assertions, against
// AKDB response fixtures instead of a live call. Dispatcher/error-path behavior in general is
// already covered by osciClient.unit.test.ts.
describe("osciClient with mocked AKDB responses", () => {
  const osciClient = getOsciClient();

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("sendMessage", () => {
    it("successfully sends a valid alg.gewerbemeldung.0300", async () => {
      const metadata = createMetadata({ targetId: "MELDID:09000099" });
      metadata.metadata.source.sourceId = "xga:090010030000";
      metadata.metadata.target.targetOperation =
        "alg.gewerbemeldung.0300##http://www.xgewerbeordnung.de/spezifikation/xga/1.6/xgewo16gewerbemeldung-alg-Aufsichtsbehoerden.wsdl##xga";
      metadata.payload.request.message.contentReference =
        "form-data://message/payload.ok.alg.gewerbemeldung.0300.xml";
      vi.mocked(createMetadata).mockReturnValueOnce(metadata);
      mockTokenThen(sendAlg0300OkResponseBody);

      const result = await osciClient.sendMessage({
        targetId: "MELDID:09000099",
        message: readSample("payload.ok.alg.gewerbemeldung.0300.xml"),
      });

      expect(result).toBeDefined();
      expect(result!.metadata.reply!.replyType).toBe("OK");
    });

    it("successfully sends a valid ext.gewerbemeldung.0400", async () => {
      const metadata = createMetadata({ targetId: "MELDID:09000099" });
      metadata.metadata.source.sourceId = "xga:090010030000";
      vi.mocked(createMetadata).mockReturnValueOnce(metadata);
      mockTokenThen(sendExt0400OkResponseBody);

      const result = await osciClient.sendMessage({
        targetId: "MELDID:09000099",
        message: readSample("custom-xgewo-1.6-valid-0400.xml"),
      });

      expect(result.metadata.reply.replyType).toBe("OK");
    });

    it("throws for an invalid Gewerbemeldung", async () => {
      const metadata = createMetadata({ targetId: "MELDID:12052000" });
      metadata.metadata.source.sourceId = "xga:090010050000";
      metadata.metadata.target.targetOperation =
        "alg.gewerbemeldung.0300##http://www.xgewerbeordnung.de/spezifikation/xga/1.6/xgewo16gewerbemeldung-alg-Aufsichtsbehoerden.wsdl##xga";
      metadata.payload.request.message.contentReference =
        "form-data://message/payload.nok.alg.gewerbemeldung.0300.xml";
      vi.mocked(createMetadata).mockReturnValueOnce(metadata);
      mockTokenThen(sendInvalidPayloadErrorResponse.body, sendInvalidPayloadErrorResponse.status);

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
      metadata.metadata.source.sourceId = "xga:090010030000";
      vi.mocked(createMetadata).mockReturnValueOnce(metadata);
      mockTokenThen(sendExt0400OkResponseBody);

      const sendResult = await osciClient.sendMessage({
        targetId: "MELDID:09000099",
        message: readSample("custom-xgewo-1.6-valid-0400.xml"),
      });

      mockTokenThen(transportReportResponseBody);

      const report = await osciClient.getTransportReport({
        messageId: sendResult.metadata.source.sourceMessageId,
        authorityKey: "MELDID:09000099",
      });

      expect(report.identifiers.messageID).toBe(sendResult.metadata.source.sourceMessageId);
      expect(report.tracks.length).toBeGreaterThan(0);
    });
  });
});
