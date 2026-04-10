import { describe, it, expect } from "vitest";
import { createMetadata } from "./metadata";

describe("createMetadata", () => {
  const dataSchema = {
    schemaUri: "urn:test:schema",
    mimeType: "application/json",
  };

  it("returns the expected metadata structure for a given input", () => {
    const result = createMetadata(dataSchema, '{ "data": "passierschein a38" }');

    expect(result).toEqual({
      $schema: "https://schema.fitko.de/fit-connect/metadata/2.0.0/metadata.schema.json",
      contentStructure: {
        data: {
          submissionSchema: {
            schemaUri: "urn:test:schema",
            mimeType: "application/json",
          },
          hash: {
            type: "sha512",
            content:
              "ff7ce088290ebfb46b7e01d73ce0732033a46b59f8f6ea71097cf9a0f4d11a23c1ef6bd8e62b5f518aaabf85b16b3d5e7f6d5c4fdecd36f7e64f171eb3289661",
          },
        },
      },
    });
  });

  it("produces different hashes for different data", () => {
    const a = createMetadata(dataSchema, '{ "data": "passierschein a38" }');
    const b = createMetadata(dataSchema, '{ "data": "passierschein a42" }');

    expect(a.contentStructure.data.hash.content).not.toEqual(b.contentStructure.data.hash.content);
  });

  it("passes schemaUri and mimeType through unchanged", () => {
    const result = createMetadata({ schemaUri: "urn:other", mimeType: "text/xml" }, "<xml/>");

    expect(result.contentStructure.data.submissionSchema).toEqual({
      schemaUri: "urn:other",
      mimeType: "text/xml",
    });
  });
});
