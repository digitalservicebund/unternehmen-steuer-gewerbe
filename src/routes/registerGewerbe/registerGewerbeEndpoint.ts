import { readFileSync } from "node:fs";
import { join } from "node:path";
import { HonoAppType } from "../../honoApp";
import { getFitConnectClient } from "../../clients/fitConnectClient/fitConnectClient";
import {
  createElsterFsEEUnXml,
  sendFsE,
  validateFsE,
} from "@digitalservicebund/unternehmen-steuer-gewerbe-privat";
import { getSecret } from "../../secrets";
import { createGewerbeanmeldungXml } from "../../xmlBuilders/xGewerbeordnung/gewerbeanmeldung";
import { ErrorTypeSchema, type RegisterGewerbeRequest } from "./registerGewerbeInterfaces";
import { registerGewerbeRoute } from "./registerGewerbeRoute";
import { transformToGewerbeanmeldung, transformToEUnFsE } from "./requestDataTransformer";
import { getGewerbeRoutingInfo } from "./getGewerbeRoutingInfo";

const GEWERBEANMELDUNG_LEIKA_KEY_URN = "urn:de:fim:leika:leistung:99050012104000";

async function submitGewerbeanmeldung(data: RegisterGewerbeRequest) {
  let routingInfo: Awaited<ReturnType<typeof getGewerbeRoutingInfo>>;
  try {
    routingInfo = await getGewerbeRoutingInfo(data);
  } catch (error) {
    console.error("Gewerbe routing info lookup failed", error);
    return {
      success: false,
      errorType: ErrorTypeSchema.enum.upstream_error,
      info: "Upstream service unavailable",
    };
  }

  let gewerbeanmeldungXml: string;
  try {
    gewerbeanmeldungXml = await createGewerbeanmeldungXml(
      transformToGewerbeanmeldung(data, routingInfo),
    );
  } catch (error) {
    console.error("Gewerbeanmeldung XML validation failed", error);
    return {
      success: false,
      errorType: ErrorTypeSchema.enum.validation_error,
      info: "XML validation failed",
    };
  }

  // Before using FIT-Connect -> Check in context if FIT-Connect or OSCI is supported by
  // the Communes as soon as we have Pilot-Communes
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
  let fse: string;
  try {
    fse = createElsterFsEEUnXml(transformToEUnFsE(data));
  } catch (error) {
    console.error("FsE XML creation failed", error);
    return {
      success: false,
      errorType: ErrorTypeSchema.enum.validation_error,
      info: "XML creation failed",
    };
  }

  const validation = validateFsE(fse);
  if (validation.isValid === undefined) {
    return {
      success: false,
      errorType: ErrorTypeSchema.enum.upstream_error,
      info: "Upstream service unavailable",
    };
  }
  if (validation.isValid === false) {
    return {
      success: false,
      errorType: ErrorTypeSchema.enum.validation_error,
      info: validation.info,
    };
  }

  try {
    const result = sendFsE(fse);
    if (!result.success) {
      return {
        success: false,
        errorType: ErrorTypeSchema.enum.upstream_error,
        info: result.info,
      };
    }
    return { success: true, info: result.info };
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

      // to be replaced by the real receipt once we really submit
      const pdfReceiptBase64 = readFileSync(
        join(import.meta.dirname, "fsePdfReceiptDummy.pdf"),
      ).toString("base64");

      return c.json(
        {
          gewerbeanmeldung,
          fseÜbermittlung: {
            success: fseÜbermittlung.success,
            submissionId: "implementation missing",
            errorType: fseÜbermittlung.errorType,
            pdfReceiptBase64,
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
