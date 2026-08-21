import { z } from "@hono/zod-openapi";
import { isValidPhoneNumber } from "libphonenumber-js";
import { OfficeDetailsSchema } from "../region/regionInterfaces";
import { type Adresse, type AdresseMitHausnummer } from "../../helpers/formFieldTransformations";
import {
  UNFALLVERSICHERUNGSTRAEGER,
  UNFALLVERSICHERUNGSTRAEGER_KEYS,
  VERTRAUENSNIVEAU_KEYS,
  STAATSANGEHOERIGKEIT_KEYS,
  STAATSANGEHOERIGKEIT_ICAO_KEYS,
  GESCHLECHT_KEYS,
} from "./requestDataTransformer/xGewerbeordnungCodes";
import {
  RELIGIONSSCHLUESSEL_KEYS,
  GEWINN_ERMITTLUNG_KEYS,
  SOLL_IST_VERSTEUERUNG_KEYS,
  IST_VERSTEUERUNG_GRUND_KEYS,
  ZAHLLAST_UEBERSCHUSS_KEYS,
  ROLLE_KONTOINHABER_KEYS,
} from "./requestDataTransformer/fsECodes";

const AdresseSchema = z.object({
  strasseUndHausnummer: z
    .string()
    .regex(/^\D.*\d/)
    .openapi({
      example: "Münzgasse 2",
      description:
        "Street name followed by street number; must start with letters and contain a digit",
    }),
  postleitzahl: z
    .string()
    .regex(/^\d{5}$/)
    .openapi({ example: "01067", description: "5-digit German postal code" }),
  ort: z.string().openapi({ example: "Dresden" }),
}) satisfies z.ZodType<Adresse>;

const AdresseMitHausnummerSchema = z.object({
  strasse: z.string().min(1).openapi({ example: "Münzgasse" }),
  hausnummer: z.string().min(1).openapi({
    example: "2",
    description: 'House number; a range can be given as "8-14" or "8/14"',
  }),
  postleitzahl: z
    .string()
    .regex(/^\d{5}$/)
    .openapi({ example: "01067", description: "5-digit German postal code" }),
  ort: z.string().openapi({ example: "Dresden" }),
}) satisfies z.ZodType<AdresseMitHausnummer>;

// FsE_EUn XSD: String_MinL5_MaxL34_Musterm188614856_SType, used for both Iban and IbanAusland
const BankKontoIbanSchema = z
  .string()
  .min(5)
  .max(34)
  .regex(/^[A-Za-z]{2}\d{2}[\dA-Za-z]{1,30}$/)
  .openapi({ example: "DE02120300000000202051", description: "IBAN" });

// FsE_EUn XSD: BICBaseSType
const BankKontoBicSchema = z
  .string()
  .regex(/^[A-Za-z]{6}[\dA-Za-z]{2}([\dA-Za-z]{3})?$/)
  .openapi({
    example: "BYLADEM1SWU",
    description: "BIC; only required for a foreign IBAN.",
  });

// FsE_EUn XSD: String_MinL1_MaxL128_SType
const BankKontoKontoinhaberNameSchema = z.string().min(1).max(128).openapi({
  example: "Max Mustermann",
  description: 'Name of the account holder; only meaningful when kontoinhaber is "anderePerson".',
});

// A domestic IBAN starts with the "DE" country code (ISO 13616); anything else is foreign.
const BankKontoSchema = z
  .object({
    iban: BankKontoIbanSchema,
    bic: BankKontoBicSchema.optional(),
    kontoinhaber: z.enum(ROLLE_KONTOINHABER_KEYS),
    kontoinhaberName: BankKontoKontoinhaberNameSchema.optional(),
  })
  .refine((konto) => konto.iban.slice(0, 2).toUpperCase() === "DE" || konto.bic !== undefined, {
    error: "bic is required for a foreign IBAN (one that doesn't start with 'DE').",
    path: ["bic"],
  });

