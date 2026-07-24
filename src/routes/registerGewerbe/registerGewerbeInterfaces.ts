import { z } from "@hono/zod-openapi";
import { OfficeDetailsSchema } from "../region/regionInterfaces";
import {
  UNFALLVERSICHERUNGSTRAEGER,
  UNFALLVERSICHERUNGSTRAEGER_KEYS,
  VERTRAUENSNIVEAU_KEYS,
  STAATSANGEHOERIGKEIT_KEYS,
} from "./requestDataTransformer/xGewerbeordnungCodes";
import {
  RELIGIONSSCHLUESSEL_KEYS,
  GEWINN_ERMITTLUNG_KEYS,
  SOLL_IST_VERSTEUERUNG_KEYS,
  IST_VERSTEUERUNG_GRUND_KEYS,
  ZAHLLAST_UEBERSCHUSS_KEYS,
} from "./requestDataTransformer/fsECodes";

// ELSTER "Standard_E_V2" charset (FsE StringBaseSType) — no line breaks.
const STANDARD_E_V2_CHARS =
  "\\x20-\\x7E\\xA1-\\xA3\\xA5\\xA7\\xAA-\\xAC\\xAE-\\xB3\\xB5\\xB9-\\xBB\\xBF-\\xFF\\u0152-\\u0153\\u0160-\\u0161\\u0178\\u017D-\\u017E\\u20AC";
const STANDARD_E_V2_PATTERN = new RegExp(`^[${STANDARD_E_V2_CHARS}]*$`, "u");
// Same charset but line breaks allowed (FsE StringZUBaseSType) — used only for tätigkeitsbeschreibung.
const STANDARD_E_V2_ZU_PATTERN = new RegExp(`^[\\n\\r${STANDARD_E_V2_CHARS}]*$`, "u");

// DIN SPEC 91379 datatype C (2022-08) — XGewerbe's shared free-text charset.
// Transcribed from the XSD's single-codepoint ranges only; the handful of
// precomposed-letter + combining-diacritic *sequences* it also permits (for
// rare Baltic/Vietnamese name spellings) are not modeled here.
const DIN_91379_C_CHARS =
  "\\t\\n\\r\\x20-\\x7E\\xA0-\\xAC\\xAE-\\u017E\\u0187-\\u0188\\u018F\\u0197\\u01A0-\\u01A1\\u01AF-\\u01B0\\u01B7\\u01CD-\\u01DC\\u01DE-\\u01DF\\u01E2-\\u01F0\\u01F4-\\u01F5\\u01F8-\\u01FF\\u0212-\\u0213\\u0218-\\u021B\\u021E-\\u021F\\u0227-\\u0233\\u0259\\u0268\\u0292\\u02B9-\\u02BA\\u02BE-\\u02BF\\u02C8\\u02CC\\u1E02-\\u1E03\\u1E06-\\u1E07\\u1E0A-\\u1E11\\u1E1C-\\u1E2B\\u1E2F-\\u1E37\\u1E3A-\\u1E3B\\u1E40-\\u1E49\\u1E52-\\u1E5B\\u1E5E-\\u1E63\\u1E6A-\\u1E6F\\u1E80-\\u1E87\\u1E8C-\\u1E97\\u1E9E\\u1EA0-\\u1EF9\\u2019\\u2021\\u20AC";
const DIN_91379_C_PATTERN = new RegExp(`^[${DIN_91379_C_CHARS}]*$`, "u");

const AdresseSchema = z.object({
  strasseUndHausnummer: z
    .string()
    .regex(/^\D.*\d/)
    .regex(STANDARD_E_V2_PATTERN)
    .openapi({
      example: "Musterstraße 1",
      description:
        "Street name followed by street number; must start with letters and contain a digit",
    }),
  postleitzahl: z
    .string()
    .regex(/^(?:0[1-9]\d{3}|[1-9]\d{4})$/)
    .openapi({ example: "36037", description: "5-digit German postal code" }),
  ort: z.string().min(1).max(72).regex(/^\D+$/).openapi({ example: "Fulda" }),
});

const PersönlicheDatenSchema = z.object({
  vorname: z.string().min(1).max(72).regex(STANDARD_E_V2_PATTERN).openapi({ example: "Erika" }),
  nachname: z
    .string()
    .min(1)
    .max(72)
    .regex(STANDARD_E_V2_PATTERN)
    .openapi({ example: "Mustermann" }),
  geburtsname: z
    .string()
    .min(1)
    .max(72)
    .regex(STANDARD_E_V2_PATTERN)
    .openapi({ example: "Muster" })
    .optional(),
  geburtsdatum: z.iso.date().openapi({ example: "1988-09-10" }),
  geburtsort: z.string().regex(DIN_91379_C_PATTERN).openapi({ example: "Musterstadt" }).optional(),
  geburtsland: z.string().regex(DIN_91379_C_PATTERN).openapi({ example: "Deutschland" }).optional(),
  staatsangehörigkeitDeutsch: z
    .boolean()
    .openapi({
      deprecated: true,
      example: true,
      description:
        "Whether the person holds German citizenship. Deprecated: redundant with `staatsangehörigkeit` (derivable from it). Must be consistent with `staatsangehörigkeit`: true exactly when `staatsangehörigkeit` is 'deutsch' (code 000).",
    })
    .optional(),
  staatsangehörigkeit: z.enum(STAATSANGEHOERIGKEIT_KEYS).default("deutsch").openapi({
    example: "deutsch",
    description:
      "Citizenship of the person according to the code list of the German Federal Statistical Office. Defaults to 'deutsch' (code 000).",
  }),
  adresse: AdresseSchema,
  telefon: z
    .string()
    .regex(/^\+\d{1,5}\s\d{1,5}\s\d{2,13}(-\d{1,5})?$/)
    .openapi({
      example: "+49 234 121314",
      description:
        "Phone numbers are encoded according to the DIN 5008 standard as follows: +[Country code] (up to 5 digits) [Area code] (up to 5 digits) [Phone number] (up to 13 digits) [-Extension] (optional, up to 5 digits).",
    }),
  email: z.email().openapi({ example: "e.mustermann@example.org" }),
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
  vertrauensniveau: z.enum(VERTRAUENSNIVEAU_KEYS).default("unbestimmt").openapi({
    example: "substantiell",
    description: "Vertrauensniveau des verwendeten Identifizierungsmittels gemäß eIDAS-Verordnung",
  }),
});

