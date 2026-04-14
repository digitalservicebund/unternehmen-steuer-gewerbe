import FitConnectClient from "../fitConnectClient";
import { Environment } from "../fitConnectClient/environments";
import { getSecret } from "../secrets";

export function getFitConnectClient() {
  return new FitConnectClient({
    environment: (getSecret("FIT_CONNECT_ENV") || "test") as Environment,
    clientId: getSecret("FIT_CONNECT_CLIENT_ID"),
    clientSecret: getSecret("FIT_CONNECT_CLIENT_SECRET"),
    privateKey: getSecret("FIT_CONNECT_PRIVATE_KEY_DECRYPTION_JWK")
      ? JSON.parse(getSecret("FIT_CONNECT_PRIVATE_KEY_DECRYPTION_JWK"))
      : undefined,
  });
}
