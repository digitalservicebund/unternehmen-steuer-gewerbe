import { z } from "@hono/zod-openapi";
import { type OfficeDetails } from "../../helpers/createOfficeDetails";

export const RegionParamsSchema = z.object({
  plz: z
    .string()
    .regex(/^\d{5}$/, "plz must be a 5-digit number")
    .openapi({
      param: { name: "plz", in: "path" },
      example: "01067",
    }),
});

export const RegionQuerySchema = z.object({
  ort: z
    .string()
    .min(1)
    .optional()
    .openapi({
      param: { name: "ort", in: "query" },
      example: "Dresden",
      description: "Optional city/municipality name to narrow down the responsible offices",
    }),
  strasse: z
    .string()
    .min(1)
    .optional()
    .openapi({
      param: { name: "strasse", in: "query" },
      example: "Münzgasse",
      description: "Optional street name to narrow down the responsible offices",
    }),
  hausnummer: z
    .string()
    .min(1)
    .optional()
    .openapi({
      param: { name: "hausnummer", in: "query" },
      example: "2",
      description: "Optional house number to narrow down the responsible offices",
    }),
  getAllOffices: z
    .stringbool()
    .default(false)
    .openapi({
      param: { name: "getAllOffices", in: "query" },
      example: "true",
      description:
        "When false (default), each list for Gewerbeaemter & Finanzaemter contains only the best-matching office. The same office the submission would use. Set to true to return all Gewerbeaemter & Finanzaemter found for the given address.",
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
