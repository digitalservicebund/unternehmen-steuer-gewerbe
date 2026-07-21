import { HonoAppType } from "../../honoApp";
import { getFitConnectClient } from "../../clients/fitConnectClient/fitConnectClient";
import { getOsciClient } from "../../clients/osciClient/osciClient";
import { getAGS } from "../../helpers/getAgs";
import { getEventsRoute } from "./getEventsRoute";

export function addGetEventsEndpoint(app: HonoAppType): HonoAppType {
  app.openapi(getEventsRoute, async (c) => {
    try {
      const { submissionId, ars, fitConnectDestinationId } = c.req.valid("query");

      // FIT-Connect submissions carry a destinationId; its absence marks OSCI.
      if (fitConnectDestinationId !== undefined) {
        const submissionEvents = await getFitConnectClient().getSubmissionEvents(
          submissionId,
          fitConnectDestinationId,
        );

        if (!submissionEvents) {
          return c.json({ message: "Not Found" }, 404);
        }

        return c.json(submissionEvents, 200);
      }

      const transportReport = await getOsciClient().getTransportReport({
        messageId: submissionId,
        authorityKey: `MELDID:${getAGS(ars)}`,
      });

      const track = transportReport.tracks.find((track) => track.id === submissionId);
      if (!track) {
        return c.json({ message: "Not Found" }, 404);
      }

      const events = track.events.map((event) => ({
        eventType: event.type,
        timestamp: event.timestamp,
      }));

      return c.json({ events }, 200);
    } catch (error) {
      console.error("Event Fetch Error:", error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  });
  return app;
}
