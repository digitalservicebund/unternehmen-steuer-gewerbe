import { HonoAppType } from "../../honoApp";
import { getFitConnectClient } from "../../clients/fitConnectClient/fitConnectClient";
import {
  createElsterFsEEUnXml,
  getFinanzamtDetailsById,
  getFinanzamtId,
  sendFsE,
  validateFsE,
} from "@digitalservicebund/unternehmen-steuer-gewerbe-privat";
import { getEnvironmentVariable } from "../../secretsAndEnvironmentVariables";
import pLimit from "p-limit";
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
import {
  createOfficeDetailsFromFinanzamt,
  createOfficeDetailsFromGewerbeamt,
} from "../../helpers/createOfficeDetails";
import { getFirstAssumingItsTheBestMatch } from "../../helpers/getFirstAssumingItsTheBestMatch";

const GEWERBEANMELDUNG_LEIKA_KEY_URN = "urn:de:fim:leika:leistung:99050012104000";

// Each submission spawns an xmllint-wasm worker thread (own heap) and makes blocking
// ERiC native calls, so unbounded request concurrency multiplies memory/CPU pressure.
// Cap how many submissions are processed at once; excess requests queue.
const DEFAULT_MAX_CONCURRENCY = 2;
const maxConcurrency =
  Number(getEnvironmentVariable("REGISTER_GEWERBE_MAX_CONCURRENCY")) || DEFAULT_MAX_CONCURRENCY;
const concurrentSubmissionPairsLimit = pLimit(maxConcurrency);

async function submitGewerbeanmeldung(
  data: RegisterGewerbeRequest,
): Promise<RegisterGewerbeResponseItem> {
  const routingInfo = await getGewerbeRoutingInfo(data);
  if (!routingInfo) {
    return {
      success: false,
      errorType: ErrorTypeSchema.enum.invalid_data,
      info: "No Gewerbeamt found for address",
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

  const gewerbeamtDetails = createOfficeDetailsFromGewerbeamt(routingInfo.gewerbeamt);
  // Before using FIT-Connect -> Check in context if FIT-Connect or OSCI is supported by
  // the Communes as soon as we have Pilot-Communes
  try {
    // The destination varies from commune to commune.
    // We can hard‑code it here for the first iterations, but in the future we need to
    // use the Fit‑Connect routing API to determine the destination ID.
    const destinationId = getEnvironmentVariable("FIT_CONNECT_DESTINATION_ID");
    const response = await getFitConnectClient().submitData({
      destinationId,
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
      ars: routingInfo.ars,
      // Set only on the FIT-Connect path; once the OSCI submit is wired up its branch
      // returns just `ars`, which the events endpoint reads as an OSCI submission.
      fitConnectDestinationId: destinationId,
      pdfReceiptBase64: gewerbeanmeldungPdfReceipt,
      officeDetails: gewerbeamtDetails,
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

// Sending fails because of semantic errors
export const EricErrorFachlicheAblehnung = 610001002;

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

    const finanzamtId = getFirstAssumingItsTheBestMatch(finanzamtIds);
    if (finanzamtId === undefined) {
      return {
        success: false,
        errorType: ErrorTypeSchema.enum.invalid_data,
        info: "No Finanzamt found for address",
      };
    }

    // Note: finanzamtId is disregarded if ERIC_ENABLE_CUSTOM_FINANZAMT_IDS not "true"
    const fse = createElsterFsEEUnXml(transformToEUnFsE(data, finanzamtId));

    const validation = validateFsE(fse);
    if (!validation.valid) {
      return {
        success: false,
        errorType: ErrorTypeSchema.enum.validation_error,
        info: validation.errors,
      };
    }

    const finanzamtDetails = getFinanzamtDetailsById(finanzamtId);
    const officeDetails =
      finanzamtDetails === undefined
        ? undefined
        : createOfficeDetailsFromFinanzamt(finanzamtDetails);

    const result = sendFsE(fse, true);
    if (!result.success) {
      const type =
        result.returnCode === EricErrorFachlicheAblehnung
          ? ErrorTypeSchema.enum.validation_error
          : ErrorTypeSchema.enum.upstream_error;
      return {
        success: false,
        errorType: type,
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

function determineHttpStatus(...parts: (RegisterGewerbeResponseItem | undefined)[]) {
  // Skipped parts (undefined) don't count towards the status.
  const results = parts.filter((result) => result !== undefined);

  const allSucceeded = results.every((result) => result.success);
  const someSucceeded = results.some((result) => result.success);
  const allValidationErrors = results.every(
    (result) => result.errorType === ErrorTypeSchema.enum.validation_error,
  );

  if (allSucceeded) {
    return 200;
  }
  if (someSucceeded) {
    return 207; // only reachable when both parts were submitted
  }
  if (allValidationErrors) {
    return 400;
  }
  return 500;
}

export function addRegisterGewerbeEndpoint(app: HonoAppType): HonoAppType {
  app.openapi(registerGewerbeRoute, async (c) => {
    try {
      const { only } = c.req.valid("query");
      const data = c.req.valid("json");

      // Sequential, not concurrent: each of these can hold a worker-thread heap
      // (gewerbeanmeldung) or block the event loop (fsE); running them one at a time
      // keeps the peak memory of a single request from stacking both at once.
      const [gewerbeanmeldung, fseÜbermittlung] = await concurrentSubmissionPairsLimit(async () => {
        const gewerbeanmeldung =
          only === "fseÜbermittlung" ? undefined : await submitGewerbeanmeldung(data);
        const fseÜbermittlung = only === "gewerbeanmeldung" ? undefined : await submitFsE(data);
        return [gewerbeanmeldung, fseÜbermittlung] as const;
      });

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