const UnternehmensDatenSchema = z
  .object({
    adresseAbweichend: AdresseSchema.openapi({
      example: {
        strasseUndHausnummer: "Musterstraße 2",
        postleitzahl: "36037",
        ort: "Fulda",
      },
    }).optional(),
    tätigkeitsbeschreibung: z
      .string()
      .min(1)
      .max(200)
      .regex(STANDARD_E_V2_ZU_PATTERN)
      .openapi({ example: "Vertrieb von Vertriebsmustern" }),
    tätigkeitsbereich: z
      .enum(["industrie", "handwerk", "handel", "sonstiges"])
      .openapi({ example: "handwerk" }),
    tätigkeitsbeginn: z.iso.date().openapi({ example: "2026-04-17" }),
    // TODO: temporary default — remove it (make gründungsdatum required) once the OSS
    // always sends the field.
    gründungsdatum: z.iso
      .date()
      .default(() => new Date().toISOString().split("T")[0]!)
      .openapi({
        example: "2026-04-17",
        description: "Founding date of the business.",
      }),
    gewerbeart: z.enum(["hauptgewerbe", "nebengewerbe"]).openapi({ example: "hauptgewerbe" }),
    gewinnErmittlung: z.enum(GEWINN_ERMITTLUNG_KEYS).openapi({
      example: "einnahmenüberschussrechnung",
    }),
    kleinunternehmerRegelung: z.boolean().default(false).openapi({
      example: false,
      description: "Wird die Kleinunternehmer-Regelung (§ 19 UStG) in Anspruch genommen?",
    }),
    umsatzGruendungsjahr: z.number().int().min(0).default(1).openapi({
      example: 25000,
      description: "Voraussichtlicher Gesamtumsatz (in Euro) im Jahr der Betriebseröffnung.",
    }),
    umsatzFolgejahr: z.number().int().min(0).default(1).openapi({
      example: 26000,
      description: "Voraussichtlicher Gesamtumsatz (in Euro) im Folgejahr.",
    }),
    umsatzsteuerIdMitbeantragen: z.boolean().default(false).optional().openapi({
      description: "Soll mit dem FsE auch eine UmsatzsteuerId mitbeantragt werden?",
    }),
    gewinnGründungsjahr: z.number().int().min(0).default(1).openapi({
      example: 25000,
      description: "Voraussichtlicher Gewinn (in Euro) im Jahr der Betriebseröffnung.",
    }),
    gewinnFolgejahr: z.number().int().min(0).default(1).openapi({
      example: 26000,
      description: "Voraussichtlicher Gewinn (in Euro) im Folgejahr.",
    }),
    sollIstVersteuerung: z.enum(SOLL_IST_VERSTEUERUNG_KEYS).default("sollVersteuerung").openapi({
      example: "istVersteuerung",
      description:
        "Art der Umsatzbesteuerung gemäß § 16 bzw. § 20 UStG. Standard ist Sollversteuerung (nach vereinbarten Entgelten).",
    }),
    istVersteuerungGrund: z.enum(IST_VERSTEUERUNG_GRUND_KEYS).optional().openapi({
      example: "unterschreitungUmsatzgrenze",
      description:
        "Begründung für die beantragte Istversteuerung. Verpflichtend, wenn `sollIstVersteuerung` auf `istVersteuerung` gesetzt ist; andernfalls weglassen.",
    }),
    zahllastUeberschussAuswahl: z.enum(ZAHLLAST_UEBERSCHUSS_KEYS).default("zahllast").openapi({
      example: "zahllast",
      description:
        "Deprecated. Use 'umsatzsteuerImErstenJahr instead. (Ob voraussichtlich eine Zahllast oder ein Überschuss erwartet wird.)",
      deprecated: true,
    }),
    zahllastUeberschussBetrag: z.number().int().min(0).default(0).openapi({
      example: 0,
      description:
        "Deprecated. Use 'umsatzsteuerImErstenJahr instead. (Voraussichtliche Zahllast oder Überschuss in Euro.)",
      deprecated: true,
    }),
    umsatzsteuerImErstenJahr: z.int().optional().openapi({
      example: 100,
      description:
        "Voraussichtliche Umsatzsteuer im ersten Jahr. (Größer als 0 => Nutzer hat 'Zahllast' => muss was bezahlen; kleiner oder gleich 0 => 'Überschuss' => Rückzahlung vom / Guthaben beim Finanzamt.)",
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

// Not used as long as we only support 'grundAnmeldungSchluessel: "01"' ("Neugründung")
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
