# ADR 0001: Environments

## Date

2026-05-11

## Status

Proposed (should become accepted)

## Context

We're running `development` (`dev`) and `production` environments. Here's how we are using them and what expectations they will fulfill.

## Decision

### `development` Environment

- Sending requests to the `development` API
  - does not trigger messages to real Gewerbeämter or Finanzämter and it
  - does not register any business.
- The `development` environment can safely be used for any kind of development work, be it local or in the cluster, like
  - test-running new code,
  - debugging a problem,
  - testing a pipeline change,
  - displaying API documentation,
  - offering a point-and-click UI for interacting with the API.

### `production` Environment

- Sending requests to the `production` environment API can have real-world consequences.
- Access to the `production` environment is limited to the Unternehmen-One-Stop-Shop (OSS) app.

## Details

### Simplicity

The clear distinction between "can have real-world consquences" and "can safely be used for any kind of development work" simplifies many decisions the developers have to make. Instead of codifying each of them, we can refer to the `production / development` distinction.

For example:

- Will there be a Swagger UI for `production`?
  - No, because nothing but the OSS app may access the API.
- What certificates need to be set up?
  - Test certificates in `development` so we can't accidentally cause relevant consequences wrt. tax or business registratin offices.
  - Real certificaties in `production` as we need to authenticate ourselves when actually registering businesses.
- Against which environment should we run local code?
  - Against `development` as it can safely be used for any development purpose.
- Can the Swagger UI for `development` be publicly accessible?
  - Yes, because it does not lead to any relevant consequence wrt. tax or business registration offices. (We may consider rate limiting though.)

### Expectations (security, availability etc.)

`production`

- must prevent any access other than by the OSS
- must be highly available
- must be highly reliable in performing its services

`development`

- can be open to the public
- may be down at times

### Continuous Testing and Deployment Setup

Our continuous integration pipeline has three sequential stages each of which depends on the successful execution of the previous one:

1. Ensuring code and engineering quality

2. Deploying to `development`

3. Deploying to `staging`

## Consequences

### Limited Use Cases

In terms of use cases, we do not reliably support anything but what the OSS is built for.

As a consequence, e.g. _product demos_ or _user tests_ are not supported by using some other particular set of security or convenience measures. They either

- take place in `development` with no expectation at all that tax and business registration offices should notice , or they
- take place in `production` where users face all (legal, procedural etc.) consequences of actually registering businesses.
