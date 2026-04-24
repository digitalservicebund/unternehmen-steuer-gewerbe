import { z } from "@hono/zod-openapi";
import {
  UNFALLVERSICHERUNGSTRAEGER,
  UNFALLVERSICHERUNGSTRAEGER_CODES,
} from "../../xmlBuilders/xGewerbeordnung/buildingBlocks/bisherigeUnfallversicherung";

const AdresseSchema = z.object({
  strasseUndHausnummer: z
    .string()
    .regex(/^(?=.*\d).+$/)
    .openapi({
      example: "Musterstraße 1",
      description: "Must contain at least one character and one number",
    }),
  postleitzahl: z
    .string()
    .length(5)
    .regex(/^\d+$/)
    .openapi({ example: "12345", description: "postleitzahl must only contain a 5-digit-number" }),
  ort: z.string().openapi({ example: "Musterstadt" }),
});

const PersönlicheDatenSchema = z.object({
  vorname: z.string().openapi({ example: "Erika" }),
  nachname: z.string().openapi({ example: "Mustermann" }),
  geburtsname: z.string().openapi({ example: "Muster" }).optional(),
  geburtsdatum: z.iso.date().openapi({ example: "1988-09-10" }),
  geschlecht: z.enum(["d", "w", "m"]).openapi({ example: "d" }).optional(),
  geburtsort: z.string().openapi({ example: "Musterstadt" }),
  geburtsland: z.string().openapi({ example: "Deutschland" }),
  staatsangehörigkeitDeutsch: z.literal(true),
  adresse: AdresseSchema,
  telefon: z
    .string()
    .regex(/^\+\d{1,5}\s\d{1,5}\s\d{1,13}(-\d{1,5})?$/)
    .openapi({
      example: "+49 234 121314",
      description:
        "Telefonnummern nach DIN 5008 kodiert werden: +[Ländervorwahl] (bis zu 5 Zeichen) [Lokale Vorwahl] (bis zu 5 Zeichen) [Rufnummer] (bis zu 13 Zeichen) [-Durchwahl] (optional, bis zu 5 Zeichen)",
    }),
  email: z.string().openapi({ example: "e.mustermann@example.org" }),
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
  tätigkeitsbereich: z.string().openapi({ example: "Handwerksbetrieb" }),
  tätigkeitsbeginn: z.iso.date().openapi({ example: "2026-04-17" }),
  gewerbeart: z.enum(["hauptgewerbe", "nebengewerbe"]).openapi({ example: "hauptgewerbe" }),
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
        "Unternehmensnummer bei der bisherigen Unfallversicherung (früher Mitgliedsnummer). Muss genau 15 Zeichen lang sein.",
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
