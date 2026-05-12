# ADR 0003: Access Control

## Date

2026-05-12

## Status

Proposed (should become accepted)

## Context

[ADR-0001](adr-0001-environments.md) defines the roles of `development` and `production` environments.

When deciding on access control, we need to match these roles.

## Decision

`production`

- The `production` API service is _not_ exposed via Ingress.
- It can be reached from services in the same kubernetes namespace.
  - This allows OSS to access the API.

`development`

- The `development` API service _is_ exposed via Ingress.
  - All routes/endpoints are open to the public.

## Details

## Consequences

- Access controls closely model the role of `production` and `development` as described in [ADR-0001](adr-0001-environments.md).

- Access control is modeled via infrastructure configuration.
  - This matches our expectation that neither service (OSS and API) is meant to run without the other.

- The not-API routes serving health information and/or API documentation) on `development` are publicly available.
  - We consider this a plus in terms of open source and transparent development practices.

- We can't identify individual users and/or model varying user groups.
  - By allowing only traffic from OSS (through sharing a namespace) in `production`, we offload any such responsibility to OSS.
  - Whatever data reaches the `production` API will be treated as a legitimate request.
    - We sanitize user input, regardless.

## Alternatives Considered

### Running a full Oauth2 service-to-service flow

- This approach would work better for potential new use cases (like, running OSS and API independently). But would come at a considerable cost in terms of engineering effort as well as code and infrastructure complexity.

### Putting all API behind basic auth (or another shared secret)

- This was thougth as some extra layer of security against an attacker that was able to get into the infrastructure. But it's not stronger than the "same namespace" restriction, as namespaces share their secrets.

## Further Thoughts
