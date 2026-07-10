import "dotenv/config";
import { readFileSync } from "node:fs";

// Credentials and key material, only ever read via getSecret().
export const SECRET_NAMES = [
  "AKDB_USERNAME",
  "AKDB_PASSWORD",
  "FIT_CONNECT_CLIENT_SECRET",
  "FIT_CONNECT_PRIVATE_KEY_DECRYPTION_JWK",
] as const;

// Plain configuration (URLs, IDs, feature flags), only ever read via getEnvironmentVariable().
export const ENVIRONMENT_VARIABLE_NAMES = [
  "FIT_CONNECT_OAUTH_TOKEN_URL",
  "FIT_CONNECT_SUBMISSION_API_URL",
  "FIT_CONNECT_DESTINATION_API_URL",
  "FIT_CONNECT_ROUTING_API_URL",
  "FIT_CONNECT_CLIENT_ID",
  "FIT_CONNECT_DESTINATION_ID",
  "ERIC_HERSTELLERID",
  "ERIC_ENABLE_CUSTOM_FINANZAMT_IDS",
  "AKDB_BASE_URL",
] as const;

export type SecretName = (typeof SECRET_NAMES)[number];
export type EnvironmentVariableName = (typeof ENVIRONMENT_VARIABLE_NAMES)[number];

export function getSecret(name: SecretName): string {
  if (process.env.SECRETS_FILE_PATH) {
    try {
      return readFileSync(`${process.env.SECRETS_FILE_PATH}/${name}`, "utf-8").trim();
    } catch {
      // fall through to the process.env fallback below
    }
  }
  return process.env[name] ?? "";
}

export function getEnvironmentVariable(name: EnvironmentVariableName): string {
  return process.env[name] ?? "";
}
