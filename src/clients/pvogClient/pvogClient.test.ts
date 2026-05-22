import { describe, expect, it } from "vitest";
import { getAGSandARS } from "./pvogClient";

describe("PVOG client", () => {
  it("should return AGS (Amtlicher Gemeindeschlüssel) 08421000 and ARS (Amtlicher Regionalschlüssel) 084210000000 for zip code 89073", async () => {
    const result = await getAGSandARS("89073");

    expect(result.ags).toBe("08421000");
    expect(result.ars).toBe("084210000000");
  });
});
