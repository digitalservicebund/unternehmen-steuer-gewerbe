import { HonoAppType } from "../../honoApp";
import { getFitConnectClient } from "../../clients/fitConnectClient/fitConnectClient";
import { getSecret } from "../../secrets";
import { getEventsRoute } from "./getEventsRoute";

export function addGetEventsEndpoint(app: HonoAppType): HonoAppType {
  app.openapi(getEventsRoute, async (c) => {
    try {
      // submissionId is automatically extracted and validated as a string/uuid
      const { submissionId } = c.req.valid("param");
      // The destination varies from commune to commune.
      // We can hard‑code it here for the first iterations, but in the future we need to
      // use the Fit‑Connect routing API to determine the destination ID.
      const destinationId = getSecret("FIT_CONNECT_DESTINATION_ID");

      const fitConnectClient = getFitConnectClient();

      const submissionEvents = await fitConnectClient.getSubmissionEvents(
        submissionId,
        destinationId,
      );

      if (!submissionEvents) {
        return c.json({ message: "Not Found" }, 404);
      }

      return c.json(submissionEvents, 200);
    } catch (error) {
      console.error("FIT-Connect Event Fetch Error:", error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  });
  return app;
}
