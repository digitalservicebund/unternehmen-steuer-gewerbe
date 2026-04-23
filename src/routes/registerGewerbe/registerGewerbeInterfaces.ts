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
  staatsangehörigkeitDeutsch: z.literal(true),
  adresse: AdresseSchema,
  telefon: z.string(),
  email: z.string(),
});

const UnternehmensDatenSchema = z.object({
  adresseAbweichend: AdresseSchema.optional(),
  tätigkeitsbeschreibung: z.string(),
  tätigkeitsbereich: z.string(),
  tätigkeitsbeginn: z.iso.date(),
  gewerbeart: z.enum(["hauptgewerbe", "nebengewerbe"]),
});

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
