import { describe, it, expect, vi, beforeAll } from "vitest";

const { mockFetchJson } = vi.hoisted(() => ({ mockFetchJson: vi.fn() }));

vi.mock("../../helpers/fetchJson", () => ({ fetchJson: mockFetchJson }));

import { exportJWK, generateKeyPair, SignJWT, type JWK, type KeyObject } from "jose";
import { verifyDestinationSignature } from "./destinationSignature";

const ISSUER = "https://test.fit-connect.fitko.dev";
const KID = "signing-key-id";
const DESTINATION_ID = "fa63ede0-0ef6-4ca6-abd2-6bd16729ddc1";
const LEIKA_KEY = "99050012104000";
const ARS = "084210000000";

interface SignatureKeyPair {
  privateKey: KeyObject | CryptoKey;
  publicJwk: JWK;
}

async function createSignatureKeyPair(modulusLength: number): Promise<SignatureKeyPair> {
  const { privateKey, publicKey } = await generateKeyPair("PS512", {
    modulusLength,
    extractable: true,
  });
  const publicJwk = await exportJWK(publicKey);
  return { privateKey, publicJwk: { ...publicJwk, kid: KID, alg: "PS512" } };
}

interface DestinationSignatureOverrides {
  destinationId?: string;
  leistungIDs?: string[];
  gebietIDs?: string[];
  issuer?: string;
  algorithm?: string;
  kid?: string;
}

let keyPair: SignatureKeyPair;
let shortKeyPair: SignatureKeyPair;

async function createDestinationSignature({
  destinationId = DESTINATION_ID,
  leistungIDs = [`urn:de:fim:leika:leistung:${LEIKA_KEY}`],
  gebietIDs = [`urn:de:bund:destatis:bevoelkerungsstatistik:schluessel:rs:${ARS}`],
  issuer = ISSUER,
  algorithm = "PS512",
  kid = KID,
}: DestinationSignatureOverrides = {}): Promise<string> {
  return new SignJWT({
    destinationId,
    submissionHost: "test.fit-connect.fitko.dev",
    services: [{ leistungIDs, gebietIDs }],
  })
    .setProtectedHeader({ alg: algorithm, typ: "JWT", kid })
    .setIssuer(issuer)
    .setIssuedAt()
    .sign(keyPair.privateKey);
}

