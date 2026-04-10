import "dotenv/config";
import { readFileSync } from "node:fs";

export function getSecret(name: string): string {
  if (process.env.SECRETS_FILE_PATH) {
    return readFileSync(`${process.env.SECRETS_FILE_PATH}/${name}`, "utf-8").trim();
  } else {
    return process.env[name] ?? "";
  }
}
