import { describe, it, expect } from "vitest";
import { RegisterGewerbeRequestSchema } from "./registerGewerbeInterfaces";
import { registerGewerbeSampleRequestAllFieldsFilled } from "./testHelpers";

const MAX_VK_12 = 999_999_999_999;
const MAX_VK_10 = 9_999_999_999;

function parseWithUnternehmensDatenOverride(override: Record<string, unknown>) {
  return RegisterGewerbeRequestSchema.safeParse({
    ...registerGewerbeSampleRequestAllFieldsFilled,
    unternehmensDaten: {
      ...registerGewerbeSampleRequestAllFieldsFilled.unternehmensDaten,
      ...override,
    },
  });
}

describe("UnternehmensDatenSchema number field bounds", () => {
  describe.each(["umsatzGruendungsjahr", "umsatzFolgejahr"] as const)("%s", (field) => {
    it("accepts the value at the 12-digit limit", () => {
      const result = parseWithUnternehmensDatenOverride({ [field]: MAX_VK_12 });
      expect(result.success).toBe(true);
    });

    it("rejects a value one over the 12-digit limit", () => {
      const result = parseWithUnternehmensDatenOverride({ [field]: MAX_VK_12 + 1 });
      expect(result.success).toBe(false);
    });

    it("rejects a negative value", () => {
      const result = parseWithUnternehmensDatenOverride({ [field]: -1 });
      expect(result.success).toBe(false);
    });

    it("rejects a non-integer value", () => {
      const result = parseWithUnternehmensDatenOverride({ [field]: 25000.5 });
      expect(result.success).toBe(false);
    });
  });

  describe.each(["gewinnGründungsjahr", "gewinnFolgejahr"] as const)("%s", (field) => {
    it("accepts the value at the positive 12-digit limit", () => {
      const result = parseWithUnternehmensDatenOverride({ [field]: MAX_VK_12 });
      expect(result.success).toBe(true);
    });

    it("accepts the value at the negative 12-digit limit (a projected loss)", () => {
      const result = parseWithUnternehmensDatenOverride({ [field]: -MAX_VK_12 });
      expect(result.success).toBe(true);
    });

    it("rejects a value one over the positive 12-digit limit", () => {
      const result = parseWithUnternehmensDatenOverride({ [field]: MAX_VK_12 + 1 });
      expect(result.success).toBe(false);
    });

    it("rejects a value one under the negative 12-digit limit", () => {
      const result = parseWithUnternehmensDatenOverride({ [field]: -MAX_VK_12 - 1 });
      expect(result.success).toBe(false);
    });

    it("rejects a non-integer value", () => {
      const result = parseWithUnternehmensDatenOverride({ [field]: 25000.5 });
      expect(result.success).toBe(false);
    });
  });

  describe("zahllastUeberschussBetrag", () => {
    it("accepts the value at the 10-digit limit", () => {
      const result = parseWithUnternehmensDatenOverride({ zahllastUeberschussBetrag: MAX_VK_10 });
      expect(result.success).toBe(true);
    });

    it("rejects a value one over the 10-digit limit", () => {
      const result = parseWithUnternehmensDatenOverride({
        zahllastUeberschussBetrag: MAX_VK_10 + 1,
      });
      expect(result.success).toBe(false);
    });

    it("rejects a negative value", () => {
      const result = parseWithUnternehmensDatenOverride({ zahllastUeberschussBetrag: -1 });
      expect(result.success).toBe(false);
    });
  });

  describe("umsatzsteuerImErstenJahr", () => {
    it("accepts the value at the positive 10-digit limit (Zahllast)", () => {
      const result = parseWithUnternehmensDatenOverride({ umsatzsteuerImErstenJahr: MAX_VK_10 });
      expect(result.success).toBe(true);
    });

    it("accepts the value at the negative 10-digit limit (Überschuss)", () => {
      const result = parseWithUnternehmensDatenOverride({ umsatzsteuerImErstenJahr: -MAX_VK_10 });
      expect(result.success).toBe(true);
    });

    it("accepts zero", () => {
      const result = parseWithUnternehmensDatenOverride({ umsatzsteuerImErstenJahr: 0 });
      expect(result.success).toBe(true);
    });

    it("rejects a value one over the positive 10-digit limit", () => {
      const result = parseWithUnternehmensDatenOverride({
        umsatzsteuerImErstenJahr: MAX_VK_10 + 1,
      });
      expect(result.success).toBe(false);
    });

    it("rejects a value one under the negative 10-digit limit", () => {
      const result = parseWithUnternehmensDatenOverride({
        umsatzsteuerImErstenJahr: -MAX_VK_10 - 1,
      });
      expect(result.success).toBe(false);
    });

    it("rejects a non-integer value", () => {
      const result = parseWithUnternehmensDatenOverride({ umsatzsteuerImErstenJahr: 25000.5 });
      expect(result.success).toBe(false);
    });
  });
});
