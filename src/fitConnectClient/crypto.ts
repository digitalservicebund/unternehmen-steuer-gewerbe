import { importJWK, CompactEncrypt, compactDecrypt, type JWK } from "jose";

const ALGORITHM = "RSA-OAEP-256";
const ENCRYPTION_HEADER = "A256GCM";

export async function encryptData(
  data: string,
  publicJwk: JWK,
  contentType = "application/json",
): Promise<string> {
  const { key_ops: _, ...jwkForImport } = publicJwk;
  const publicKey = await importJWK(jwkForImport, ALGORITHM);
  const payload = new TextEncoder().encode(data);

  return new CompactEncrypt(payload)
    .setProtectedHeader({
      alg: ALGORITHM,
      enc: ENCRYPTION_HEADER,
      kid: publicJwk.kid!,
      cty: contentType,
    })
    .encrypt(publicKey);
}

export async function decryptData(encryptedData: string, privateKey: JWK): Promise<string> {
  const { key_ops: _, ...jwkForImport } = privateKey;
  const key = await importJWK(jwkForImport, ALGORITHM);
  const { plaintext } = await compactDecrypt(encryptedData, key);
  return new TextDecoder().decode(plaintext);
}