const PersönlicheDatenSchema = z.object({
  vorname: z.string().openapi({ example: "Erika" }),
  nachname: z.string().openapi({ example: "Mustermann" }),
  geburtsname: z.string().openapi({ example: "Muster" }).optional(),
  geburtsdatum: z.iso.date().openapi({ example: "1988-09-10" }),
  geburtsort: z.string().openapi({ example: "Musterstadt" }).optional(),
  geburtsland: z.string().openapi({ example: "Deutschland" }).optional(),
  staatsangehörigkeitIcao: z.enum(STAATSANGEHOERIGKEIT_ICAO_KEYS).optional().openapi({
    example: "D",
    description:
      "Citizenship of the person as an ICAO Doc 9303 nationality code (e.g. 'D' for Germany). Takes precedence over the deprecated `staatsangehörigkeit`.",
  }),
  staatsangehörigkeit: z.enum(STAATSANGEHOERIGKEIT_KEYS).default("deutsch").openapi({
    deprecated: true,
    example: "deutsch",
    description:
      "Citizenship of the person according to the code list of the German Federal Statistical Office. Defaults to 'deutsch' (code 000). Deprecated: still transmitted to the Gewerbeamt, but will stop being read in a future version.",
  }),
  adresse: AdresseSchema,
  telefon: z
    .string()
    .regex(/^\+[1-9]\d{1,14}$/)
    .refine((value) => isValidPhoneNumber(value), {
      message: "Phone number must be a valid number in E.164 format",
    })
    .openapi({
      example: "+491701234567",
      description:
        "Phone number in E.164 format: +[Country code][Subscriber number], no spaces or separators.",
    }),
  email: z.email().openapi({ example: "e.mustermann@example.org" }),
  steuerId: z
    .string()
    .regex(/^\d{11}$/)
    .openapi({
      example: "06646829576",
      description:
        "Steuerliche Identifikationsnummer (IdNr) der Person, 11 Ziffern. ELSTER prüft zusätzlich die Prüfziffer; Nummern mit führender 0 sind Test-IdNr und nur im Testbetrieb zugelassen.",
    }),
  steuernummer: z
    .string()
    .regex(/^\d{4}0\d{8}$/)
    .optional()
    .openapi({
      example: "2695002219428",
      description:
        "Bestehende Einkommensteuernummer der Person, falls bereits vorhanden (z.B. durch frühere Steuererklärungen als Arbeitnehmer). ELSTER-Format: 4 Ziffern, gefolgt von einer festen 0, gefolgt von 8 Ziffern (13 Zeichen gesamt).",
    }),
  religion: z.enum(RELIGIONSSCHLUESSEL_KEYS).openapi({
    example: "nichtKirchensteuerpflichtig",
  }),
  vertrauensniveau: z.enum(VERTRAUENSNIVEAU_KEYS).openapi({
    example: "substantiell",
    description: "Vertrauensniveau des verwendeten Identifizierungsmittels gemäß eIDAS-Verordnung",
  }),
  geschlecht: z.enum(GESCHLECHT_KEYS).openapi({
    example: "keineAngabe",
    description:
      "Geschlecht der Person gemäß urn:xoev-de:xinneres:codeliste:geschlecht_1 (Pflichtangabe in der xGewerbeordnung, SCH-EXISTS).",
  }),
});

