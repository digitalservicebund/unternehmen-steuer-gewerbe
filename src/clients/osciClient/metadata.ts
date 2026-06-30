export interface CreateMetadataOptions {
  targetId: string;
  sourceId: string;
  sourceTimestamp?: string;
}

interface OsciMetadataTarget {
  targetProcessType: string;
  targetActionType: string;
  targetOperation: string;
  targetId: string;
}

interface OsciMetadataSource {
  sourceProcessType: string;
  sourceId: string;
  sourceTimestamp: string;
}

interface OsciMetadataMessage {
  contentReference: string;
  contentMediaType: string;
}

export interface OsciMetadata {
  $schema: string;
  metadata: {
    target: OsciMetadataTarget;
    source: OsciMetadataSource;
  };
  payload: {
    request: {
      message: OsciMetadataMessage;
    };
  };
}

export function createMetadata({
  targetId,
  sourceId,
  sourceTimestamp,
}: CreateMetadataOptions): OsciMetadata {
  return {
    $schema: "https://www.akdb.net/ok.komm/zkocjson-1.0.0.schema.json",
    metadata: {
      target: {
        targetProcessType: "XGA",
        targetActionType: "http://www.xgewerbeordnung.de/spezifikation/xga/1.6",
        targetOperation:
          "ext.gewerbemeldung.0400##http://www.xgewerbeordnung.de/spezifikation/xga/1.6/xgewo16gewerbemeldung-alg-Aufsichtsbehoerden.wsdl##xga",
        targetId,
      },
      source: {
        sourceProcessType: "XGA", // TODO: we need to change this probably
        sourceId,
        // AKDB rejects sub-second precision, so emit seconds-only ISO 8601 (e.g. 2026-06-30T09:29:06Z).
        sourceTimestamp: sourceTimestamp ?? new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
      },
    },
    payload: {
      request: {
        message: {
          contentReference: "form-data://message/payload.ok.ext.gewerbemeldung.0400.xml",
          contentMediaType: "text/plain",
        },
      },
    },
  };
}
