import { describe, it, expect } from "vitest";
import { getEnvironmentUrls } from "./environments";

describe("getEnvironmentUrls", () => {
  it.each(["test", "stage", "prod"])("does not throw for valid environment '%s'", (env) => {
    expect(() => getEnvironmentUrls(env)).not.toThrow();
  });

  it("throws for unknown environment", () => {
    expect(() => getEnvironmentUrls("unknown")).toThrow(
      'Unknown FIT_CONNECT_ENV: "unknown". Must be one of: test, stage, prod',
    );
  });
});
