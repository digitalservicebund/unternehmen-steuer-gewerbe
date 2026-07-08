import { z } from "@hono/zod-openapi";
import { type OfficeDetails } from "../../helpers/createOfficeDetails";

export const RegionParamsSchema = z.object({
  plz: z
    .string()
    .regex(/^\d{5}$/, "plz must be a 5-digit number")
    .openapi({
      param: { name: "plz", in: "path" },
      example: "25813",
    }),
});

export const RegionQuerySchema = z.object({
  ort: z
    .string()
    .min(1)
    .optional()
    .openapi({
      param: { name: "ort", in: "query" },
      example: "Husum",
      description: "Optional city/municipality name to narrow down the responsible offices",
    }),
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
  onlyBestMatch: z
    .stringbool()
    .default(true)
    .openapi({
      param: { name: "onlyBestMatch", in: "query" },
      example: "false",
      description:
        "Set to false to return all matches. When true (default), each list contains only the best matching office — the same office the submission would use.",
    }),
});

export const OnlineServiceSchema = z
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
    onlineServices: z.array(OnlineServiceSchema).optional(),
  })
  .openapi("OfficeDetails") satisfies z.ZodType<OfficeDetails>;

export const RegionResponseSchema = z
  .object({
    supported: z.boolean(),
    finanzaemter: z.array(OfficeDetailsSchema),
    gewerbeaemter: z.array(OfficeDetailsSchema),
  })
  .openapi("RegionResponse");
