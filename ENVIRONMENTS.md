According to [ADR 0001](./doc/adr/adr-0001-environments.md), there are two main environments that we deploy our service to in the infrastructure: 
* `development` and 
* `production`.

However, if we include development, we also have:

* `local development`
* `GitHub actions`
* `GitHub Dependabot`

It may result in another ADR, but for now, let's collect what differences we want these environments to have:

| Environment       | ELSTER_CERTIFICATE_BASE64 and _PIN    | ELSTER_CERTIFICATE_PIN |
|-------------------|---------------------------------------|------------|
| local development | Test Cert                    | Engineer   |
| GH actions        | Test Cert                    | Designer   |
| GH Dependabot     | Test Cert                    | Product Manager |
| development       | Test Cert                    |            |
| production        | Cert for Schneller Gründen   |            |