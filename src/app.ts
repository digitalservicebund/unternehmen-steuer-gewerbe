import { addHealthCheckEndpoint } from "./routes/rootHealthCheck/rootHealthCheck";
import { addRegionEndpoint } from "./routes/region/regionEndpoint";
import { addRegisterGewerbeEndpoint } from "./routes/registerGewerbe/registerGewerbeEndpoint";
import { addGetEventsEndpoint } from "./routes/getEvents/getEventsEndpoint";
import { addOpenApiEndpoints } from "./routes/openApiDocs/openApiEndpoint";
import { addRequestLogging } from "./routes/logging/requestLogging";
import app from "./honoApp";

// add simple logging in JSON format
addRequestLogging(app);

// add business routes/endpoints
addRegionEndpoint(app);
addRegisterGewerbeEndpoint(app);
addHealthCheckEndpoint(app);
addGetEventsEndpoint(app);

// add documentation endpoints
addOpenApiEndpoints(app);

export default app;