const UnternehmensDatenSchema = z
  .object({
    adresse: AdresseMitHausnummerSchema.optional().openapi({
      example: {
        strasse: "Münzgasse",
        hausnummer: "2",
        postleitzahl: "01067",
        ort: "Dresden",
      },
      description:
        "Address of the business, if it differs from the private address. Takes precedence over the deprecated `adresseAbweichend`.",
    }),
    adresseAbweichend: AdresseSchema.optional().openapi({
      deprecated: true,
      example: {
        strasseUndHausnummer: "Münzgasse 2",
        postleitzahl: "01067",
        ort: "Dresden",
      },
      description:
        "Deprecated: use `adresse` instead, which takes street and house number as separate fields. Still read while `adresse` is optional.",
    }),
    bankKonto: z
      .object({
        personensteuerkonto: BankKontoSchema.openapi({
          example: {
            iban: "DE02120300000000202051",
            bic: "BYLADEM1SWU",
            kontoinhaber: "steuerpflichtigePerson",
          },
          description:
            "Rule: 'kontoinhaber: steuerpflichtigePerson' must not go with using 'kontoinhaberName'",
        }),
        betriebssteuerkonto: BankKontoSchema.optional().openapi({
          example: {
            iban: "DE02120300000000202051",
            bic: "BYLADEM1SWU",
            kontoinhaber: "anderePerson",
            kontoinhaberName: "Friedo Müller",
          },
          description: "Rule: 'kontoinhaber: anderePerson' requires 'kontoinhaberName'",
        }),
      })
      .optional()
      .openapi({
        description: "Bank accounts for private and optional business taxes.",
      }),
    geschäftsbezeichnung: z.string().max(120).optional().openapi({
      example: "Musterhandel",
      description:
        "Bezeichnung des Unternehmens, falls abweichend vom Namen des Gewerbetreibenden.",
    }),
    tätigkeitsbeschreibung: z.string().min(1).openapi({ example: "Vertrieb von Vertriebsmustern" }),
    tätigkeitsbeschreibungKurz: z.string().min(1).max(200).optional().openapi({
      example: "Vertrieb von Mustern",
      description:
        "Kurzfassung der Tätigkeitsbeschreibung für den FsE (max. 200 Zeichen). Fehlt sie, wird `tätigkeitsbeschreibung` auf 200 Zeichen gekürzt.",
    }),
    tätigkeitsbereich: z
      .enum(["industrie", "handwerk", "handel", "sonstiges"])
      .openapi({ example: "handwerk" }),
    anmeldedatumFinanzamt: z.iso.date().openapi({
      example: "2026-04-17",
      description: "Date reported to the Finanzamt as the start of business activity.",
    }),
    anmeldedatumGewerbeamt: z.iso.date().openapi({
      example: "2026-04-17",
      description: "Date reported to the Gewerbeamt as the business's founding date.",
    }),
    gewerbeart: z.enum(["hauptgewerbe", "nebengewerbe"]).openapi({ example: "hauptgewerbe" }),
    istReisegewerbe: z.literal(false).openapi({
      example: false,
      description: "Handelt es sich um ein Reisegewerbe? Aktuell wird nur 'false' unterstützt.",
    }),
    rechtsform: z.literal("nichtEingetragenesEinzelunternehmen").openapi({
      example: "nichtEingetragenesEinzelunternehmen",
      description:
        "Rechtsform des Unternehmens. Aktuell wird nur 'nichtEingetragenesEinzelunternehmen' unterstützt.",
    }),
    gründungsart: z.literal("neugründung").openapi({
      example: "neugründung",
      description:
        "Anlass der Gründung: Grund der Gewerbeanmeldung (xGewerbeordnung) und Gründungsform (FsE). Aktuell wird nur 'neugründung' unterstützt.",
    }),
    artBetriebsstaette: z.literal("hauptniederlassung").openapi({
      example: "hauptniederlassung",
      description:
        "Art der Betriebsstätte gemäß urn:xoev-de:xunternehmen:codeliste:artniederlassung_1. Aktuell wird nur 'hauptniederlassung' unterstützt.",
    }),
    beteiligungOeffentlicheHand: z.literal("nein").openapi({
      example: "nein",
      description:
        "Liegt eine Beteiligung der öffentlichen Hand vor? Aktuell wird nur 'nein' unterstützt.",
    }),
    anzahlVollzeitBeschaeftigte: z.number().int().min(0).default(0).openapi({
      example: 0,
      description:
        "Anzahl der Vollzeitbeschäftigten (inklusive Ehe- oder Lebenspartner, Aushilfen, jedoch stets ohne den Inhaber selbst), die zum Zeitpunkt der Gewerbemeldung in der Betriebsstätte tätig sind.",
    }),
    anzahlTeilzeitBeschaeftigte: z.number().int().min(0).default(0).openapi({
      example: 0,
      description:
        "Anzahl der Teilzeitbeschäftigten (inklusive Ehe- oder Lebenspartner, Aushilfen, jedoch stets ohne den Inhaber selbst), die zum Zeitpunkt der Gewerbemeldung in der Betriebsstätte tätig sind.",
    }),
    gewinnErmittlung: z.enum(GEWINN_ERMITTLUNG_KEYS).openapi({
      example: "einnahmenüberschussrechnung",
      description:
        "Method of profit calculation. Enumeration:\n- einnahmenüberschussrechnung\n- betriebsvermögensvergleich (Bilanz mit Gewinn- und Verlustrechnung)\n- gewinnermittlungDurchschnittssätze (nur bei Land- und Forstwirtschaft)]\n- sonstige (z. B. § 5a EStG)]",
    }),
    kleinunternehmerRegelung: z.boolean().openapi({
      example: false,
      description: "Wird die Kleinunternehmer-Regelung (§ 19 UStG) in Anspruch genommen?",
    }),
    umsatzGruendungsjahr: z.number().int().min(0).openapi({
      example: 25000,
      description: "Voraussichtlicher Gesamtumsatz (in Euro) im Jahr der Betriebseröffnung.",
    }),
    umsatzFolgejahr: z.number().int().min(0).openapi({
      example: 26000,
      description: "Voraussichtlicher Gesamtumsatz (in Euro) im Folgejahr.",
    }),
    umsatzsteuerIdMitbeantragen: z.boolean().openapi({
      example: false,
      description: "Soll mit dem FsE auch eine UmsatzsteuerId mitbeantragt werden?",
    }),
    gewinnGründungsjahr: z.number().int().openapi({
      example: 25000,
      description:
        "Voraussichtlicher Gewinn (in Euro) im Jahr der Betriebseröffnung. Negativ bei Verlust.",
    }),
    gewinnFolgejahr: z.number().int().openapi({
      example: 26000,
      description: "Voraussichtlicher Gewinn (in Euro) im Folgejahr. Negativ bei Verlust.",
    }),
    sollIstVersteuerung: z.enum(SOLL_IST_VERSTEUERUNG_KEYS).openapi({
      example: "istVersteuerung",
      description: "Art der Umsatzbesteuerung gemäß § 16 bzw. § 20 UStG.",
    }),
    istVersteuerungGrund: z.enum(IST_VERSTEUERUNG_GRUND_KEYS).optional().openapi({
      example: "unterschreitungUmsatzgrenze",
      description:
        "Begründung für die beantragte Istversteuerung. Verpflichtend, wenn `sollIstVersteuerung` auf `istVersteuerung` gesetzt ist; andernfalls weglassen.",
    }),
    zahllastUeberschussAuswahl: z.enum(ZAHLLAST_UEBERSCHUSS_KEYS).default("zahllast").openapi({
      example: "zahllast",
      description: "Ob voraussichtlich eine Zahllast oder ein Überschuss erwartet wird.",
    }),
    zahllastUeberschussBetrag: z.number().int().min(0).default(0).openapi({
      example: 0,
      description: "Voraussichtliche Zahllast oder Überschuss in Euro.",
    }),
    umsatzsteuerImErstenJahr: z.int().optional().openapi({
      example: 100,
      description:
        "Deprecated. Use 'zahllastUeberschussAuswahl'/'zahllastUeberschussBetrag' instead. (Voraussichtliche Umsatzsteuer im ersten Jahr. Größer als 0 => Nutzer hat 'Zahllast' => muss was bezahlen; kleiner oder gleich 0 => 'Überschuss' => Rückzahlung vom / Guthaben beim Finanzamt.)",
      deprecated: true,
    }),
  })
  .refine(
    (data) => {
      return (
        data.sollIstVersteuerung !== "istVersteuerung" || data.istVersteuerungGrund !== undefined
      );
    },
    {
      error:
        "istVersteuerungGrund is required when sollIstVersteuerung is set to 'istVersteuerung'.",
      path: ["istVersteuerungGrund"],
    },
  )
  .refine(
    (data) => {
      return (
        data.sollIstVersteuerung === "istVersteuerung" || data.istVersteuerungGrund === undefined
      );
    },
    {
      error: "istVersteuerungGrund must only be set when sollIstVersteuerung is 'istVersteuerung'.",
      path: ["istVersteuerungGrund"],
    },
  );

