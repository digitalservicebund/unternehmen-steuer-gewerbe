import { describe, it, expect, vi, afterEach } from "vitest";
import { createMetadata } from "./metadata";

describe("createMetadata", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the expected metadata structure for the given target, source and timestamp", () => {
    const result = createMetadata({
      targetId: "MELDID:09000099",
      sourceTimestamp: "2024-10-24T15:00:39+02:00",
    });

    expect(result).toEqual({
      $schema: "https://www.akdb.net/ok.komm/zkocjson-1.0.0.schema.json",
      metadata: {
        target: {
          targetProcessType: "XGA",
          targetActionType: "http://www.xgewerbeordnung.de/spezifikation/xga/1.6",
          targetOperation:
            "ext.gewerbemeldung.0400##http://www.xgewerbeordnung.de/spezifikation/xga/1.6/xgewo16gewerbemeldung-ext.wsdl##xga",
          targetId: "MELDID:09000099",
        },
        source: {
          sourceProcessType: "XGA",
          sourceId: "xga:090010030000",
          sourceTimestamp: "2024-10-24T15:00:39+02:00",
        },
      },
      payload: {
        request: {
          message: {
            contentReference: "form-data://message/payload.ext.gewerbemeldung.0400.xml",
            contentMediaType: "text/plain",
          },
        },
      },
    });
  });

  it("defaults sourceTimestamp to the current time when none is given with only seconds precision (AKDB rejects milliseconds)", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-10-24T13:00:39.123Z"));

    const result = createMetadata({ targetId: "MELDID:09000099" });

    expect(result.metadata.source.sourceTimestamp).toBe("2024-10-24T13:00:39Z");
  });
});
