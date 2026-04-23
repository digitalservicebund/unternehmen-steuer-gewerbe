import { z, createRoute } from "@hono/zod-openapi";
import {
  UNFALLVERSICHERUNGSTRAEGER,
  UNFALLVERSICHERUNGSTRAEGER_CODES,
} from "../../xGewerbeordnung/buildingBlocks/bisherigeUnfallversicherung";

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

const BisherigeUnfallversicherungSchema = z
  .object({
    traeger: z.enum(UNFALLVERSICHERUNGSTRAEGER_CODES).openapi({
      example: "08",
      description: `Schlüssel des Trägers der bisherigen gesetzlichen Unfallversicherung. Mögliche Werte: ${unfallversicherungstraegerCodesDescription},`,
    }),
    unternehmensnummer: z.string().optional().openapi({
      example: "123456789",
      description:
        "Unternehmensnummer bei der bisherigen Unfallversicherung (früher Mitgliedsnummer).",
    }),
  })
  .openapi("BisherigeUnfallversicherung");

const RegisterGewerbeRequestSchema = z
  .object({
    persönlicheDaten: PersönlicheDatenSchema,
    unternehmensDaten: UnternehmensDatenSchema,
    bisherigeUnfallversicherung: BisherigeUnfallversicherungSchema.optional().openapi({
      description:
        "Angaben zur bisherigen Unfallversicherung bei Übernahme, Verschmelzung oder Spaltung. Darf bei Neugründung einer Hauptniederlassung, Reisegewerbe oder technischer Anmeldung nicht angegeben werden (siehe SCH-0094).",
    }),
  })
  .openapi("RegisterGewerbeRequest");

export type RegisterGewerbeRequest = z.infer<typeof RegisterGewerbeRequestSchema>;

const RegisterGewerbeResponseSchema = z
  .object({
    success: z.boolean(),
    submissionId: z.string().optional(),
    info: z.string().optional(),
  })
  .openapi("RegisterGewerbeResponse");

export const registerGewerbeRoute = createRoute({
  method: "post",
  path: "/api/v1/register-gewerbe",
  request: {
    body: {
      content: {
        "application/json": {
          schema: RegisterGewerbeRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: RegisterGewerbeResponseSchema,
        },
      },
      description: "Successfully submitted to FIT-Connect",
    },
    500: {
      content: {
        "application/json": {
          schema: RegisterGewerbeResponseSchema,
        },
      },
      description: "Internal Server Error",
    },
  },
  tags: ["Active Development"],
  summary: "Register Gewerbe via FIT-Connect",
});