const unfallversicherungstraegerCodesDescription = Object.entries(UNFALLVERSICHERUNGSTRAEGER)
  .map(([name, code]) => `- \`${name}\` (${code})`)
  .join("\n");

// Not used while SCH-0007 requires bisherigeUnfallversicherung to stay empty (see transform)
const _BisherigeUnfallversicherungSchema = z
  .object({
    traeger: z.enum(UNFALLVERSICHERUNGSTRAEGER_KEYS).openapi({
      example: "verwaltungsBerufsgenossenschaft",
      description: `Schlüssel des Trägers der bisherigen gesetzlichen Unfallversicherung. Mögliche Werte: ${unfallversicherungstraegerCodesDescription},`,
    }),
    unternehmensnummer: z.string().length(15).optional().openapi({
      example: "123456789012345",
      description:
        "Company number from the previous 'Unfallversicherung' (formerly membership number). Must be exactly 15 characters long.",
    }),
  })
  .openapi("BisherigeUnfallversicherung");

export const ErrorTypeSchema = z.enum(["validation_error", "upstream_error", "invalid_data"]);

export const RegisterGewerbeRequestSchema = z
  .object({
    persönlicheDaten: PersönlicheDatenSchema,
    unternehmensDaten: UnternehmensDatenSchema,
  })
  .openapi("RegisterGewerbeRequest");

export type RegisterGewerbeRequest = z.infer<typeof RegisterGewerbeRequestSchema>;

const RegisterGewerbeResponseItemSchema = z.object({
  success: z.boolean(),
  submissionId: z.string().optional(),
  // Routing context for the events endpoint, echoed back to the client 1:1.
  // ars is always set for the gewerbeanmeldung item; fitConnectDestinationId only
  // when the submission was sent via FIT-Connect (its absence marks OSCI).
  ars: z.string().optional(),
  fitConnectDestinationId: z.string().optional(),
  info: z.string().optional(),
  errorType: ErrorTypeSchema.optional(),
  pdfReceiptBase64: z.base64().optional(),
  officeDetails: OfficeDetailsSchema.optional(),
});

export type RegisterGewerbeResponseItem = z.infer<typeof RegisterGewerbeResponseItemSchema>;

export const RegisterGewerbeResponseSchema = z
  .object({
    gewerbeanmeldung: RegisterGewerbeResponseItemSchema.optional(),
    fseÜbermittlung: RegisterGewerbeResponseItemSchema.optional(),
  })
  .openapi("RegisterGewerbeResponse");
