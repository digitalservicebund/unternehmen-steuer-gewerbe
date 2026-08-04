import { HonoAppType } from "../../honoApp";
import { getFitConnectClient } from "../../clients/fitConnectClient/fitConnectClient";
import { getOsciClient } from "../../clients/osciClient/osciClient";
import { getAGS } from "../../helpers/getAgs";
import { eventsRoute } from "./eventsRoute";
import {
  toSubmissionEventFromFitConnectPayload,
  toSubmissionEventFromOsciEvent,
} from "./submissionEventStatus";

export function addEventsEndpoint(app: HonoAppType): HonoAppType {
  app.openapi(eventsRoute, async (c) => {
    try {
      const { submissionId, ars, fitConnectDestinationId } = c.req.valid("query");

      // FIT-Connect submissions carry a destinationId; its absence marks OSCI.
      if (fitConnectDestinationId !== undefined) {
        const submissionEvents = await getFitConnectClient().getSubmissionEvents(
          submissionId,
          fitConnectDestinationId,
        );

        if (submissionEvents === undefined) {
          return c.json({ message: "Not Found" }, 404);
        }

        const events = submissionEvents.eventLog
          .map(toSubmissionEventFromFitConnectPayload)
          .filter((event) => event !== undefined);

        return c.json({ events }, 200);
      }

      const transportReport = await getOsciClient().getTransportReport({
        messageId: submissionId,
        authorityKey: `MELDID:${getAGS(ars)}`,
      });

      if (transportReport === undefined) {
        return c.json({ message: "Not Found" }, 404);
      }

      const track = transportReport.tracks.find((track) => track.id === submissionId);
      if (track === undefined) {
        return c.json({ message: "Not Found" }, 404);
      }

      const events = track.events
        .map(toSubmissionEventFromOsciEvent)
        .filter((event) => event !== undefined);

      return c.json({ events }, 200);
    } catch (error) {
      console.error("Event Fetch Error:", error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  });
  return app;
}
