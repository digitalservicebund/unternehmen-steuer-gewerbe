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
// The " -~" span is the full printable ASCII block (U+0020-007E), which already
// covers a-z/A-Z/digits/punctuation; "¿-ÿ" is the tail of Latin-1 Supplement
// (U+00BF-00FF), which covers ä/ö/ü/Ä/Ö/Ü/ß — neither is spelled out letter by letter.
const STANDARD_E_V2_CHARS = " -~¡-£¥§ª-¬®-³µ¹-»¿-ÿŒ-œŠ-šŸŽ-ž€";
const STANDARD_E_V2_PATTERN = new RegExp(`^[${STANDARD_E_V2_CHARS}]*$`, "u");
// Same charset but line breaks allowed (FsE StringZUBaseSType) — used only for tätigkeitsbeschreibung.
const STANDARD_E_V2_ZU_PATTERN = new RegExp(`^[\\n\\r${STANDARD_E_V2_CHARS}]*$`, "u");

// DIN SPEC 91379 datatype C (2022-08 edition, din-norm-91379-datatypes.xsd) —
// XGewerbe's shared free-text charset. Includes both the single-codepoint
// ranges and the base-letter + combining-diacritic *sequences* the XSD's
// xs:pattern permits in addition (e.g. "K" + U+035F + "h" for Vietnamese, or
// "C" + one of several combining marks for Baltic spellings) — precomposed
// letters alone aren't enough to represent those names in NFC form.
const DIN_91379_C_BASE_CHARS =
  "\t-\n\r -~ -¬®-žƇ-ƈƏƗƠ-ơƯ-ưƷǍ-ǜǞ-ǟǢ-ǰǴ-ǵǸ-ǿȒ-ȓȘ-țȞ-ȟȧ-ȳəɨʒʹ-ʺʾ-ʿˈˌḂ-ḃḆ-ḇḊ-ḑḗḜ-ḫḯ-ḷḺ-ḻṀ-ṉṒ-ṛṞ-ṣṪ-ṯẀ-ẇẌ-ẗẞẠ-ỹ’‡€";
const DIN_91379_C_SEQUENCES =
  "A̋|C(?:̀|̄|̆|̈|̕|̣|̦|̨̆)|D̂|F(?:̀|̄)|G̀|H(?:̄|̦|̱)|J(?:́|̌)|K(?:̀|̂|̄|̇|̕|̛|̦|͟H|͟h)|L(?:̂|̥|̥̄|̦)|M(?:̀|̂|̆|̐)|N(?:̂|̄|̆|̦)|P(?:̀|̄|̕|̣)|R(?:̆|̥|̥̄)|S(?:̀|̄|̛̄|̱)|T(?:̀|̄|̈|̕|̛)|U̇|Z(?:̀|̄|̆|̈|̧)|a̋|c(?:̀|̄|̆|̈|̕|̣|̦|̨̆)|d̂|f(?:̀|̄)|g̀|h(?:̄|̦)|j́|k(?:̀|̂|̄|̇|̕|̛|̦|͟h)|l(?:̂|̥|̥̄|̦)|m(?:̀|̂|̆|̐)|n(?:̂|̄|̆|̦)|p(?:̀|̄|̕|̣)|r(?:̆|̥|̥̄)|s(?:̀|̄|̛̄|̱)|t(?:̀|̄|̕|̛)|u̇|z(?:̀|̄|̆|̈|̧)|Ç̆|Û̄|ç̆|û̄|ÿ́|Č(?:̕|̣)|č(?:̕|̣)|ē̍|Ī́|ī́|ō̍|Ž(?:̦|̧)|ž(?:̦|̧)|Ḳ̄|ḳ̄|Ṣ̄|ṣ̄|Ṭ̄|ṭ̄|Ạ̈|ạ̈|Ọ̈|ọ̈|Ụ(?:̄|̈)|ụ(?:̄|̈)";
const DIN_91379_C_PATTERN = new RegExp(
  `^(?:[${DIN_91379_C_BASE_CHARS}]|${DIN_91379_C_SEQUENCES})*$`,
  "u",
);

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
