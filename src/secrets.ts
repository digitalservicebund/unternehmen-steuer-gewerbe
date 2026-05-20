import "dotenv/config";
import { readFileSync } from "node:fs";

export function getSecret(name: string): string {
  if (process.env.SECRETS_FILE_PATH) {
    try {
      return readFileSync(`${process.env.SECRETS_FILE_PATH}/${name}`, "utf-8").trim();
    } catch {
      return process.env[name] ?? "";
    }
  } else {
    return process.env[name] ?? "";
  }
}
