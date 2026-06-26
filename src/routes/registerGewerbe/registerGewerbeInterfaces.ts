import { z } from "@hono/zod-openapi";
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

const AdresseSchema = z.object({
  strasseUndHausnummer: z
    .string()
    .regex(/^\D.*\d/)
    .openapi({
      example: "Musterstraße 1",
      description:
        "Street name followed by street number; must start with letters and contain a digit",
    }),
  postleitzahl: z
    .string()
    .regex(/^\d{5}$/)
    .openapi({ example: "36037", description: "5-digit German postal code" }),
  ort: z.string().openapi({ example: "Fulda" }),
});

const PersönlicheDatenSchema = z.object({
  vorname: z.string().openapi({ example: "Erika" }),
  nachname: z.string().openapi({ example: "Mustermann" }),
  geburtsname: z.string().openapi({ example: "Muster" }).optional(),
  geburtsdatum: z.iso.date().openapi({ example: "1988-09-10" }),
  geschlecht: z.enum(["d", "w", "m"]).openapi({ example: "d" }).optional(),
  geburtsort: z.string().openapi({ example: "Musterstadt" }).optional(),
  geburtsland: z.string().openapi({ example: "Deutschland" }).optional(),
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
    .regex(/^\+[0-9]{1,5}\s[0-9]{1,5}\s[0-9]{1,13}(-[0-9]{1,5})?$/)
    .openapi({
      example: "+49 234 121314",
      description:
        "Phone numbers are encoded according to the DIN 5008 standard as follows: +[Country code] (up to 5 digits) [Area code] (up to 5 digits) [Phone number] (up to 13 digits) [-Extension] (optional, up to 5 digits).",
    }),
  email: z.email().openapi({ example: "e.mustermann@example.org" }),
  steuernummer: z
    .string()
    .regex(/^[0-9]{4}0[0-9]{8}$/)
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
    tätigkeitsbeschreibung: z.string().openapi({ example: "Vertrieb von Vertriebsmustern" }),
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
    }),
    zahllastUeberschussBetrag: z.number().int().min(0).default(0).openapi({
      example: 0,
      description:
        "Deprecated. Use 'umsatzsteuerImErstenJahr instead. (Voraussichtliche Zahllast oder Überschuss in Euro.)",
    }),
    umsatzsteuerImErstenJahr: z.int().optional().openapi({
      example: 100,
      description:
        "Voraussichtliche Umsatzsteuer im ersten Jahr. (Größer als 0 => Nutzer hat 'Zahllast' => muss was bezahlen; kleiner als 0 => 'Überschuss' => Rückzahlung vom / Guthaben beim Finanzamt.)",
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
  info: z.string().optional(),
  errorType: ErrorTypeSchema.optional(),
  pdfReceiptBase64: z.base64().optional(),
  officeDetails: z
    .object({
      name: z.string(),
      strasseUndHausnummer: z.string().optional(),
      postleitzahl: z.string().optional(),
      ort: z.string().optional(),
      telefon: z.string().optional(),
    })
    .optional(),
});

export type RegisterGewerbeResponseItem = z.infer<typeof RegisterGewerbeResponseItemSchema>;

export const RegisterGewerbeResponseSchema = z
  .object({
    gewerbeanmeldung: RegisterGewerbeResponseItemSchema,
    fseÜbermittlung: RegisterGewerbeResponseItemSchema,
  })
  .openapi("RegisterGewerbeResponse");
