import { createHash } from "node:crypto";

export interface DataSchema {
  schemaUri: string;
  mimeType: string;
}

export function createMetadata(dataSchema: DataSchema, data: string) {
  const dataHash = createHash("sha512").update(data).digest("hex");
  return {
    $schema: "https://schema.fitko.de/fit-connect/metadata/2.0.0/metadata.schema.json",
    contentStructure: {
      data: {
        submissionSchema: {
          schemaUri: dataSchema.schemaUri,
          mimeType: dataSchema.mimeType,
        },
        hash: {
          type: "sha512",
          content: dataHash,
        },
      },
    },
  };
}
