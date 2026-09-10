# Personal Data in this Service

What personal data this API receives, where it sends it, and what it keeps.

This describes the technical behavior of the code in this repository. It is not the privacy notice for the people whose data is processed here — that one is provided by the [One-Stop-Shop](https://github.com/digitalservicebund/unternehmen-one-stop-shop), which is the consumer of this API and collects the data in the first place.

## What the service receives

A request to `POST /api/v1/register-gewerbe` carries everything a business registration needs, including:

- name, Geburtsname, date and place of birth, Geschlecht, Staatsangehörigkeit
- private address, business address, phone number, email address
- Steuer-ID, Steuernummer, Religionszugehörigkeit
- IBAN (and BIC for foreign accounts) of the accounts used for tax payments
- business data: activity, expected revenue and profit, number of employees

The full field list is the OpenAPI schema, served as JSON at `/doc` and rendered at `/ui`. Where each field ends up in the two target formats is documented in [data-paths-and-origins.md](./data-paths-and-origins.md).

## What is stored: nothing

There is no database and no persistent storage. Nothing taken from a request is written to disk or cached — request data lives in memory for the duration of the request and is gone afterwards.

This includes the PDF receipt: it is generated per request, returned to the caller as base64 in the response body, and never written to a file.

The service reads files (XSD and Schematron resources, fonts) and caches those between requests. It writes none.

## Where data is sent

| Recipient                           | Data                                                                                                     | Protection                                                                                                                                                                                    |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PVOG (FITKO), `pvog.fitko.net`      | the business address only — PLZ, Ort, Straße, Hausnummer — as a full-text query; no name, no identifiers | HTTPS. Used to resolve the address to an ARS and the competent Gewerbeamt                                                                                                                     |
| Gewerbeamt, via FIT-Connect (FITKO) | the complete XGewerbeordnung XML                                                                         | JWE, encrypted with the destination's public key. The submission metadata is encrypted as well and holds only the schema URI and a SHA-512 hash of the data, so FITKO cannot read the content |
| Gewerbeamt, via OSCI/DVDV (AKDB)    | the XGewerbeordnung XML plus the PDF receipt, as a multipart request                                     | TLS with client-certificate authentication (mTLS). Unlike the FIT-Connect path, this is transport encryption only                                                                             |
| Finanzamt, via ELSTER (ERiC)        | the FsE data set                                                                                         | encrypted and compressed by the ERiC library (`CMSEncryptedData`, GZIP) before it leaves the process                                                                                          |

Which of the two Gewerbeamt paths is used depends on the commune; the decision is made in [getGewerbeRoutingInfo.ts](../src/routes/registerGewerbe/getGewerbeRoutingInfo.ts).

`GET /api/v1/register-gewerbe/gewerbemeldung/events` passes a submission ID on to FIT-Connect or OSCI to fetch the status of an earlier submission. It sends no personal data and stores no result.

## What is logged

[requestLogging.ts](../src/routes/logging/requestLogging.ts) writes one JSON line to stdout when a request to `/api/*` arrives and one when it completes:

- timestamp, event, request method, request path, response status, duration
- the client IP — from `x-forwarded-for`, else the socket address. This is personal data.

Request bodies, headers and response bodies are not logged.

When the generated XGewerbeordnung XML fails validation, the logged error names the violated rules and counts the schema errors — for example `0 schema error(s); failed schematron rule(s): SCH-0189` (`createValidationErrorSummary` in [xmlValidator.ts](../src/helpers/xmlValidator.ts)). The raw validator output is deliberately kept out of the log: a schema error quotes the value it rejected — `'1965-13-45' is not a valid value of the atomic type 'xs:date'` for a malformed geburtsdatum — and that is personal data.

The ERiC library keeps a technical log of its own (`eric.log`) in the working directory. It records library versions, validation steps and return codes rather than submission content, and it is ephemeral: it lives in the container's file system and is discarded with the pod.

Logs go to stdout. How they are collected and how long they are kept is decided by the deployment platform and is out of scope for this repository.

## Environments

Only `production` reaches real Gewerbeämter and Finanzämter, and it is not exposed to the internet — it can only be called by the One-Stop-Shop app. See [ADR 0001](./adr/adr-0001-environments.md) and [ADR 0003](./adr/adr-0003-access-control.md).

The `development` environment is sandboxed: nothing is registered anywhere. It is, however, publicly reachable, so **do not send real personal data to it**.

## Reporting a problem

Anything security-relevant, including issues affecting personal data, goes to the address in [SECURITY.md](../SECURITY.md) — please do not open a GitHub issue for it.
