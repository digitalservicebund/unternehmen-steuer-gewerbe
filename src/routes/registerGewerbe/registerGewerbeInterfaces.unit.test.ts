import { describe, it, expect } from "vitest";
import {
  RegisterGewerbeRequestSchema,
  type RegisterGewerbeRequest,
} from "./registerGewerbeInterfaces";
import { registerGewerbeSampleRequestAllFieldsFilled } from "./testHelpers";
import { type AdresseMitHausnummer } from "../../helpers/formFieldTransformations";

const MAX_VK_12 = 999_999_999_999;
const MIN_VK_12_SIGNED = -99_999_999_999;
const MAX_VK_10 = 9_999_999_999;

// Outside the ELSTER "Standard_E_V2" charset
const CHAR_OUTSIDE_CHARSET = "😀";

const sampleUnternehmensAdresse: AdresseMitHausnummer = {
  strasse: "Prinzessinnenstraße",
  hausnummer: "8",
  postleitzahl: "10969",
  ort: "Berlin",
};

function validRequest() {
  return structuredClone(registerGewerbeSampleRequestAllFieldsFilled);
}

function parseWithUnternehmensAdresse(overrides: Partial<AdresseMitHausnummer>) {
  const request = validRequest();
  request.unternehmensDaten.adresse = { ...sampleUnternehmensAdresse, ...overrides };
  return RegisterGewerbeRequestSchema.safeParse(request);
}

function parseWithFieldDeleted(section: string, field: string) {
  const request = validRequest() as Record<string, unknown>;
  delete (request[section] as Record<string, unknown>)[field];
  return RegisterGewerbeRequestSchema.safeParse(request);
}

function parseWithFieldSet(section: string, field: string, value: unknown) {
  const request = validRequest() as Record<string, unknown>;
  (request[section] as Record<string, unknown>)[field] = value;
  return RegisterGewerbeRequestSchema.safeParse(request);
}

