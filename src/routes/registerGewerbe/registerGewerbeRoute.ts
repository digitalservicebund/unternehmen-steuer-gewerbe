import { z, createRoute } from "@hono/zod-openapi";

const AdresseSchema = z.object({
  strasseUndHausnummer: z.string(),
  postleitzahl: z
    .string()
    .length(5, "postleitzahl must be 5 characters")
    .regex(/^\d+$/, "postleitzahl must only contain numbers"),
  ort: z.string(),
});

const PersönlicheDatenSchema = z.object({
  vorname: z.string(),
  nachname: z.string(),
  geburtsname: z.string().optional(),
  geburtsdatum: z.iso.date(),
  geburtsort: z.string(),
  geburtsland: z.string(),
  staatsangehoerigkeitDeutsch: z.boolean(),
  adresse: AdresseSchema,
  telefon: z.string(),
  email: z.string(),
});

const UnternehmensDatenSchema = z.object({
  adresseAbweichend: AdresseSchema.optional(),
  tätigkeitsbeschreibung: z.string(),
  artDesUnternehmens: z.string(),
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
  summary: "Feature under active development",
});
