import { describe, it, expect } from "vitest";
import { generateKeyPair, SignJWT, exportJWK } from "jose";
import { encryptData, decryptData, verifyEventToken } from "./crypto";

async function generateSigningKeyPair() {
  const { privateKey, publicKey } = await generateKeyPair("PS512");
  const publicJwk = { ...(await exportJWK(publicKey)), alg: "PS512" };
  return { privateKey, publicJwk };
}

// key_ops and kid mirror the shape of the JWKs FIT-Connect hands out, so that the key_ops
// stripping in encryptData/decryptData stays covered
const { publicKey, privateKey } = await generateKeyPair("RSA-OAEP-256", { extractable: true });
const publicKeyEncryption = {
  ...(await exportJWK(publicKey)),
  kid: "test-kid",
  key_ops: ["encrypt"],
};
const privateKeyDecryption = {
  ...(await exportJWK(privateKey)),
  kid: "test-kid",
  key_ops: ["decrypt"],
};

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