describe("RegisterGewerbeRequestSchema", () => {
  it("parses the fully-populated sample request", () => {
    const result = RegisterGewerbeRequestSchema.safeParse(validRequest());
    expect(result.success).toBe(true);
  });

  it("parses unternehmensDaten.adresse with a separate strasse and hausnummer", () => {
    const request = validRequest();
    request.unternehmensDaten.adresse = {
      strasse: "Prinzessinnenstraße",
      hausnummer: "8-14",
      postleitzahl: "10969",
      ort: "Berlin",
    };

    expect(RegisterGewerbeRequestSchema.safeParse(request).success).toBe(true);
  });

  describe("required fields", () => {
    it.each([
      ["persönlicheDaten.vorname"],
      ["persönlicheDaten.nachname"],
      ["persönlicheDaten.geburtsdatum"],
      ["persönlicheDaten.geschlecht"],
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
      ["unternehmensDaten.istReisegewerbe"],
      ["unternehmensDaten.rechtsform"],
      ["unternehmensDaten.gründungsart"],
      ["unternehmensDaten.artBetriebsstaette"],
      ["unternehmensDaten.beteiligungOeffentlicheHand"],
      ["unternehmensDaten.gewinnErmittlung"],
      ["unternehmensDaten.kleinunternehmerRegelung"],
      ["unternehmensDaten.sollIstVersteuerung"],
      ["unternehmensDaten.umsatzGruendungsjahr"],
      ["unternehmensDaten.umsatzFolgejahr"],
      ["unternehmensDaten.gewinnGründungsjahr"],
      ["unternehmensDaten.gewinnFolgejahr"],
      ["unternehmensDaten.umsatzsteuerIdMitbeantragen"],
      ["persönlicheDaten.steuerId"],
    ])("fails when %s is missing", (fieldPath) => {
      const [section, field] = fieldPath.split(".") as [string, string];

      expect(parseWithFieldDeleted(section, field).success).toBe(false);
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
      ["unternehmensDaten.tätigkeitsbeschreibungKurz"],
      ["unternehmensDaten.umsatzsteuerImErstenJahr"],
    ])("succeeds and stays absent when %s is missing", (fieldPath) => {
      const [section, field] = fieldPath.split(".") as [string, string];
      const result = parseWithFieldDeleted(section, field);

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
      ["unternehmensDaten", "anzahlVollzeitBeschaeftigte", 0],
      ["unternehmensDaten", "anzahlTeilzeitBeschaeftigte", 0],
      ["unternehmensDaten", "zahllastUeberschussAuswahl", "zahllast"],
      ["unternehmensDaten", "zahllastUeberschussBetrag", 0],
    ])("defaults %s.%s to %j when omitted", (section, field, defaultValue) => {
      const result = parseWithFieldDeleted(section, field);

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
      ["persönlicheDaten", "geschlecht", "weiblich"],
      ["unternehmensDaten", "tätigkeitsbereich", "handwerk"],
      ["unternehmensDaten", "gewerbeart", "hauptgewerbe"],
      ["unternehmensDaten", "gewinnErmittlung", "einnahmenüberschussrechnung"],
      ["unternehmensDaten", "sollIstVersteuerung", "sollVersteuerung"],
      ["unternehmensDaten", "zahllastUeberschussAuswahl", "zahllast"],
    ])("accepts a known valid value for %s.%s", (section, field, validValue) => {
      expect(parseWithFieldSet(section, field, validValue).success).toBe(true);
    });

    it.each([
      ["persönlicheDaten", "staatsangehörigkeit"],
      ["persönlicheDaten", "religion"],
      ["persönlicheDaten", "vertrauensniveau"],
      ["persönlicheDaten", "staatsangehörigkeitIcao"],
      ["persönlicheDaten", "geschlecht"],
      ["unternehmensDaten", "tätigkeitsbereich"],
      ["unternehmensDaten", "gewerbeart"],
      ["unternehmensDaten", "gewinnErmittlung"],
      ["unternehmensDaten", "sollIstVersteuerung"],
      ["unternehmensDaten", "zahllastUeberschussAuswahl"],
      ["unternehmensDaten", "gründungsart"],
    ])("rejects an unknown value for %s.%s", (section, field) => {
      expect(parseWithFieldSet(section, field, "not-a-real-value").success).toBe(false);
    });

    it.each([
      ["unternehmensDaten", "istReisegewerbe", true],
      ["unternehmensDaten", "rechtsform", "eingetragenesEinzelunternehmen"],
      ["unternehmensDaten", "gründungsart", "übernahme"],
      ["unternehmensDaten", "artBetriebsstaette", "zweigniederlassung"],
      ["unternehmensDaten", "beteiligungOeffentlicheHand", "ja"],
    ])("rejects the currently unsupported %s.%s value %j", (section, field, unsupportedValue) => {
      expect(parseWithFieldSet(section, field, unsupportedValue).success).toBe(false);
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

    it.each([
      [
        "hausnummer",
        { strasse: "Prinzessinnenstraße", hausnummer: "", postleitzahl: "10969", ort: "Berlin" },
      ],
      ["strasse", { strasse: "", hausnummer: "8", postleitzahl: "10969", ort: "Berlin" }],
    ] as const)("rejects an empty %s in unternehmensDaten.adresse", (_field, adresse) => {
      const invalid = validRequest();
      invalid.unternehmensDaten.adresse = adresse;

      expect(RegisterGewerbeRequestSchema.safeParse(invalid).success).toBe(false);
    });

    it("rejects the postleitzahl 00123 in persönlicheDaten.adresse", () => {
      const invalid = validRequest();
      invalid.persönlicheDaten.adresse.postleitzahl = "00123";

      expect(RegisterGewerbeRequestSchema.safeParse(invalid).success).toBe(false);
    });

    it("rejects the postleitzahl 00123 in unternehmensDaten.adresse", () => {
      expect(parseWithUnternehmensAdresse({ postleitzahl: "00123" }).success).toBe(false);
    });

    it.each([
      ["a digit", "Dresden 2"],
      ["a character outside the charset", `Dresden${CHAR_OUTSIDE_CHARSET}`],
      ["more than 72 characters", "D".repeat(73)],
    ])("rejects an ort with %s", (_label, value) => {
      const invalid = validRequest();
      invalid.persönlicheDaten.adresse.ort = value;

      expect(RegisterGewerbeRequestSchema.safeParse(invalid).success).toBe(false);
    });

    it("rejects an empty ort", () => {
      const invalid = validRequest();
      invalid.persönlicheDaten.adresse.ort = "";

      expect(RegisterGewerbeRequestSchema.safeParse(invalid).success).toBe(false);
    });

    it("accepts the ort Frankfurt (Oder)", () => {
      const request = validRequest();
      request.persönlicheDaten.adresse.ort = "Frankfurt (Oder)";

      expect(RegisterGewerbeRequestSchema.safeParse(request).success).toBe(true);
    });

    it("rejects the ort Berlin 2 in unternehmensDaten.adresse", () => {
      expect(parseWithUnternehmensAdresse({ ort: "Berlin 2" }).success).toBe(false);
    });

    it.each([
      ["a character outside the charset", `Münzgasse${CHAR_OUTSIDE_CHARSET}`],
      ["more than 72 characters", "M".repeat(73)],
    ])("rejects a strasse with %s", (_label, value) => {
      expect(parseWithUnternehmensAdresse({ strasse: value }).success).toBe(false);
    });

    it.each([["8"], ["8-14"], ["8/14"], ["42a"], ["42 a"], ["8 - 14"]])(
      "accepts the hausnummer %s",
      (value) => {
        expect(parseWithUnternehmensAdresse({ hausnummer: value }).success).toBe(true);
      },
    );

    it.each([["abc"], ["12345"], ["8-1234567"], ["8-14-20"]])(
      "rejects the hausnummer %s",
      (value) => {
        expect(parseWithUnternehmensAdresse({ hausnummer: value }).success).toBe(false);
      },
    );

    describe("telefon (E.164)", () => {
      it.each([["+14155552671"], ["+491701234567"], ["+4930183948"]])(
        "accepts a valid E.164 number %s",
        (value) => {
          const request = validRequest();
          request.persönlicheDaten.telefon = value;

          expect(RegisterGewerbeRequestSchema.safeParse(request).success).toBe(true);
        },
      );

      it.each([
        ["+49 234 121314"], // old DIN 5008 formatting (spaces) is no longer accepted
        ["0234 121314"], // missing leading +
        ["+49-234-121314"], // dashes are not allowed
        ["+4917012345678901"], // exceeds the 15-digit E.164 max
        ["not-a-number"],
        // format looks plausible but is not a real, dialable German number -
        // this is the case a bare regex can't catch and libphonenumber-js can
        ["+4900000000000"],
      ])("rejects malformed or invalid value %s", (value) => {
        const request = validRequest();
        request.persönlicheDaten.telefon = value;

        expect(RegisterGewerbeRequestSchema.safeParse(request).success).toBe(false);
      });
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
      expect(parseWithFieldSet(section, field, "17-04-2026").success).toBe(false);
    });
  });

  describe("numeric bounds", () => {
    const upperLimits = [
      ["umsatzGruendungsjahr", MAX_VK_12],
      ["umsatzFolgejahr", MAX_VK_12],
      ["gewinnGründungsjahr", MAX_VK_12],
      ["gewinnFolgejahr", MAX_VK_12],
      ["zahllastUeberschussBetrag", MAX_VK_10],
      ["umsatzsteuerImErstenJahr", MAX_VK_10],
    ] as const;

    const lowerLimits = [
      ["gewinnGründungsjahr", MIN_VK_12_SIGNED],
      ["gewinnFolgejahr", MIN_VK_12_SIGNED],
      ["umsatzsteuerImErstenJahr", -MAX_VK_10],
    ] as const;

    it.each([
      ["umsatzGruendungsjahr"],
      ["umsatzFolgejahr"],
      ["zahllastUeberschussBetrag"],
      ["anzahlVollzeitBeschaeftigte"],
      ["anzahlTeilzeitBeschaeftigte"],
    ])("rejects a negative value for %s", (field) => {
      expect(parseWithFieldSet("unternehmensDaten", field, -1).success).toBe(false);
    });

    it.each([["gewinnGründungsjahr"], ["gewinnFolgejahr"]])(
      "accepts a negative value for %s",
      (field) => {
        expect(parseWithFieldSet("unternehmensDaten", field, -1).success).toBe(true);
      },
    );

    it.each([
      ["umsatzGruendungsjahr"],
      ["umsatzFolgejahr"],
      ["gewinnGründungsjahr"],
      ["gewinnFolgejahr"],
      ["zahllastUeberschussBetrag"],
      ["umsatzsteuerImErstenJahr"],
      ["anzahlVollzeitBeschaeftigte"],
      ["anzahlTeilzeitBeschaeftigte"],
    ])("rejects a non-integer value for %s", (field) => {
      expect(parseWithFieldSet("unternehmensDaten", field, 1.5).success).toBe(false);
    });

    it.each(upperLimits)("accepts %s at its maximum %d", (field, maximum) => {
      expect(parseWithFieldSet("unternehmensDaten", field, maximum).success).toBe(true);
    });

    it.each(upperLimits)("rejects %s one above its maximum %d", (field, maximum) => {
      expect(parseWithFieldSet("unternehmensDaten", field, maximum + 1).success).toBe(false);
    });

    it.each(lowerLimits)("accepts %s at its minimum %d", (field, minimum) => {
      expect(parseWithFieldSet("unternehmensDaten", field, minimum).success).toBe(true);
    });

    it.each(lowerLimits)("rejects %s one below its minimum %d", (field, minimum) => {
      expect(parseWithFieldSet("unternehmensDaten", field, minimum - 1).success).toBe(false);
    });
  });

  describe("string length bounds", () => {
    it.each([["tätigkeitsbeschreibung"], ["tätigkeitsbeschreibungKurz"]])(
      "rejects an empty string for %s",
      (field) => {
        expect(parseWithFieldSet("unternehmensDaten", field, "").success).toBe(false);
      },
    );

    it("rejects a tätigkeitsbeschreibungKurz longer than 200 characters", () => {
      const request = validRequest();
      request.unternehmensDaten.tätigkeitsbeschreibungKurz = "a".repeat(201);

      const result = RegisterGewerbeRequestSchema.safeParse(request);

      expect(result.success).toBe(false);
    });

    it("accepts an empty geschäftsbezeichnung", () => {
      expect(parseWithFieldSet("unternehmensDaten", "geschäftsbezeichnung", "").success).toBe(true);
    });
  });

  describe("charset-validated fields", () => {
    const invalidValue = `Muster${CHAR_OUTSIDE_CHARSET}`;

    it.each([
      {
        label: "geschäftsbezeichnung",
        setup: (request: RegisterGewerbeRequest) => {
          request.unternehmensDaten.geschäftsbezeichnung = invalidValue;
        },
      },
      {
        label: "adresseEigenerWebshop",
        setup: (request: RegisterGewerbeRequest) => {
          request.unternehmensDaten.onlinehandel!.adresseEigenerWebshop = invalidValue;
        },
      },
      {
        label: "nameMarktplatz",
        setup: (request: RegisterGewerbeRequest) => {
          request.unternehmensDaten.onlinehandel!.onlineMarktplatz![0].nameMarktplatz =
            invalidValue;
        },
      },
      {
        label: "nameAccount of an onlineMarktplatz",
        setup: (request: RegisterGewerbeRequest) => {
          request.unternehmensDaten.onlinehandel!.onlineMarktplatz![0].nameAccount = invalidValue;
        },
      },
      {
        label: "namePlattform",
        setup: (request: RegisterGewerbeRequest) => {
          request.unternehmensDaten.influencer!.plattform![0].namePlattform = invalidValue;
        },
      },
      {
        label: "nameAccount of a plattform",
        setup: (request: RegisterGewerbeRequest) => {
          request.unternehmensDaten.influencer!.plattform![0].nameAccount = invalidValue;
        },
      },
      {
        label: "kontoinhaberName",
        setup: (request: RegisterGewerbeRequest) => {
          request.unternehmensDaten.bankKonto!.betriebssteuerkonto!.kontoinhaberName = invalidValue;
        },
      },
    ])("rejects $label with a character outside the charset", ({ setup }) => {
      const request = validRequest();
      setup(request);

      expect(RegisterGewerbeRequestSchema.safeParse(request).success).toBe(false);
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

  describe("bankKonto iban / bic cross-field rule", () => {
    it("fails when personensteuerkonto's iban is foreign and bic is missing", () => {
      const request = validRequest();
      request.unternehmensDaten.bankKonto!.personensteuerkonto.iban = "FR7630006000011234567890189";
      delete request.unternehmensDaten.bankKonto!.personensteuerkonto.bic;

      const result = RegisterGewerbeRequestSchema.safeParse(request);

      expect(result.success).toBe(false);
    });

    it("succeeds when personensteuerkonto's iban is foreign and bic is set", () => {
      const request = validRequest();
      request.unternehmensDaten.bankKonto!.personensteuerkonto.iban = "FR7630006000011234567890189";
      request.unternehmensDaten.bankKonto!.personensteuerkonto.bic = "AGRIFRPP";

      const result = RegisterGewerbeRequestSchema.safeParse(request);

      expect(result.success).toBe(true);
    });

    it("succeeds when personensteuerkonto's iban is domestic and bic is absent", () => {
      const request = validRequest();
      request.unternehmensDaten.bankKonto!.personensteuerkonto.iban = "DE02120300000000202051";
      delete request.unternehmensDaten.bankKonto!.personensteuerkonto.bic;

      const result = RegisterGewerbeRequestSchema.safeParse(request);

      expect(result.success).toBe(true);
    });
  });
});
