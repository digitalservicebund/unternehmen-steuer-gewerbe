import { decodeJwt, decodeProtectedHeader, importJWK, jwtVerify, type JWK } from "jose";
import { fetchJson } from "../../helpers/fetchJson";

const SIGNATURE_ALGORITHM = "PS512";
const REQUIRED_KEY_LENGTH_BITS = 4096;
const TRUSTED_ISSUER_HOST_SUFFIX_STAGE_AND_PRODUCTION = ".fit-connect.fitko.net";
const TRUSTED_ISSUER_HOST_SUFFIX_TEST = ".fit-connect.fitko.dev";

const LEISTUNG_URN_PREFIX = "urn:de:fim:leika:leistung:";
const GEBIET_URN_PREFIX = "urn:de:bund:destatis:bevoelkerungsstatistik:schluessel:rs:";

const ARS_LENGTH = 12;
// Land, Regierungsbezirk, Kreis, Gemeindeverband, Gemeinde
const ARS_SEGMENT_LENGTHS = [2, 1, 2, 4, 3];

interface JsonWebKeySet {
  keys: JWK[];
}

interface SignedService {
  leistungIDs: string[];
  gebietIDs: string[];
}

interface DestinationSignaturePayload {
  destinationId: string;
  services: SignedService[];
}

export interface VerifyDestinationSignatureOptions {
  /** JWS from the routing API (`destinationSignature`) */
  destinationSignature: string;
  /** destinationId of the same route, must match the signed one */
  destinationId: string;
  leikaKey: string;
  ars: string;
}

function isTrustedIssuer(issuer: string): boolean {
  try {
    const { protocol, hostname } = new URL(issuer);
    return (
      protocol === "https:" &&
      (hostname.endsWith(TRUSTED_ISSUER_HOST_SUFFIX_STAGE_AND_PRODUCTION) ||
        hostname.endsWith(TRUSTED_ISSUER_HOST_SUFFIX_TEST))
    );
  } catch {
    return false;
  }
}

function getKeyLengthInBits(jwk: JWK): number {
  return jwk.n === undefined ? 0 : Buffer.from(jwk.n, "base64url").length * 8;
}

function splitArsIntoSegments(ars: string): string[] {
  const paddedArs = ars.padEnd(ARS_LENGTH, "0");
  return ARS_SEGMENT_LENGTHS.map((length, index) => {
    const start = ARS_SEGMENT_LENGTHS.slice(0, index).reduce((sum, before) => sum + before, 0);
    return paddedArs.slice(start, start + length);
  });
}

interface ArsCoverageOptions {
  ars: string;
  signedArs: string;
}

/**
 * Regionalschlüssel (ARS) are hierarchical and zero-filled to the right, so a destination signed for a
 * Kreis (084210000000) is also responsible for the Gemeinden within it (084215005013), while a
 * destination signed for a single Gemeinde is not responsible for the whole Kreis.
 */
function isArsCoveredBySignedArs({ ars, signedArs }: ArsCoverageOptions): boolean {
  const arsSegments = splitArsIntoSegments(ars);
  return splitArsIntoSegments(signedArs).every(
    (signedSegment, index) => /^0+$/.test(signedSegment) || signedSegment === arsSegments[index],
  );
}

interface ResponsibilityOptions {
  services: SignedService[];
  leikaKey: string;
  ars: string;
}

function isResponsibleForLeikaKeyAndArs({
  services,
  leikaKey,
  ars,
}: ResponsibilityOptions): boolean {
  return services.some(
    ({ leistungIDs, gebietIDs }) =>
      leistungIDs.includes(`${LEISTUNG_URN_PREFIX}${leikaKey}`) &&
      gebietIDs.some(
        (gebietId) =>
          gebietId.startsWith(GEBIET_URN_PREFIX) &&
          isArsCoveredBySignedArs({ ars, signedArs: gebietId.slice(GEBIET_URN_PREFIX.length) }),
      ),
  );
}

/**
 * Verifies a route from the routing API as required by
 * https://docs.fitko.de/fit-connect/docs/sending/get-destination#signaturprüfung: PS512 header, key
 * by kid from the issuer's JWKS with 4096 bit (issuer domain is checked before the key set is
 * fetched from it), then signed destinationId, Leistung and Gebiet. Throws on any mismatch, so the
 * caller submits nothing rather than to an unverified destination.
 *
 * Deviation: the key set comes from the issuer, not from the documented fixed Destination-API host,
 * which does not hold the keys of PVOG-signed routes.
 */
export async function verifyDestinationSignature({
  destinationSignature,
  destinationId,
  leikaKey,
  ars,
}: VerifyDestinationSignatureOptions): Promise<void> {
  const { alg, kid } = decodeProtectedHeader(destinationSignature);
  if (alg !== SIGNATURE_ALGORITHM) {
    throw new Error(`Destination signature is not signed with ${SIGNATURE_ALGORITHM} but ${alg}`);
  }
  if (kid === undefined) {
    throw new Error("Destination signature has no kid");
  }

  const { iss } = decodeJwt(destinationSignature);
  if (iss === undefined || !isTrustedIssuer(iss)) {
    throw new Error(`Destination signature has an untrusted issuer: ${iss}`);
  }

  const keySet = await fetchJson<JsonWebKeySet>(`${iss}/.well-known/jwks.json`);

  const signingJwk = keySet.keys.find((key) => key.kid === kid);
  if (signingJwk === undefined) {
    throw new Error(`Key set of ${iss} has no key for kid ${kid}`);
  }

  const keyLengthInBits = getKeyLengthInBits(signingJwk);
  if (keyLengthInBits !== REQUIRED_KEY_LENGTH_BITS) {
    throw new Error(
      `Destination signature key ${kid} has ${keyLengthInBits} bit instead of ${REQUIRED_KEY_LENGTH_BITS} bit`,
    );
  }

  const signingKey = await importJWK(signingJwk, SIGNATURE_ALGORITHM);
  const { payload } = await jwtVerify<DestinationSignaturePayload>(
    destinationSignature,
    signingKey,
    { algorithms: [SIGNATURE_ALGORITHM], issuer: iss },
  );

  if (payload.destinationId !== destinationId) {
    throw new Error(
      `Routed destinationId ${destinationId} does not match the signed destinationId ${payload.destinationId}`,
    );
  }

  const responsible = isResponsibleForLeikaKeyAndArs({
    services: payload.services,
    leikaKey,
    ars,
  });
  if (!responsible) {
    throw new Error(
      `Destination ${destinationId} is not responsible for LEIKA key ${leikaKey} and ARS ${ars}`,
    );
  }
}
