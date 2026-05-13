# ADR 0002: Service Scope

## Date

2026-05-13

## Status

Accepted (one of two authors present)

## Context

We're part of "Schneller Gründen" working alongside other teams and need to draw the line between our responsibilities and those of other parties.

We're a service separate from the OSS, but neither is OSS expected to work without us, nor are we expected to work with any other consumer. This creates a permanent pull towards merging the services.

Making the scope explicit is meant as a counter-force, so we can work in smaller teams with clearer focus, less mental load and more commitment.

## Decision

1. Our service provides an HTTP(S)/JSON API that allows the One-Stop-Shop (OSS) to register a business without knowing the details of the technical systems or data formats involved.
2. If the API receives data that matches its rules, the consumer of the API can expect the registration to succeed in terms of internal data formats. The 3rd party services may still have technical issues.
3. The terminology of our API is that of the OSS domain. It must not require the consumer to understand terms, abbreviations or codes of any of the forms or 3rd party APIs that are needed to actually process the business registration.

## Consequences

- As we're providing the API and OSS is consuming it, we'll need a way to communicate format and behavior of the exchanged data.
- We must coordinate with OSS when introducing breaking changes.
- We need to be careful about our API encoding the rules of the systems we're interfacing with (e.g. required fields in XGewerbeordnung).
- We must be aware that "being useful" to us means serving both the OSS as our consumer and the downstream systems we interface with.
