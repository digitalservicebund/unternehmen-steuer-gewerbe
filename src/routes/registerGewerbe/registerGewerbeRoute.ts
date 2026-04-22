import { z, createRoute } from "@hono/zod-openapi";

const AdresseSchema = z.object({
  strasseUndHausnummer: z.string().openapi({ example: "Musterstraße 1" }),
  postleitzahl: z
    .string()
    .length(5, "postleitzahl must be 5 characters")
    .regex(/^\d+$/, "postleitzahl must only contain numbers")
    .openapi({ example: "12345" }),
  ort: z.string().openapi({ example: "Musterstadt" }),
});

const PersönlicheDatenSchema = z.object({
  vorname: z.string().openapi({ example: "Erika" }),
  nachname: z.string().openapi({ example: "Mustermann" }),
  geburtsname: z.string().optional(),
  geburtsdatum: z.iso.date().openapi({ example: "1988-09-10" }),
  geburtsort: z.string().openapi({ example: "Musterstadt" }),
  geburtsland: z.string().openapi({ example: "Deutschland" }),
  staatsangehörigkeitDeutsch: z.literal(true),
  adresse: AdresseSchema,
  telefon: z.string().openapi({ example: "+49 234 121314" }),
  email: z.string().openapi({ example: "e.mustermann@example.org" }),
});

const UnternehmensDatenSchema = z.object({
  adresseAbweichend: AdresseSchema.openapi({
    example: { strasseUndHausnummer: "Musterstraße 2", postleitzahl: "67890", ort: "Musterstadt" },
  }).optional(),
  tätigkeitsbeschreibung: z.string().openapi({ example: "Vertrieb von Vertriebsmustern" }),
  tätigkeitsbereich: z.string().openapi({ example: "Handwerksbetrieb" }),
  tätigkeitsbeginn: z.iso.date().openapi({ example: "2026-04-17" }),
  gewerbeart: z.enum(["hauptgewerbe", "nebengewerbe"]).openapi({ example: "hauptgewerbe" }),
});

const RegisterGewerbeRequestSchema = z
  .object({
    persönlicheDaten: PersönlicheDatenSchema,
    unternehmensDaten: UnternehmensDatenSchema,
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
