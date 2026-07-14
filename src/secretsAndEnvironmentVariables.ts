import "dotenv/config";
import { readFileSync } from "node:fs";

// Credentials (keys, tokens etc.), only ever read via getSecret().
export type SecretName =
  | "AKDB_PASSWORD"
  | "AKDB_USERNAME"
  | "FIT_CONNECT_CLIENT_SECRET"
  | "FIT_CONNECT_PRIVATE_KEY_DECRYPTION_JWK";

// Configuration (URLs, IDs, feature flags), only ever read via getEnvironmentVariable().
export type EnvironmentVariableName =
  | "AKDB_BASE_URL"
  | "ERIC_ENABLE_CUSTOM_FINANZAMT_IDS"
  | "ERIC_HERSTELLERID"
  | "FIT_CONNECT_CLIENT_ID"
  | "FIT_CONNECT_DESTINATION_API_URL"
  | "FIT_CONNECT_DESTINATION_ID"
  | "FIT_CONNECT_OAUTH_TOKEN_URL"
  | "FIT_CONNECT_ROUTING_API_URL"
  | "FIT_CONNECT_SUBMISSION_API_URL"
  | "REGISTER_GEWERBE_MAX_CONCURRENCY";

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
