import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getSecret } from "./secrets";

vi.mock("node:fs", () => ({
  readFileSync: vi.fn(),
}));

import { readFileSync } from "node:fs";

const mockedReadFileSync = vi.mocked(readFileSync);

const originalSecretsFilePath = process.env.SECRETS_FILE_PATH;

describe("getSecret", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedReadFileSync.mockReset();
    delete process.env.TEST_SECRET;
    delete process.env.SECRETS_FILE_PATH;
  });

  afterEach(() => {
    if (originalSecretsFilePath === undefined) {
      delete process.env.SECRETS_FILE_PATH;
    } else {
      process.env.SECRETS_FILE_PATH = originalSecretsFilePath;
    }
  });

  describe("when SECRETS_FILE_PATH is set", () => {
    beforeEach(() => {
      process.env.SECRETS_FILE_PATH = "/etc/secrets";
    });

    it("reads value from the configured file path", () => {
      mockedReadFileSync.mockReturnValue("my-secret-value\n");

      expect(getSecret("TEST_SECRET")).toBe("my-secret-value");
      expect(mockedReadFileSync).toHaveBeenCalledWith("/etc/secrets/TEST_SECRET", "utf-8");
    });

    it("respects a custom SECRETS_FILE_PATH", () => {
      process.env.SECRETS_FILE_PATH = "/var/run/custom";
      mockedReadFileSync.mockReturnValue("custom-value");

      expect(getSecret("TEST_SECRET")).toBe("custom-value");
      expect(mockedReadFileSync).toHaveBeenCalledWith("/var/run/custom/TEST_SECRET", "utf-8");
    });

    it("trims whitespace from file content", () => {
      mockedReadFileSync.mockReturnValue(" secret-with-spaces \n\r");

      expect(getSecret("TEST_SECRET")).toBe("secret-with-spaces");
    });

    it("does not fallback to process.env when the file is used", () => {
      mockedReadFileSync.mockReturnValue("file-value");
      process.env.TEST_SECRET = "env-value";

      expect(getSecret("TEST_SECRET")).toBe("file-value");
    });

    it("falls back to process.env when the secret file does not exist", () => {
      mockedReadFileSync.mockImplementation(() => {
        throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
      });
      process.env.TEST_SECRET = "env-fallback-value";

      expect(getSecret("TEST_SECRET")).toBe("env-fallback-value");
    });

    it("returns empty string when file is missing and env var is not set", () => {
      mockedReadFileSync.mockImplementation(() => {
        throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
      });

      expect(getSecret("TEST_SECRET")).toBe("");
    });
  });

  describe("when SECRETS_FILE_PATH is not set", () => {
    it("reads from process.env", () => {
      process.env.TEST_SECRET = "env-value";

      expect(getSecret("TEST_SECRET")).toBe("env-value");
      expect(mockedReadFileSync).not.toHaveBeenCalled();
    });

    it("returns an empty string when env var is not set", () => {
      expect(getSecret("TEST_SECRET")).toBe("");
      expect(mockedReadFileSync).not.toHaveBeenCalled();
    });
  });
});
