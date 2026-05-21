import { z } from "@hono/zod-openapi";
import {
  UNFALLVERSICHERUNGSTRAEGER,
  UNFALLVERSICHERUNGSTRAEGER_CODES,
} from "../../xmlBuilders/xGewerbeordnung/buildingBlocks/bisherigeUnfallversicherung";
import {
  RELIGIONSSCHLUESSEL_KEYS,
  GEWINN_ERMITTLUNG_KEYS,
  SOLL_IST_VERSTEUERUNG_KEYS,
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
    .openapi({ example: "12345", description: "5-digit German postal code" }),
  ort: z.string().openapi({ example: "Musterstadt" }),
});

const PersönlicheDatenSchema = z.object({
  vorname: z.string().openapi({ example: "Erika" }),
  nachname: z.string().openapi({ example: "Mustermann" }),
  geburtsname: z.string().openapi({ example: "Muster" }).optional(),
  geburtsdatum: z.iso.date().openapi({ example: "1988-09-10" }),
  geschlecht: z.enum(["d", "w", "m"]).openapi({ example: "d" }).optional(),
  geburtsort: z.string().openapi({ example: "Musterstadt" }).optional(),
  geburtsland: z.string().openapi({ example: "Deutschland" }).optional(),
  staatsangehörigkeitDeutsch: z.literal(true),
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
});

const UnternehmensDatenSchema = z.object({
  adresseAbweichend: AdresseSchema.openapi({
    example: {
      strasseUndHausnummer: "Musterstraße 2",
      postleitzahl: "67890",
      ort: "Musterstadt",
    },
  }).optional(),
  tätigkeitsbeschreibung: z.string().openapi({ example: "Vertrieb von Vertriebsmustern" }),
  tätigkeitsbereich: z
    .enum(["industrie", "handwerk", "handel", "sonstiges"])
    .openapi({ example: "handwerk" }),
  tätigkeitsbeginn: z.iso.date().openapi({ example: "2026-04-17" }),
  gewerbeart: z.enum(["hauptgewerbe", "nebengewerbe"]).openapi({ example: "hauptgewerbe" }),
  gewinnErmittlung: z.enum(GEWINN_ERMITTLUNG_KEYS).openapi({
    example: "einnahmenüberschussrechnung",
  }),
  kleinunternehmerRegelung: z.boolean().default(false).openapi({
    example: false,
    description:
      "Ob die Kleinunternehmer-Regelung (§ 19 UStG) in Anspruch genommen wird. Wenn nicht gesetzt, wird false angenommen (kein Kleinunternehmer).",
  }),
  umsatzGruendungsjahr: z.number().int().min(0).default(1).openapi({
    example: 25000,
    description: "Voraussichtlicher Gesamtumsatz (in Euro) im Jahr der Betriebseröffnung.",
  }),
  umsatzFolgejahr: z.number().int().min(0).default(1).openapi({
    example: 26000,
    description: "Voraussichtlicher Gesamtumsatz (in Euro) im Folgejahr.",
  }),
  sollIstVersteuerung: z.enum(SOLL_IST_VERSTEUERUNG_KEYS).default("sollVersteuerung").openapi({
    example: "sollVersteuerung",
    description:
      "Art der Umsatzbesteuerung gemäß § 16 bzw. § 20 UStG. Standard ist Sollversteuerung (nach vereinbarten Entgelten).",
  }),
  zahllastUeberschussAuswahl: z.enum(ZAHLLAST_UEBERSCHUSS_KEYS).default("zahllast").openapi({
    example: "zahllast",
    description: "Ob voraussichtlich eine Zahllast oder ein Überschuss erwartet wird.",
  }),
  zahllastUeberschussBetrag: z.number().int().min(0).default(0).openapi({
    example: 0,
    description: "Voraussichtliche Zahllast oder Überschuss in Euro.",
  }),
});

const unfallversicherungstraegerCodesDescription = Object.entries(UNFALLVERSICHERUNGSTRAEGER)
  .map(([code, name]) => `- \`${code}\`: ${name}`)
  .join("\n");

// Not used as long as we only support 'grundAnmeldungSchluessel: "01"' ("Neugründung")
const _BisherigeUnfallversicherungSchema = z
  .object({
    traeger: z.enum(UNFALLVERSICHERUNGSTRAEGER_CODES).openapi({
      example: "08",
      description: `Schlüssel des Trägers der bisherigen gesetzlichen Unfallversicherung. Mögliche Werte: ${unfallversicherungstraegerCodesDescription},`,
    }),
    unternehmensnummer: z.string().length(15).optional().openapi({
      example: "123456789012345",
      description:
        "Company number from the previous 'Unfallversicherung' (formerly membership number). Must be exactly 15 characters long.",
    }),
  })
  .openapi("BisherigeUnfallversicherung");

export const ErrorTypeSchema = z.enum(["validation_error", "upstream_error"]);

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
});

export const RegisterGewerbeResponseSchema = z
  .object({
    gewerbeanmeldung: RegisterGewerbeResponseItemSchema,
    steuernummer: RegisterGewerbeResponseItemSchema,
    fseÜbermittlung: RegisterGewerbeResponseItemSchema,
  })
  .openapi("RegisterGewerbeResponse");
