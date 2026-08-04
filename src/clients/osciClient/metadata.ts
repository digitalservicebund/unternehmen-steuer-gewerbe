// see WSDL-Vorlagedateien on https://www.xrepository.de/details/urn:xoev-de:kosit:standard:xgewerbeordnung
export const GEWERBEMELDUNG_EXT_SERVICE_ID =
  "http://www.xgewerbeordnung.de/spezifikation/xga/1.6/xgewo16gewerbemeldung-ext.wsdl";

export interface CreateMetadataOptions {
  targetId: string;
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

export function createMetadata({ targetId, sourceTimestamp }: CreateMetadataOptions): OsciMetadata {
  return {
    $schema: "https://www.akdb.net/ok.komm/zkocjson-1.0.0.schema.json",
    metadata: {
      target: {
        targetProcessType: "XGA",
        targetActionType: "http://www.xgewerbeordnung.de/spezifikation/xga/1.6",
        targetOperation: `ext.gewerbemeldung.0400##${GEWERBEMELDUNG_EXT_SERVICE_ID}##xga`,
        targetId,
      },
      source: {
        sourceProcessType: "XGA", // TODO: we need to change this probably
        // TODO: switch to "ds:schnellergruenden" once that sender id is registered at DVDV.
        // Sending as an unregistered sender is rejected with HTTP 403 insufficient_scope.
        sourceId: "xga:090010030000",
        // AKDB rejects sub-second precision, so emit seconds-only ISO 8601 (e.g. 2026-06-30T09:29:06Z).
        sourceTimestamp: sourceTimestamp ?? new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
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
  };
}
