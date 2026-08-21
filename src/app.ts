import { addHealthCheckEndpoint } from "./routes/rootHealthCheck/rootHealthCheck";
import { addRegionEndpoint } from "./routes/region/regionEndpoint";
import { addKommunenEndpoint } from "./routes/region/kommunenEndpoint";
import { addRegisterGewerbeEndpoint } from "./routes/registerGewerbe/registerGewerbeEndpoint";
import { addEventsEndpoint } from "./routes/events/eventsEndpoint";
import { addOpenApiEndpoints } from "./routes/openApiDocs/openApiEndpoint";
import { addRequestLogging } from "./routes/logging/requestLogging";
import app from "./honoApp";

// add simple logging in JSON format
addRequestLogging(app);

// add business routes/endpoints
addRegionEndpoint(app);
addKommunenEndpoint(app);
addRegisterGewerbeEndpoint(app);
addHealthCheckEndpoint(app);
addEventsEndpoint(app);

// add documentation endpoints
addOpenApiEndpoints(app);

export default app;
