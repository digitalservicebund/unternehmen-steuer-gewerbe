import { describe, it, expect } from "vitest";
import { RegionParamsSchema, RegionQuerySchema, OfficeDetailsSchema } from "./regionInterfaces";

describe("RegionParamsSchema", () => {
  it("requires a 5-digit plz", () => {
    expect(RegionParamsSchema.safeParse({ plz: "25813" }).success).toBe(true);
    expect(RegionParamsSchema.safeParse({ plz: "123" }).success).toBe(false);
    expect(RegionParamsSchema.safeParse({}).success).toBe(false);
  });
});

describe("RegionQuerySchema", () => {
  it("makes ort, strasse and hausnummer optional", () => {
    const result = RegionQuerySchema.safeParse({});

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.ort).toBeUndefined();
      expect(result.data.strasse).toBeUndefined();
      expect(result.data.hausnummer).toBeUndefined();
    }
  });

  it("defaults getAllOffices to false when omitted", () => {
    const result = RegionQuerySchema.safeParse({});

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.getAllOffices).toBe(false);
    }
  });

  it.each([
    ["true", true],
    ["false", false],
  ])("coerces getAllOffices string %s to boolean %s", (input, expected) => {
    const result = RegionQuerySchema.safeParse({ getAllOffices: input });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.getAllOffices).toBe(expected);
    }
  });
});

describe("OfficeDetailsSchema", () => {
  it("only requires name", () => {
    const result = OfficeDetailsSchema.safeParse({ name: "Finanzamt Musterstadt" });

    expect(result.success).toBe(true);
  });

  it("fails when name is missing", () => {
    const result = OfficeDetailsSchema.safeParse({});

    expect(result.success).toBe(false);
  });
});
