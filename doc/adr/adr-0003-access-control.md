# ADR 0003: Access Control

## Date

2026-05-12

## Status

Accepted (one of two authors present)

## Context

[ADR-0001](adr-0001-environments.md) defines the roles of `production` and `development` environments. Access control needs to be handled accordingly.

Here's how we do it.

## Decision

### `production` Access

- The `production` API service is _not_ exposed via Ingress.
- It can only be reached from the OSS app in the OSS namespace.

### `development` Access

- The `development` API service _is_ exposed via Ingress.
- All endpoints are open to the public.

## Consequences

- Access controls closely model the role of `production` and `development` as described in [ADR-0001](adr-0001-environments.md).

- Access control is modeled via infrastructure configuration.
  - This matches our expectation that neither service (OSS and API) is meant to run without the other.

- The endpoints serving health information and/or API documentation on `development` are publicly available.
  - We consider this a plus in terms of open source and transparent product development.

- We can't identify individual users and/or model user groups.
  - By allowing only traffic from OSS in `production`, we offload any such responsibility to OSS.
  - Whatever data reaches the `production` API will be treated as a legitimate request. Sanitizing is a separate concern and we do it in all environments.

## Alternatives Considered

### Running a full Oauth2 service-to-service flow

- This approach would work better for potential new use cases (like running OSS and API independently) but it would come at a considerable cost in terms of engineering effort as well as code and infrastructure complexity.

### Putting all API behind basic auth (or another shared secret)

- This could provide some extra layer of security against an attacker that was able to get into the infrastructure. But it's not stronger than the infrastructure restriction, as our apps share secrets.
