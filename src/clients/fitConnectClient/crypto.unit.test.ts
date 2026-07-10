import "dotenv/config";
import { describe, it, expect } from "vitest";
import { generateKeyPair, SignJWT, exportJWK } from "jose";
import { encryptData, decryptData, verifyEventToken } from "./crypto";

async function generateSigningKeyPair() {
  const { privateKey, publicKey } = await generateKeyPair("PS512");
  const publicJwk = { ...(await exportJWK(publicKey)), alg: "PS512" };
  return { privateKey, publicJwk };
}

const publicKeyEncryption = process.env.FIT_CONNECT_PUBLIC_KEY_ENCRYPTION_JWK
  ? JSON.parse(process.env.FIT_CONNECT_PUBLIC_KEY_ENCRYPTION_JWK)
  : undefined;
const privateKeyDecryption = process.env.FIT_CONNECT_PRIVATE_KEY_DECRYPTION_JWK
  ? JSON.parse(process.env.FIT_CONNECT_PRIVATE_KEY_DECRYPTION_JWK)
  : undefined;

describe("crypto", () => {
  it("encrypts and decrypts data", async () => {
    const encrypted = await encryptData("hello world.", publicKeyEncryption);
    const decrypted = await decryptData(encrypted, privateKeyDecryption);

    expect(decrypted).toBe("hello world.");
  });

  it("respects custom content type", async () => {
    const encrypted = await encryptData("<xml/>", publicKeyEncryption, "application/xml");
    const decrypted = await decryptData(encrypted, privateKeyDecryption);

    expect(decrypted).toBe("<xml/>");
  });
});

describe("verifyEventToken", () => {
  it("verifies a signed JWT and returns its payload", async () => {
    const { privateKey, publicJwk } = await generateSigningKeyPair();

    const token = await new SignJWT({ eventType: "SubmissionReceived" })
      .setProtectedHeader({ alg: "PS512" })
      .setIssuedAt()
      .sign(privateKey);

    const payload = await verifyEventToken(token, publicJwk);

    expect(payload.eventType).toBe("SubmissionReceived");
  });

  it("rejects a token signed with a different key", async () => {
    const { privateKey } = await generateSigningKeyPair();
    const { publicJwk: wrongPublicJwk } = await generateSigningKeyPair();

    const token = await new SignJWT({ eventType: "SubmissionReceived" })
      .setProtectedHeader({ alg: "PS512" })
      .setIssuedAt()
      .sign(privateKey);

    await expect(verifyEventToken(token, wrongPublicJwk)).rejects.toThrow();
  });
});
