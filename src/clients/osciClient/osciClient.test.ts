import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getOsciClient } from "./osciClient";
import { createMetadata } from "./metadata";

// Integration tests against the real AKDB OKKOMM test API (soaptest.akdb.de).
// Require AKDB_BASE_URL / AKDB_USERNAME / AKDB_PASSWORD to be configured.

const samplesDir = path.resolve(
  new URL(".", import.meta.url).pathname,
  "../../resources/xml/xml-samples",
);
const readSample = (fileName: string) => readFileSync(path.join(samplesDir, fileName), "utf8");

describe("osciClient.sendMessage", () => {
  const osciClient = getOsciClient();

  it("sends a valid alg.gewerbemeldung.0300", async () => {
    const metadata = createMetadata({
      targetId: "MELDID:09000099",
      sourceId: "xga:090010030000",
    });

    // createMetadata defaults to ext.0400; override the message-type-specific fields for alg.0300.
    metadata.metadata.target.targetOperation =
      "alg.gewerbemeldung.0300##http://www.xgewerbeordnung.de/spezifikation/xga/1.6/xgewo16gewerbemeldung-alg-Aufsichtsbehoerden.wsdl##xga";
    metadata.payload.request.message.contentReference =
      "form-data://message/payload.ok.alg.gewerbemeldung.0300.xml";

    const result = await osciClient.sendMessage({
      metadata,
      message: readSample("payload.ok.alg.gewerbemeldung.0300.xml"),
    });

    expect(result).toBeDefined();
    expect(result!.metadata.reply!.replyType).toBe("OK");
  });

  it("sends a valid ext.gewerbemeldung.0400", async () => {
    const result = await osciClient.sendMessage({
      metadata: createMetadata({
        targetId: "MELDID:09000099",
        sourceId: "xga:090010030000",
      }),
      message: readSample("custom-xgewo-1.6-valid-0400.xml"),
    });

    expect(result.metadata.reply.replyType).toBe("OK");
  });

  it("throws for an invalid Gewerbemeldung", async () => {
    const metadata = createMetadata({
      targetId: "MELDID:12052000",
      sourceId: "xga:090010050000",
    });

    // createMetadata defaults to ext.0400; override the message-type-specific fields for alg.0300.
    metadata.metadata.target.targetOperation =
      "alg.gewerbemeldung.0300##http://www.xgewerbeordnung.de/spezifikation/xga/1.6/xgewo16gewerbemeldung-alg-Aufsichtsbehoerden.wsdl##xga";
    metadata.payload.request.message.contentReference =
      "form-data://message/payload.nok.alg.gewerbemeldung.0300.xml";

    await expect(
      osciClient.sendMessage({
        metadata,
        message: readSample("payload.nok.alg.gewerbemeldung.0300.xml"),
      }),
    ).rejects.toThrow();
  });
});
