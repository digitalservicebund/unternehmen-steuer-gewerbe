# ADR 0001: Environments

## Date

2026-05-13

## Status

Accepted (one of two authors present)

## Context

We're running our service in two environments: `production` (`prod`) and `development` (`dev`).

Here's what they are used for.

## Decision

### `production` Environment

- The `production` environment API is _consequential_ in the sense that requests
  - can trigger messages to real Gewerbeämter or Finanzämter and
  - can register businesses.

- Access to the `production` environment is _locked down_ and only available to the Unternehmen-One-Stop-Shop (OSS) app.

- `production` is expected to be up "24/7" (SLA tbd.)

### `development` Environment

- The `development` API is _sandboxed_ in the sense that requests
  - do not trigger messages to real Gewerbeämter or Finanzämter
  - do not register any business.

- Access to the `development` API is _public_ and can safely be used for any purpose, like:
  - test-running new code,
  - debugging a problem,
  - testing a pipeline change,
  - displaying API documentation or
  - offering a point-and-click UI for interacting with the API.

- `development` makes no promise about availability.

## Consequences

### Simplification

The clear distinction between "sandboxed" and "consequential" simplifies many decisions that developers or other team members have to make. Instead of codifying each case separately, we can refer to the distinction between `production` and `development`.

For example:

- Will there be a Swagger UI for `production`?
  - No, because nothing but the OSS app may access the API.
- What certificates need to be set up?
  - Test certificates in `development` so we can't accidentally cause relevant consequences wrt. tax or business registration offices.
  - Real certificates in `production` as we need to authenticate ourselves when actually registering businesses.
- Against which environment should we run local code?
  - Against `development` as it can safely be used for any (development) purpose.
- Can the Swagger UI for `development` be publicly accessible?
  - Yes, because it does not lead to any relevant consequence wrt. tax or business registration offices.
  - We may consider rate limiting.

### Continuous Testing (CI) and Continuous Deployment (CD) Setup

Our CI/CD pipeline has three sequential stages, each of which depends on the successful execution of the previous one:

1. Ensuring code and engineering quality

2. Deploying to `development`

3. Deploying to `production`

### Limited Number of Use Cases

In terms of use cases, we do not reliably support anything but what the OSS is built for.

As a consequence, e.g. _product demos_ or _user tests_ are not supported by using some other particular set of security or convenience measures. They either

- take place in `production` where users face all (legal, procedural etc.) consequences of actually registering businesses; or they
- take place in `development` with no expectation at all that tax and business registration offices should notice.
