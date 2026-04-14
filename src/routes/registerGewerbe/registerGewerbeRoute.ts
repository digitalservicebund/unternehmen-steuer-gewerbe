import { z, createRoute } from "@hono/zod-openapi";

const registerGewerbeRequestSchema = z
  .object({
    companyName: z.string().openapi({ example: "Mein Projektname Hier GmbH" }),
    ownerName: z.string().openapi({ example: "Riley Smith" }),
    industry: z.string().openapi({ example: "Software Development" }),
    // Add other fields required by the FIT-Connect schema
  })
  .openapi("RegisterGewerbeRequest");

const registerGewerbeResponseSchema = z
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
          schema: registerGewerbeRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: registerGewerbeResponseSchema,
        },
      },
      description: "Successfully submitted to FIT-Connect",
    },
    500: {
      content: {
        "application/json": {
          schema: registerGewerbeResponseSchema,
        },
      },
      description: "Internal Server Error",
    },
  },
  tags: ["Active Development"],
  summary: "Feature under active development",
});
