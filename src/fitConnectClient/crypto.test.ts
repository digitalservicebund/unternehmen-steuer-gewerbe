import "dotenv/config";
import { describe, it, expect } from "vitest";
import { encryptData, decryptData } from "./crypto";

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