describe("verifyDestinationSignature", () => {
  beforeAll(async () => {
    keyPair = await createSignatureKeyPair(4096);
    shortKeyPair = await createSignatureKeyPair(2048);
  });

  it("verifies a signature issued for the queried destinationId, LEIKA key and ARS 084210000000", async () => {
    mockFetchJson.mockResolvedValueOnce({ keys: [keyPair.publicJwk] });
    const destinationSignature = await createDestinationSignature();

    await expect(
      verifyDestinationSignature({
        destinationSignature,
        destinationId: DESTINATION_ID,
        leikaKey: LEIKA_KEY,
        ars: ARS,
      }),
    ).resolves.toBeUndefined();
  });

  it("loads the key set from the jwks endpoint of the issuer test.fit-connect.fitko.dev", async () => {
    mockFetchJson.mockResolvedValueOnce({ keys: [keyPair.publicJwk] });
    const destinationSignature = await createDestinationSignature();

    await verifyDestinationSignature({
      destinationSignature,
      destinationId: DESTINATION_ID,
      leikaKey: LEIKA_KEY,
      ars: ARS,
    });

    const [url] = mockFetchJson.mock.calls.at(-1)!;
    expect(url).toBe("https://test.fit-connect.fitko.dev/.well-known/jwks.json");
  });

  it("verifies a signature for the Kreis 084210000000 when the ARS 084215005013 lies within it", async () => {
    mockFetchJson.mockResolvedValueOnce({ keys: [keyPair.publicJwk] });
    const destinationSignature = await createDestinationSignature({
      gebietIDs: ["urn:de:bund:destatis:bevoelkerungsstatistik:schluessel:rs:084210000000"],
    });

    await expect(
      verifyDestinationSignature({
        destinationSignature,
        destinationId: DESTINATION_ID,
        leikaKey: LEIKA_KEY,
        ars: "084215005013",
      }),
    ).resolves.toBeUndefined();
  });

  it("rejects a signature for the Gemeinde 084215005013 when the queried ARS 084210000000 is the Kreis", async () => {
    mockFetchJson.mockResolvedValueOnce({ keys: [keyPair.publicJwk] });
    const destinationSignature = await createDestinationSignature({
      gebietIDs: ["urn:de:bund:destatis:bevoelkerungsstatistik:schluessel:rs:084215005013"],
    });

    await expect(
      verifyDestinationSignature({
        destinationSignature,
        destinationId: DESTINATION_ID,
        leikaKey: LEIKA_KEY,
        ars: ARS,
      }),
    ).rejects.toThrow("not responsible");
  });

  it("rejects a signature that does not cover the LEIKA key 99050012104000", async () => {
    mockFetchJson.mockResolvedValueOnce({ keys: [keyPair.publicJwk] });
    const destinationSignature = await createDestinationSignature({
      leistungIDs: ["urn:de:fim:leika:leistung:99008001014002"],
    });

    await expect(
      verifyDestinationSignature({
        destinationSignature,
        destinationId: DESTINATION_ID,
        leikaKey: LEIKA_KEY,
        ars: ARS,
      }),
    ).rejects.toThrow("not responsible");
  });

  it("rejects a signature issued for a different destinationId", async () => {
    mockFetchJson.mockResolvedValueOnce({ keys: [keyPair.publicJwk] });
    const destinationSignature = await createDestinationSignature({
      destinationId: "23bdd840-a823-4d8b-9992-07d04ca907a7",
    });

    await expect(
      verifyDestinationSignature({
        destinationSignature,
        destinationId: DESTINATION_ID,
        leikaKey: LEIKA_KEY,
        ars: ARS,
      }),
    ).rejects.toThrow("destinationId");
  });

  it("rejects the issuer domain portal.evil-fit-connect.fitko.dev outside FIT-Connect", async () => {
    const destinationSignature = await createDestinationSignature({
      issuer: "https://portal.evil-fit-connect.fitko.dev",
    });

    await expect(
      verifyDestinationSignature({
        destinationSignature,
        destinationId: DESTINATION_ID,
        leikaKey: LEIKA_KEY,
        ars: ARS,
      }),
    ).rejects.toThrow("issuer");
  });

  it("rejects a signature signed with PS256 instead of PS512", async () => {
    const { privateKey } = await generateKeyPair("PS256", { extractable: true });
    const destinationSignature = await new SignJWT({
      destinationId: DESTINATION_ID,
      services: [
        {
          leistungIDs: [`urn:de:fim:leika:leistung:${LEIKA_KEY}`],
          gebietIDs: [`urn:de:bund:destatis:bevoelkerungsstatistik:schluessel:rs:${ARS}`],
        },
      ],
    })
      .setProtectedHeader({ alg: "PS256", typ: "JWT", kid: KID })
      .setIssuer(ISSUER)
      .sign(privateKey);

    await expect(
      verifyDestinationSignature({
        destinationSignature,
        destinationId: DESTINATION_ID,
        leikaKey: LEIKA_KEY,
        ars: ARS,
      }),
    ).rejects.toThrow("PS512");
  });

  it("rejects a signature whose kid is not in the key set", async () => {
    mockFetchJson.mockResolvedValueOnce({
      keys: [{ ...keyPair.publicJwk, kid: "another-key-id" }],
    });
    const destinationSignature = await createDestinationSignature();

    await expect(
      verifyDestinationSignature({
        destinationSignature,
        destinationId: DESTINATION_ID,
        leikaKey: LEIKA_KEY,
        ars: ARS,
      }),
    ).rejects.toThrow("signing-key-id");
  });

  it("rejects a signing key with 2048 instead of 4096 bit", async () => {
    mockFetchJson.mockResolvedValueOnce({ keys: [shortKeyPair.publicJwk] });
    const destinationSignature = await createDestinationSignature();

    await expect(
      verifyDestinationSignature({
        destinationSignature,
        destinationId: DESTINATION_ID,
        leikaKey: LEIKA_KEY,
        ars: ARS,
      }),
    ).rejects.toThrow("4096");
  });

  it("rejects a signature whose payload was changed after signing", async () => {
    mockFetchJson.mockResolvedValueOnce({ keys: [keyPair.publicJwk] });
    const destinationSignature = await createDestinationSignature();
    const [header, , signature] = destinationSignature.split(".");
    const tamperedPayload = Buffer.from(
      JSON.stringify({
        iss: ISSUER,
        destinationId: DESTINATION_ID,
        services: [
          {
            leistungIDs: [`urn:de:fim:leika:leistung:${LEIKA_KEY}`],
            gebietIDs: [`urn:de:bund:destatis:bevoelkerungsstatistik:schluessel:rs:${ARS}`],
          },
        ],
      }),
    ).toString("base64url");

    await expect(
      verifyDestinationSignature({
        destinationSignature: `${header}.${tamperedPayload}.${signature}`,
        destinationId: DESTINATION_ID,
        leikaKey: LEIKA_KEY,
        ars: ARS,
      }),
    ).rejects.toThrow();
  });
});
