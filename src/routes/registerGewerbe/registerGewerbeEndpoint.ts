import { HonoAppType } from "../../honoApp";
import { getFitConnectClient } from "../../clients/fitConnectClient/fitConnectClient";
import { validateFsE, createElsterFsEEUnXml } from "unternehmen-steuer-gewerbe-privat";
import { getSecret } from "../../secrets";
import { createGewerbeanmeldungXml } from "../../xmlBuilders/xGewerbeordnung/gewerbeanmeldung";
import { ErrorTypeSchema, type RegisterGewerbeRequest } from "./registerGewerbeInterfaces";
import { registerGewerbeRoute } from "./registerGewerbeRoute";
import { transformToGewerbeanmeldung, transformToEUnFsE } from "./requestDataTransformer";
import { lookupRequestContext } from "./lookupRequestContext";

const GEWERBEANMELDUNG_LEIKA_KEY_URN = "urn:de:fim:leika:leistung:99050012104000";

async function submitGewerbeanmeldung(data: RegisterGewerbeRequest) {
  let context: Awaited<ReturnType<typeof lookupRequestContext>>;
  try {
    context = await lookupRequestContext(data);
  } catch (error) {
    console.error("Context lookup failed", error);
    return {
      success: false,
      errorType: ErrorTypeSchema.enum.upstream_error,
      info: "Upstream service unavailable",
    };
  }

  let gewerbeanmeldungXml: string;
  try {
    gewerbeanmeldungXml = await createGewerbeanmeldungXml(transformToGewerbeanmeldung(data, context));
  } catch (error) {
    console.error("Gewerbeanmeldung XML validation failed", error);
    return {
      success: false,
      errorType: ErrorTypeSchema.enum.validation_error,
      info: "XML validation failed",
    };
  }

  try {
    const response = await getFitConnectClient().submitData({
      // The destination varies from commune to commune.
      // We can hard‑code it here for the first iterations, but in the future we need to
      // use the Fit‑Connect routing API to determine the destination ID.
      destinationId: getSecret("FIT_CONNECT_DESTINATION_ID"),
      publicService: {
        identifier: GEWERBEANMELDUNG_LEIKA_KEY_URN,
        name: "Gewerbe Anmeldung",
      },
      dataSchema: {
        schemaUri: "urn:xoev-de:kosit:standard:xgewerbeordnung",
        mimeType: "application/xml",
      },
      data: gewerbeanmeldungXml,
    });
    return { success: true, submissionId: response.submissionId };
  } catch (error) {
    console.error("FIT-Connect submission failed", error);
    return {
      success: false,
      errorType: ErrorTypeSchema.enum.upstream_error,
      info: "Upstream service unavailable",
    };
  }
}

async function submitFsE(data: RegisterGewerbeRequest) {
  try {
    const result = validateFsE(createElsterFsEEUnXml(transformToEUnFsE(data)));

    if (result.isValid === undefined) {
      throw new Error("ERiC Service unavailable");
    }

    if (result.isValid === false) {
      return {
        success: false,
        errorType: ErrorTypeSchema.enum.validation_error,
        info: result.info ?? "FsE validation failed",
      };
    }

    return { success: true, submissionId: "00000000-0000-0000-0000-000000000000" }; // replace this as soon as we really send the data
  } catch (error) {
    console.error("FsE submission failed", error);
    return {
      success: false,
      errorType: ErrorTypeSchema.enum.upstream_error,
      info: "Upstream service unavailable",
    };
  }
}

function determineHttpStatus(
  gewerbeanmeldung: { success: boolean; errorType?: string },
  fseÜbermittlung: { success: boolean; errorType?: string },
) {
  if (gewerbeanmeldung.success && fseÜbermittlung.success) {
    return 200;
  }
  if (gewerbeanmeldung.success || fseÜbermittlung.success) {
    return 207;
  }
  if (
    gewerbeanmeldung.errorType === ErrorTypeSchema.enum.validation_error &&
    fseÜbermittlung.errorType === ErrorTypeSchema.enum.validation_error
  ) {
    return 400;
  }
  return 500;
}

export function addRegisterGewerbeEndpoint(app: HonoAppType): HonoAppType {
  app.openapi(registerGewerbeRoute, async (c) => {
    try {
      // With OpenAPIHono, the body is already validated against your schema
      const data = c.req.valid("json");

      const [gewerbeanmeldung, fseÜbermittlung] = await Promise.all([
        submitGewerbeanmeldung(data),
        submitFsE(data),
      ]);

      return c.json(
        {
          gewerbeanmeldung,
          fseÜbermittlung: {
            success: fseÜbermittlung.success,
            submissionId: fseÜbermittlung.submissionId,
            errorType: fseÜbermittlung.errorType,
          },
        },
        determineHttpStatus(gewerbeanmeldung, fseÜbermittlung),
      );
    } catch (error) {
      // Unhandled Error
      console.error(error);
      return c.json(
        {
          gewerbeanmeldung: {
            success: false,
            errorType: ErrorTypeSchema.enum.upstream_error,
            info: "Internal Server Error",
          },
          fseÜbermittlung: {
            success: false,
            errorType: ErrorTypeSchema.enum.upstream_error,
            info: "Internal Server Error",
          },
        },
        500,
      );
    }
  });

  return app;
}
