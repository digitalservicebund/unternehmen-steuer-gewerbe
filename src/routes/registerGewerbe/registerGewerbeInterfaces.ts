import { z } from "@hono/zod-openapi";
import {
  UNFALLVERSICHERUNGSTRAEGER,
  UNFALLVERSICHERUNGSTRAEGER_CODES,
} from "../../xmlBuilders/xGewerbeordnung/buildingBlocks/bisherigeUnfallversicherung";

const AdresseSchema = z.object({
  strasseUndHausnummer: z
    .string()
    .regex(/^\D.*\d/)
    .openapi({
      example: "Musterstraße 1",
      description: "Street name followed by street number; must start with letters and contain a digit",
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
  istReisegewerbe: z.boolean().openapi({
    example: false,
    description: "Whether the business is an 'Reisegewerbe' with no fixed business location",
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

export const RegisterGewerbeRequestSchema = z
  .object({
    persönlicheDaten: PersönlicheDatenSchema,
    unternehmensDaten: UnternehmensDatenSchema,
  })
  .openapi("RegisterGewerbeRequest");

export type RegisterGewerbeRequest = z.infer<typeof RegisterGewerbeRequestSchema>;

export const RegisterGewerbeResponseSchema = z
  .object({
    success: z.boolean(),
    submissionId: z.string().optional(),
    info: z.string().optional(),
  })
  .openapi("RegisterGewerbeResponse");
