# Developing

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable                                 | Description                                                                                                                                                                              |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FIT_CONNECT_CLIENT_ID`                  | OAuth2 Client-ID from the [Self-Service-Portal](https://docs.fitko.de/fit-connect/docs/receiving/destination/#zustellpunktverwaltung)                                                    |
| `FIT_CONNECT_CLIENT_SECRET`              | OAuth2 Client-Secret, same source as above                                                                                                                                               |
| `FIT_CONNECT_OAUTH_TOKEN_URL`            | Token endpoint, e.g. `https://auth-testing.fit-connect.fitko.dev/token` (see [Betriebsumgebungen](https://docs.fitko.de/fit-connect/docs/getting-started/environments#test))             |
| `FIT_CONNECT_SUBMISSION_API_URL`         | Submission API base URL, e.g. `https://test.fit-connect.fitko.dev/submission-api` (see [Betriebsumgebungen](https://docs.fitko.de/fit-connect/docs/getting-started/environments#test))   |
| `FIT_CONNECT_DESTINATION_API_URL`        | Destination API base URL, e.g. `https://test.fit-connect.fitko.dev/destination-api` (see [Betriebsumgebungen](https://docs.fitko.de/fit-connect/docs/getting-started/environments#test)) |
| `FIT_CONNECT_ROUTING_API_URL`            | Routing API base URL, e.g. `https://routing-api-testing.fit-connect.fitko.dev.` (see [Betriebsumgebungen](https://docs.fitko.de/fit-connect/docs/getting-started/environments#test))     |
| `FIT_CONNECT_DESTINATION_ID`             | UUID of the destination ([Zustellpunkt](https://docs.fitko.de/fit-connect/docs/receiving/destination/#zustellpunktverwaltung))                                                           |
| `FIT_CONNECT_PUBLIC_KEY_ENCRYPTION_JWK`  | Public JWK for encryption, as JSON string ([JWK erzeugen](https://docs.fitko.de/fit-connect/docs/organisation-tasks/jwks-erzeugen#jwk_erzeugen))                                         |
| `FIT_CONNECT_PRIVATE_KEY_DECRYPTION_JWK` | Corresponding private JWK for decryption, same source as above                                                                                                                           |

## Running the API

### Locally via pnpm

```bash
pnpm start
```

or in watch mode, restarting on changes

```bash
pnpm run start:watch
```

### Locally via Docker

Build image with

```bash
pnpm run build:image
```

start, mapping local port to container port

```bash
docker run -p 3000:3000 unternehmen-steuer-gewerbe:latest
```

## Running the Tests

```bash
pnpm run test
```

or in watch mode, restarting on changes

```bash
pnpm run test:watch
```

## Using Git Hooks

We're using [lefthook](https://lefthook.dev/) for Git hook configuration. After installing `lefthook`, run the following once:

```bash
lefthook install
```

## NPM Scripts

We have an annotated [package.json5](./package.json5). Please have a look, there.
