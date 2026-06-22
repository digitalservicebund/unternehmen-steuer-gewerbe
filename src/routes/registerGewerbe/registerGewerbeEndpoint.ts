import { HonoAppType } from "../../honoApp";
import { getFitConnectClient } from "../../clients/fitConnectClient/fitConnectClient";
import {
  createElsterFsEEUnXml,
  getFinanzamtDetailsById,
  getFinanzamtId,
  sendFsE,
  validateFsE,
} from "@digitalservicebund/unternehmen-steuer-gewerbe-privat";
import { getSecret } from "../../secrets";
import { createGewerbeanmeldungXml } from "../../xmlBuilders/xGewerbeordnung/gewerbeanmeldung";
import {
  ErrorTypeSchema,
  type RegisterGewerbeRequest,
  type RegisterGewerbeResponseItem,
} from "./registerGewerbeInterfaces";
import { registerGewerbeRoute } from "./registerGewerbeRoute";
import { transformToGewerbeanmeldung, transformToEUnFsE } from "./requestDataTransformer";
import { getGewerbeRoutingInfo } from "./getGewerbeRoutingInfo";
import { generatePdfReceipt } from "./registerGewerbePdfGenerator";
import { splitStrasseHausnummer } from "../../helpers/formFieldTransformations";

const GEWERBEANMELDUNG_LEIKA_KEY_URN = "urn:de:fim:leika:leistung:99050012104000";

async function submitGewerbeanmeldung(
  data: RegisterGewerbeRequest,
): Promise<RegisterGewerbeResponseItem> {
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

  const gewerbeanmeldungPdfReceipt = await generatePdfReceipt(gewerbeanmeldungXml);

  const gewerbeamtAdresse = routingInfo.gewerbeamt.adresse;
  const officeDetails = {
    name: routingInfo.gewerbeamt.name,
    strasseUndHausnummer: gewerbeamtAdresse
      ? `${gewerbeamtAdresse.strasse} ${gewerbeamtAdresse.hausnummer}`
      : undefined,
    postleitzahl: gewerbeamtAdresse?.postleitzahl,
    ort: gewerbeamtAdresse?.ort,
    telefon: routingInfo.gewerbeamt.telefon,
  };
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
    return {
      success: true,
      submissionId: response.submissionId,
      pdfReceiptBase64: gewerbeanmeldungPdfReceipt,
      officeDetails,
    };
  } catch (error) {
    console.error("FIT-Connect submission failed", error);
    return {
      success: false,
      errorType: ErrorTypeSchema.enum.upstream_error,
      info: "Upstream service unavailable",
    };
  }
}

async function submitFsE(data: RegisterGewerbeRequest): Promise<RegisterGewerbeResponseItem> {
  try {
    const address = data.unternehmensDaten.adresseAbweichend ?? data.persönlicheDaten.adresse;

    const { strasse, hausnummer, hausnummerBis } = splitStrasseHausnummer(
      address.strasseUndHausnummer,
    );

    const finanzamtIds = getFinanzamtId({
      postleitzahl: address.postleitzahl,
      ort: address.ort,
      strassenName: strasse,
      hausnummerVon: hausnummer,
      hausnummerBis: hausnummerBis,
    });

    if (finanzamtIds.length === 0) {
      return {
        success: false,
        errorType: ErrorTypeSchema.enum.invalid_data,
        info: "No Finanzamt found for address",
      };
    }
    const finanzamtId = finanzamtIds[0]!;

    // ***** WARNING, DANGEROUS *****
    // Missing piece: Only on prod(!) set Finanzamt-ID in data for fse creation
    // ***** WARNING, DANGEROUS *****

    const fse = createElsterFsEEUnXml(transformToEUnFsE(data));

    const validation = validateFsE(fse);
    if (!validation.valid) {
      return {
        success: false,
        errorType: ErrorTypeSchema.enum.validation_error,
        info: validation.errors,
      };
    }

    const finanzamtDetails = getFinanzamtDetailsById(finanzamtId);
    const strasseUndHausnummer = `${finanzamtDetails?.hausanschrift?.strasse} ${finanzamtDetails?.hausanschrift?.hausnummer}`;
    const officeDetails = finanzamtDetails
      ? {
          name: finanzamtDetails.name, //
          strasseUndHausnummer,
          postleitzahl: finanzamtDetails?.hausanschrift?.postleitzahl,
          ort: finanzamtDetails?.hausanschrift?.ort,
          telefon: finanzamtDetails?.telefonnummer,
        }
      : undefined;

    const result = sendFsE(fse, true);
    if (!result.success) {
      return {
        success: false,
        errorType: ErrorTypeSchema.enum.upstream_error,
        info: result.info,
      };
    }
    return {
      success: true,
      submissionId: "implementation missing",
      info: result.info,
      pdfReceiptBase64: result.pdf?.toString("base64"),
      officeDetails,
    };
  } catch (error) {
    console.error("FsE submission failed", error);
    return {
      success: false,
      errorType: ErrorTypeSchema.enum.upstream_error,
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
      const data = c.req.valid("json");

      const [gewerbeanmeldung, fseÜbermittlung] = await Promise.all([
        submitGewerbeanmeldung(data),
        submitFsE(data),
      ]);

      return c.json(
        {
          gewerbeanmeldung,
          fseÜbermittlung,
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
