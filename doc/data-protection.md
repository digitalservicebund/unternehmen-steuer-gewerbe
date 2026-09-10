# 🇩🇪 Personenbezogene Daten in diesem Dienst

Welche personenbezogenen Daten diese API entgegennimmt, wohin sie sie sendet und was sie behält.

Beschrieben wird das technische Verhalten des Codes in diesem Repository. Es ist nicht die Datenschutzerklärung für die Menschen, deren Daten hier verarbeitet werden — diese stellt der [One-Stop-Shop](https://github.com/digitalservicebund/unternehmen-one-stop-shop) bereit, der diese API nutzt und die Daten erhebt.

## Was der Dienst entgegennimmt

Eine Anfrage an `POST /api/v1/register-gewerbe` enthält alles, was eine Gewerbeanmeldung und ein Fragebogen zur steuerlichen Erfassung brauchen, unter anderem:

- Name, Geburtsname, Geburtsdatum und -ort, Geschlecht, Staatsangehörigkeit
- Wohnanschrift, Betriebsanschrift, Telefonnummer, E-Mail-Adresse
- Steuer-ID, Steuernummer, Religionszugehörigkeit
- IBAN (bei ausländischen Konten zusätzlich BIC) der Konten für Steuerzahlungen
- Angaben zum Betrieb: Tätigkeit, erwarteter Umsatz und Gewinn, Zahl der Beschäftigten

Die vollständige Feldliste ist das OpenAPI-Schema, als JSON unter `/doc` und gerendert unter `/ui`. Wo jedes Feld in den beiden Zielformaten landet, dokumentiert [data-paths-and-origins.md](./data-paths-and-origins.md).

## Was gespeichert wird: nichts

Es gibt keine Datenbank und keinen persistenten Speicher. Nichts aus einer Anfrage wird auf die Festplatte geschrieben oder zwischengespeichert — die Daten einer Anfrage liegen nur für deren Dauer im Speicher und sind danach weg.

Das gilt auch für den PDF-Beleg: er wird pro Anfrage erzeugt, als Base64 im Response-Body zurückgegeben und nie in eine Datei geschrieben.

Der Dienst liest Dateien (XSD- und Schematron-Ressourcen, Schriften) und hält diese über Anfragen hinweg im Cache. Geschrieben wird keine.

## Wohin Daten gesendet werden

| Empfänger                            | Daten                                                                                                                 | Schutz                                                                                                                                                                                                                            |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PVOG (FITKO), `pvog.fitko.net`       | ausschließlich die Betriebsanschrift — PLZ, Ort, Straße, Hausnummer — als Volltextabfrage; kein Name, keine Kennungen | HTTPS. Löst die Anschrift auf einen ARS und das zuständige Gewerbeamt auf                                                                                                                                                         |
| Gewerbeamt, über FIT-Connect (FITKO) | das vollständige XGewerbeordnung-XML                                                                                  | JWE, verschlüsselt mit dem öffentlichen Schlüssel des Empfängers. Auch die Metadaten der Einreichung sind verschlüsselt und enthalten nur die Schema-URI und einen SHA-512-Hash der Daten — die FITKO kann den Inhalt nicht lesen |
| Gewerbeamt, über OSCI/DVDV (AKDB)    | das XGewerbeordnung-XML und der PDF-Beleg, als Multipart-Request                                                      | TLS mit Client-Zertifikat (mTLS). Anders als beim FIT-Connect-Weg ist das nur Transportverschlüsselung                                                                                                                            |
| Finanzamt, über ELSTER (ERiC)        | der FsE-Datensatz                                                                                                     | von der ERiC-Bibliothek verschlüsselt und komprimiert (`CMSEncryptedData`, GZIP), bevor er den Prozess verlässt                                                                                                                   |

Welcher der beiden Wege zum Gewerbeamt genutzt wird, hängt von der Kommune ab; die Entscheidung fällt in [getGewerbeRoutingInfo.ts](../src/routes/registerGewerbe/getGewerbeRoutingInfo.ts).

`GET /api/v1/register-gewerbe/gewerbemeldung/events` gibt eine Submission-ID an FIT-Connect oder OSCI weiter, um den Status einer früheren Einreichung abzufragen. Dabei werden keine personenbezogenen Daten gesendet und keine Ergebnisse gespeichert.

## Was protokolliert wird

[requestLogging.ts](../src/routes/logging/requestLogging.ts) schreibt für Anfragen an `/api/*` je eine JSON-Zeile nach stdout: eine, wenn die Anfrage eintrifft, und eine, wenn sie abgeschlossen ist.

- Zeitstempel, Ereignis, HTTP-Methode, Pfad, Status der Antwort, Dauer
- die IP-Adresse des Clients — aus `x-forwarded-for`, sonst aus der Socket-Verbindung. Das ist ein personenbezogenes Datum.

Request-Bodies, Header und Response-Bodies werden nicht protokolliert.

Schlägt die Validierung des erzeugten XGewerbeordnung-XML fehl, nennt der protokollierte Fehler die verletzten Regeln und die Anzahl der Schema-Fehler — etwa `0 schema error(s); failed schematron rule(s): SCH-0189` (`createValidationErrorSummary` in [xmlValidator.ts](../src/helpers/xmlValidator.ts)). Die Rohausgabe des Validators bleibt absichtlich aus dem Log: ein Schema-Fehler zitiert den zurückgewiesenen Wert — `'1965-13-45' is not a valid value of the atomic type 'xs:date'` bei einem fehlerhaften Geburtsdatum — und das ist ein personenbezogenes Datum.

Die ERiC-Bibliothek führt ein eigenes technisches Log (`eric.log`) im Arbeitsverzeichnis. Es hält Bibliotheksversionen, Verarbeitungsschritte und Rückgabecodes fest, nicht die Inhalte der Einreichung, und es ist flüchtig: es liegt im Dateisystem des Containers und verschwindet mit dem Pod.

Logs gehen nach stdout. Wie sie gesammelt und wie lange sie aufbewahrt werden, entscheidet die Betriebsplattform und ist nicht Teil dieses Repositorys.

## Umgebungen

Nur `production` erreicht echte Gewerbeämter und Finanzämter, und diese Umgebung ist nicht aus dem Internet erreichbar — sie kann nur von der One-Stop-Shop-App aufgerufen werden. Siehe [ADR 0001](./adr/adr-0001-environments.md) und [ADR 0003](./adr/adr-0003-access-control.md).

Die Umgebung `development` ist sandboxed: dort wird nichts angemeldet. Sie ist aber öffentlich erreichbar, deshalb dürfen **keine echten personenbezogenen Daten** dorthin gesendet werden.

## Probleme mitteilen

Alle sicherheitsrelevanten Hinweise, auch solche zu personenbezogenen Daten, bitte an die Adresse in [SECURITY.md](../SECURITY.md) — und nicht über GitHub "issues".

# 🇬🇧 Personal Data in this Service

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
