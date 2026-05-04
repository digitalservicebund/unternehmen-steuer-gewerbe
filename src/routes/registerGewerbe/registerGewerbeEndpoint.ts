import { HonoAppType } from "../../app";
import { getFitConnectClient } from "../../clients/fitConnectClient/fitConnectClient";
import { validateFsE } from "../../private/eric/eric";
import { createElsterFsEEUnXml } from "../../private/xmlBuilders/elsterFsE/elsterFsEEUn";
import { getSecret } from "../../secrets";
import { createGewerbeanmeldungXml } from "../../xmlBuilders/xGewerbeordnung/gewerbeanmeldung";
import { RegisterGewerbeRequest } from "./registerGewerbeInterfaces";
import { registerGewerbeRoute } from "./registerGewerbeRoute";
import { transformToEUnFsE } from "./transformToFsE";
import { transformToGewerbeanmeldung } from "./transformToGewerbeanmeldung";

const ERROR_TYPES = {
  validationError: "validation_error",
  upstreamError: "upstream_error",
} as const;

async function submitGewerbeanmeldung(data: RegisterGewerbeRequest) {
  let gewerbeanmeldungXml: string;
  try {
    gewerbeanmeldungXml = await createGewerbeanmeldungXml(transformToGewerbeanmeldung(data));
  } catch (error) {
    console.error("Gewerbeanmeldung XML validation failed", error);
    return {
      success: false,
      errorType: ERROR_TYPES.validationError,
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
        identifier: "urn:de:fim:leika:leistung:99050012104000",
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
      errorType: ERROR_TYPES.upstreamError,
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
        errorType: ERROR_TYPES.validationError,
        info: result.info ?? "FsE validation failed", // we should not return the complete result.info
      };
    }

    return { success: true, submissionId: "00000000-0000-0000-0000-000000000000" }; // replace this as soon as we really send the data
  } catch (error) {
    console.error("FsE submission failed", error);
    return {
      success: false,
      errorType: ERROR_TYPES.upstreamError,
      info: "Upstream service unavailable",
    };
  }
}

export function addRegisterGewerbeEndpoint(app: HonoAppType): HonoAppType {
  app.openapi(registerGewerbeRoute, async (c) => {
    try {
      // With OpenAPIHono, the body is already validated against your schema
      const data = c.req.valid("json");

      const [gewerbeanmeldung, steuernummer] = await Promise.all([
        submitGewerbeanmeldung(data),
        submitFsE(data),
      ]);

      return c.json({ gewerbeanmeldung, steuernummer }, 200);
    } catch (error) {
      // Unhandled Error
      console.error(error);
      return c.json(
        {
          gewerbeanmeldung: {
            success: false,
            errorType: ERROR_TYPES.upstreamError,
            info: "Internal Server Error",
          },
          steuernummer: {
            success: false,
            errorType: ERROR_TYPES.upstreamError,
            info: "Internal Server Error",
          },
        },
        500,
      );
    }
  });

  return app;
}
