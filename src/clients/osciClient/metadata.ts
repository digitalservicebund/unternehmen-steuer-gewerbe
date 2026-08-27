// see WSDL-Vorlagedateien on https://www.xrepository.de/details/urn:xoev-de:kosit:standard:xgewerbeordnung
export const GEWERBEMELDUNG_EXT_SERVICE_ID =
  "http://www.xgewerbeordnung.de/spezifikation/xga/1.6/xgewo16gewerbemeldung-ext.wsdl";

const MESSAGE_FILE_NAME = "payload.ext.gewerbemeldung.0400.xml";

/** Eine Anlage zur Fachnachricht, die als eigener Content im OSCI-Container übertragen wird. */
export interface OsciAttachment {
  fileName: string;
  mimeType: string;
  content: Buffer;
}

export interface CreateMetadataOptions {
  targetId: string;
  attachments?: OsciAttachment[];
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
      attachments?: OsciMetadataMessage[];
    };
  };
}

// The ZKO resolves each content as form-data://<multipart field name>/<file name> and only accepts
// the field names "metadata", "message" and "attachments". Every part has to be referenced here,
// and every reference has to have a matching part.
function createRequestPayload(attachments: OsciAttachment[]) {
  const message: OsciMetadataMessage = {
    contentReference: `form-data://message/${MESSAGE_FILE_NAME}`,
    contentMediaType: "text/plain",
  };

  if (attachments.length === 0) {
    return { message };
  }

  return {
    message,
    attachments: attachments.map((attachment) => ({
      contentReference: `form-data://attachments/${attachment.fileName}`,
      contentMediaType: attachment.mimeType,
    })),
  };
}

export function createMetadata({
  targetId,
  attachments = [],
  sourceTimestamp,
}: CreateMetadataOptions): OsciMetadata {
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
      request: createRequestPayload(attachments),
    },
  };
}
