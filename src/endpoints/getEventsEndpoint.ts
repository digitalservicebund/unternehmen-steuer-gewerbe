import { HonoAppType } from "../app";
import { getFitConnectClient } from "../clients/fitconnectClient";
import { getEventsRoute } from "./getEventsRoute";

export function addGetEventsEndpoint(app: HonoAppType): HonoAppType {
  app.openapi(getEventsRoute, async (c) => {
    try {
      // submissionId is automatically extracted and validated as a string/uuid
      const { submissionId } = c.req.valid("param");

      const fitConnectClient = getFitConnectClient();
      const submissionEvents = await fitConnectClient.getSubmissionEvents(submissionId);

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
