According to [ADR 0001](./doc/adr/adr-0001-environments.md), there are two main environments that we deploy our service to in the infrastructure:

- `development` and
- `production`.

However, there are more places where our code is run:

- `local development`
- `GitHub actions`
- `GitHub Dependabot`

The latter, however, do not differ from `development`.

# Environment Variables

Here's the configuration that's set through environment variables:

- FIT_CONNECT_ENV=test
- FIT_CONNECT_CLIENT_ID=6b267aff-...
- FIT_CONNECT_DESTINATION_ID=fa63ede0-...
- ERIC_HERSTELLERID=49420
- FIT_CONNECT_PUBLIC_KEY_ENCRYPTION_JWK={...}

# Secrets

Here's the configuration that's set through environment secrets:

- FIT_CONNECT_CLIENT_SECRET
- FIT_CONNECT_PRIVATE_KEY_DECRYPTION_JWK
- ERIC_CERTIFICATE_BASE64
- ERIC_CERTIFICATE_PIN
