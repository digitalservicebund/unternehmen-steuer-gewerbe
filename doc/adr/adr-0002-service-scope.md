# ADR 0002: Service Scope

## Date

2026-05-11

## Status

Proposed (should become accepted)

## Context

We're part of "Schneller Gründen" working along other teams. Here's where we draw the line between our responsibilities and those of other parties.

We're a service separate from the OSS, but neither is OSS expected to work without us, nor are we expected to work with any other consumer. This creates a permanent pull towards merging the services.

Making the scope explicit is meant as a counter-force, so we can work in smaller teams with clearer focus, less mental load and more commitment.

## Decisions

1. Our services provide a HTTP/Json API that allows other services to register a business without knowing the details of the technical systems or data formats involved.
2. If the API receives data that matches its rules, the consuemr of the API can expect the registration to succeed.
3. The terminology of our API is that of the OSS domain. It must not require the user to understand terms, abbreviations or codes of any of the forms or 3rd party APIs that are needed to actually process the business registration.

## Details

## Consequences

- As we're providing the API and OSS is consuming it, we'll need a way to communicate for and behavior of the exchanged data.
- We must coordinate with OSS when introducing breaking changes.
- We need to be careful about our API encoding the rules of the systems we're interfacing with (e.g. required fields in XGewerbeordnung).
- We must be aware that "being useful" to us means "being useful for the OSS" and "being useful to the systems we're interfacing with".
