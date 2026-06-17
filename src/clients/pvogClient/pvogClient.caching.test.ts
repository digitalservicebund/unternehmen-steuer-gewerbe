import { describe, expect, it, beforeEach, vi } from "vitest";

const { fetchJsonMock } = vi.hoisted(() => ({ fetchJsonMock: vi.fn() }));
vi.mock("../../helpers/fetchJson", () => ({ fetchJson: fetchJsonMock }));

import { getAGSandARS } from "./pvogClient";

describe("PVOG client caching", () => {
  beforeEach(() => {
    fetchJsonMock.mockReset();
    fetchJsonMock.mockResolvedValue([{ ags: "08421000", ars: "084210000000" }]);
  });

  it("collapses concurrent lookups for the same zip into a single request", async () => {
    await Promise.all(Array.from({ length: 100 }, () => getAGSandARS("89073")));

    expect(fetchJsonMock).toHaveBeenCalledTimes(1);
  });

  it("serves repeated lookups for the same zip from cache", async () => {
    await getAGSandARS("90402");
    await getAGSandARS("90402");

    expect(fetchJsonMock).toHaveBeenCalledTimes(1);
  });

  it("does not cache failed lookups", async () => {
    fetchJsonMock.mockRejectedValueOnce(new Error("timeout"));

    await expect(getAGSandARS("10115")).rejects.toThrow("timeout");
    await expect(getAGSandARS("10115")).resolves.toEqual({
      ags: "08421000",
      ars: "084210000000",
    });
    expect(fetchJsonMock).toHaveBeenCalledTimes(2);
  });
});
