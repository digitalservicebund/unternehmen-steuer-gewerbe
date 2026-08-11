import { describe, it, expect } from "vitest";
import { RegisterGewerbeRequestSchema } from "./registerGewerbeInterfaces";
import { registerGewerbeSampleRequestAllFieldsFilled } from "./testHelpers";

function validRequest() {
  return structuredClone(registerGewerbeSampleRequestAllFieldsFilled);
}

describe("RegisterGewerbeRequestSchema", () => {
  it("parses the fully-populated sample request", () => {
    const result = RegisterGewerbeRequestSchema.safeParse(validRequest());
    expect(result.success).toBe(true);
  });

  describe("required fields", () => {
    it.each([
      ["persönlicheDaten.vorname"],
      ["persönlicheDaten.nachname"],
      ["persönlicheDaten.geburtsdatum"],
      ["persönlicheDaten.adresse"],
      ["persönlicheDaten.telefon"],
      ["persönlicheDaten.email"],
      ["persönlicheDaten.religion"],
      ["persönlicheDaten.vertrauensniveau"],
      ["unternehmensDaten.tätigkeitsbeschreibung"],
      ["unternehmensDaten.tätigkeitsbereich"],
      ["unternehmensDaten.anmeldedatumFinanzamt"],
      ["unternehmensDaten.anmeldedatumGewerbeamt"],
      ["unternehmensDaten.gewerbeart"],
      ["unternehmensDaten.gewinnErmittlung"],
      ["unternehmensDaten.sollIstVersteuerung"],
      ["unternehmensDaten.umsatzGruendungsjahr"],
      ["unternehmensDaten.umsatzFolgejahr"],
      ["unternehmensDaten.gewinnGründungsjahr"],
      ["unternehmensDaten.gewinnFolgejahr"],
      ["unternehmensDaten.umsatzsteuerIdMitbeantragen"],
      ["persönlicheDaten.steuerId"],
    ])("fails when %s is missing", (fieldPath) => {
      const request = validRequest() as Record<string, unknown>;
      const [section, field] = fieldPath.split(".") as [string, string];
      delete (request[section] as Record<string, unknown>)[field];

      const result = RegisterGewerbeRequestSchema.safeParse(request);

      expect(result.success).toBe(false);
    });

    it.each([["persönlicheDaten"], ["unternehmensDaten"]])(
      "fails when top-level %s is missing",
      (section) => {
        const request = validRequest() as Record<string, unknown>;
        delete request[section];

        const result = RegisterGewerbeRequestSchema.safeParse(request);

        expect(result.success).toBe(false);
      },
    );
  });

  describe("optional fields", () => {
    it.each([
      ["persönlicheDaten.geburtsname"],
      ["persönlicheDaten.geburtsort"],
      ["persönlicheDaten.geburtsland"],
      ["persönlicheDaten.staatsangehörigkeitIcao"],
      ["persönlicheDaten.steuernummer"],
      ["unternehmensDaten.adresseAbweichend"],
      ["unternehmensDaten.umsatzsteuerImErstenJahr"],
    ])("succeeds and stays absent when %s is missing", (fieldPath) => {
      const request = validRequest() as Record<string, unknown>;
      const [section, field] = fieldPath.split(".") as [string, string];
      delete (request[section] as Record<string, unknown>)[field];

      const result = RegisterGewerbeRequestSchema.safeParse(request);

      expect(result.success).toBe(true);
      if (result.success) {
        const parsedSection = (result.data as Record<string, unknown>)[section] as Record<
          string,
          unknown
        >;
        expect(parsedSection[field]).toBeUndefined();
      }
    });

    it("succeeds when istVersteuerungGrund is missing and sollIstVersteuerung is not istVersteuerung", () => {
      const request = validRequest();
      delete request.unternehmensDaten.istVersteuerungGrund;

      const result = RegisterGewerbeRequestSchema.safeParse(request);

      expect(result.success).toBe(true);
    });
  });

  describe("defaults", () => {
    it.each([
      ["persönlicheDaten", "staatsangehörigkeit", "deutsch"],
      ["unternehmensDaten", "kleinunternehmerRegelung", false],
      ["unternehmensDaten", "anzahlVollzeitBeschaeftigte", 0],
      ["unternehmensDaten", "anzahlTeilzeitBeschaeftigte", 0],
      ["unternehmensDaten", "zahllastUeberschussAuswahl", "zahllast"],
      ["unternehmensDaten", "zahllastUeberschussBetrag", 0],
    ])("defaults %s.%s to %j when omitted", (section, field, defaultValue) => {
      const request = validRequest() as Record<string, unknown>;
      delete (request[section] as Record<string, unknown>)[field];

      const result = RegisterGewerbeRequestSchema.safeParse(request);

      expect(result.success).toBe(true);
      if (result.success) {
        const parsedSection = (result.data as Record<string, unknown>)[section] as Record<
          string,
          unknown
        >;
        expect(parsedSection[field]).toEqual(defaultValue);
      }
    });
  });

  describe("enum fields", () => {
    it.each([
      ["persönlicheDaten", "staatsangehörigkeit", "deutsch"],
      ["persönlicheDaten", "religion", "nichtKirchensteuerpflichtig"],
      ["persönlicheDaten", "vertrauensniveau", "substantiell"],
      ["persönlicheDaten", "staatsangehörigkeitIcao", "AUT"],
      ["unternehmensDaten", "tätigkeitsbereich", "handwerk"],
      ["unternehmensDaten", "gewerbeart", "hauptgewerbe"],
      ["unternehmensDaten", "gewinnErmittlung", "einnahmenüberschussrechnung"],
      ["unternehmensDaten", "sollIstVersteuerung", "sollVersteuerung"],
      ["unternehmensDaten", "zahllastUeberschussAuswahl", "zahllast"],
    ])("accepts a known valid value for %s.%s", (section, field, validValue) => {
      const request = validRequest() as Record<string, unknown>;
      (request[section] as Record<string, unknown>)[field] = validValue;

      const result = RegisterGewerbeRequestSchema.safeParse(request);

      expect(result.success).toBe(true);
    });

    it.each([
      ["persönlicheDaten", "staatsangehörigkeit"],
      ["persönlicheDaten", "religion"],
      ["persönlicheDaten", "vertrauensniveau"],
      ["persönlicheDaten", "staatsangehörigkeitIcao"],
      ["unternehmensDaten", "tätigkeitsbereich"],
      ["unternehmensDaten", "gewerbeart"],
      ["unternehmensDaten", "gewinnErmittlung"],
      ["unternehmensDaten", "sollIstVersteuerung"],
      ["unternehmensDaten", "zahllastUeberschussAuswahl"],
    ])("rejects an unknown value for %s.%s", (section, field) => {
      const request = validRequest() as Record<string, unknown>;
      (request[section] as Record<string, unknown>)[field] = "not-a-real-value";

      const result = RegisterGewerbeRequestSchema.safeParse(request);

      expect(result.success).toBe(false);
    });
  });

  describe("format-validated fields", () => {
    it("accepts a valid postleitzahl and rejects a malformed one", () => {
      const valid = validRequest();
      expect(RegisterGewerbeRequestSchema.safeParse(valid).success).toBe(true);

      const invalid = validRequest();
      invalid.persönlicheDaten.adresse.postleitzahl = "123";
      expect(RegisterGewerbeRequestSchema.safeParse(invalid).success).toBe(false);
    });

    it("accepts a valid strasseUndHausnummer and rejects one without a digit", () => {
      const invalid = validRequest();
      invalid.persönlicheDaten.adresse.strasseUndHausnummer = "Musterstraße";

      expect(RegisterGewerbeRequestSchema.safeParse(invalid).success).toBe(false);
    });

    it("accepts a valid telefon and rejects a malformed one", () => {
      const invalid = validRequest();
      invalid.persönlicheDaten.telefon = "0234 121314";

      expect(RegisterGewerbeRequestSchema.safeParse(invalid).success).toBe(false);
    });

    it("rejects a malformed email", () => {
      const invalid = validRequest();
      invalid.persönlicheDaten.email = "not-an-email";

      expect(RegisterGewerbeRequestSchema.safeParse(invalid).success).toBe(false);
    });

    it("accepts a valid steuernummer and rejects a malformed one", () => {
      const valid = validRequest();
      valid.persönlicheDaten.steuernummer = "2695002219428";
      expect(RegisterGewerbeRequestSchema.safeParse(valid).success).toBe(true);

      const invalid = validRequest();
      invalid.persönlicheDaten.steuernummer = "12345";
      expect(RegisterGewerbeRequestSchema.safeParse(invalid).success).toBe(false);
    });

    it("accepts a valid steuerId and rejects a malformed one", () => {
      const valid = validRequest();
      valid.persönlicheDaten.steuerId = "06646829576";
      expect(RegisterGewerbeRequestSchema.safeParse(valid).success).toBe(true);

      const invalid = validRequest();
      invalid.persönlicheDaten.steuerId = "12345";
      expect(RegisterGewerbeRequestSchema.safeParse(invalid).success).toBe(false);
    });

    it.each([
      ["persönlicheDaten", "geburtsdatum"],
      ["unternehmensDaten", "anmeldedatumFinanzamt"],
      ["unternehmensDaten", "anmeldedatumGewerbeamt"],
    ])("rejects a malformed date for %s.%s", (section, field) => {
      const request = validRequest() as Record<string, unknown>;
      (request[section] as Record<string, unknown>)[field] = "17-04-2026";

      const result = RegisterGewerbeRequestSchema.safeParse(request);

      expect(result.success).toBe(false);
    });
  });

  describe("numeric bounds", () => {
    it.each([
      ["umsatzGruendungsjahr"],
      ["umsatzFolgejahr"],
      ["zahllastUeberschussBetrag"],
      ["anzahlVollzeitBeschaeftigte"],
      ["anzahlTeilzeitBeschaeftigte"],
    ])("rejects a negative value for %s", (field) => {
      const request = validRequest();
      (request.unternehmensDaten as Record<string, unknown>)[field] = -1;

      const result = RegisterGewerbeRequestSchema.safeParse(request);

      expect(result.success).toBe(false);
    });

    it.each([["gewinnGründungsjahr"], ["gewinnFolgejahr"]])(
      "accepts a negative value for %s",
      (field) => {
        const request = validRequest();
        (request.unternehmensDaten as Record<string, unknown>)[field] = -1;

        const result = RegisterGewerbeRequestSchema.safeParse(request);

        expect(result.success).toBe(true);
      },
    );

    it.each([
      ["umsatzGruendungsjahr"],
      ["umsatzFolgejahr"],
      ["gewinnGründungsjahr"],
      ["gewinnFolgejahr"],
      ["zahllastUeberschussBetrag"],
      ["anzahlVollzeitBeschaeftigte"],
      ["anzahlTeilzeitBeschaeftigte"],
    ])("rejects a non-integer value for %s", (field) => {
      const request = validRequest();
      (request.unternehmensDaten as Record<string, unknown>)[field] = 1.5;

      const result = RegisterGewerbeRequestSchema.safeParse(request);

      expect(result.success).toBe(false);
    });
  });

  describe("sollIstVersteuerung / istVersteuerungGrund cross-field rule", () => {
    it("fails when sollIstVersteuerung is istVersteuerung and istVersteuerungGrund is missing", () => {
      const request = validRequest();
      request.unternehmensDaten.sollIstVersteuerung = "istVersteuerung";
      delete request.unternehmensDaten.istVersteuerungGrund;

      const result = RegisterGewerbeRequestSchema.safeParse(request);

      expect(result.success).toBe(false);
    });

    it("fails when sollIstVersteuerung is sollVersteuerung and istVersteuerungGrund is set", () => {
      const request = validRequest();
      request.unternehmensDaten.sollIstVersteuerung = "sollVersteuerung";
      request.unternehmensDaten.istVersteuerungGrund = "unterschreitungUmsatzgrenze";

      const result = RegisterGewerbeRequestSchema.safeParse(request);

      expect(result.success).toBe(false);
    });

    it("succeeds when sollIstVersteuerung is istVersteuerung and istVersteuerungGrund is set", () => {
      const request = validRequest();
      request.unternehmensDaten.sollIstVersteuerung = "istVersteuerung";
      request.unternehmensDaten.istVersteuerungGrund = "unterschreitungUmsatzgrenze";

      const result = RegisterGewerbeRequestSchema.safeParse(request);

      expect(result.success).toBe(true);
    });

    it("succeeds when sollIstVersteuerung is sollVersteuerung and istVersteuerungGrund is absent", () => {
      const request = validRequest();
      request.unternehmensDaten.sollIstVersteuerung = "sollVersteuerung";
      delete request.unternehmensDaten.istVersteuerungGrund;

      const result = RegisterGewerbeRequestSchema.safeParse(request);

      expect(result.success).toBe(true);
    });
  });
});
