import { z } from "@hono/zod-openapi";
import { HonoAppType } from "../../honoApp";
import { getFitConnectClient } from "../../clients/fitConnectClient/fitConnectClient";
import { getOsciClient } from "../../clients/osciClient/osciClient";
import { getEnvironmentVariable } from "../../secretsAndEnvironmentVariables";
import { getEventsRoute } from "./getEventsRoute";

export function addGetEventsEndpoint(app: HonoAppType): HonoAppType {
  app.openapi(getEventsRoute, async (c) => {
    try {
      const { submissionId } = c.req.valid("param");

      // TODO: this is a placeholder switch.
      // For now: FIT-Connect submissionIds are UUIDs, OSCI messageIds are not
      if (z.uuid().safeParse(submissionId).success) {
        // The destination varies from commune to commune.
        // We can hard‑code it here for the first iterations, but in the future we need to
        // use the Fit‑Connect routing API to determine the destination ID.
        const destinationId = getEnvironmentVariable("FIT_CONNECT_DESTINATION_ID");

        const fitConnectClient = getFitConnectClient();
        const submissionEvents = await fitConnectClient.getSubmissionEvents(
          submissionId,
          destinationId,
        );

        if (!submissionEvents) {
          return c.json({ message: "Not Found" }, 404);
        }

        return c.json(submissionEvents, 200);
      }

      const osciClient = getOsciClient();
      const transportReport = await osciClient.getTransportReport({
        messageId: submissionId,
        // TODO: create the authorityKey from the Gewerbemeldungs AGS
        // (analogous to `MELDID:${gemeindeschluessel}` in transformToGewerbeanmeldung.ts)
        authorityKey: "MELDID:09000099",
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
