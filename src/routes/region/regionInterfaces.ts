import { z } from "@hono/zod-openapi";

export const SupportedRegionParamsSchema = z.object({
  plz: z
    .string()
    .regex(/^\d{5}$/, "plz must be a 5-digit number")
    .openapi({
      param: { name: "plz", in: "path" },
      example: "25813",
      type: "number",
    }),
});

export const RegionQuerySchema = z.object({
  strasse: z
    .string()
    .min(1)
    .optional()
    .openapi({
      param: { name: "strasse", in: "query" },
      example: "Marktstraße",
      description: "Optional street name to narrow down the responsible offices",
    }),
  hausnummer: z
    .string()
    .min(1)
    .optional()
    .openapi({
      param: { name: "hausnummer", in: "query" },
      example: "1",
      description: "Optional house number to narrow down the responsible offices",
    }),
});

export const onlineServicesSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    uri: z.string(),
  })
  .openapi("OnlineServiceLink");

export const OfficeDetailsSchema = z
  .object({
    name: z.string(),
    strasseUndHausnummer: z.string().optional(),
    postleitzahl: z.string().optional(),
    ort: z.string().optional(),
    telefon: z.string().optional(),
    email: z.string().optional(),
    onlineServices: z.array(onlineServicesSchema).optional(),
  })
  .openapi("OfficeDetails");

export type OfficeDetails = z.infer<typeof OfficeDetailsSchema>;

export const SupportedRegionResponseSchema = z
  .object({
    supported: z.boolean(),
    finanzaemter: z.array(OfficeDetailsSchema),
    gewerbeaemter: z.array(OfficeDetailsSchema),
  })
  .openapi("SupportedRegionResponse");
