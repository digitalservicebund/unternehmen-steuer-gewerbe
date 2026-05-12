# Developing

## Getting All the Code

Parts of this code base are not public (e.g. the wrapper around the ELSTER [ERiC](https://www.elster.de/eportal/infoseite/entwickler) library). They are included as an npm dependency from a private GitHub repository (`unternehmen-steuer-gewerbe-privat`).

After cloning, run `pnpm install` as usual. You will need access to the private repository for pnpm to resolve the dependency.

## Environment Variables

> **Local development and testing only!** `.env.example` is a template that contains no real secrets. For anything beyond test values, load secrets at runtime from [1Password](https://developer.1password.com/docs/cli/secrets-environment-variables/) (or a similar secrets manager) and never commit them to git.
>
> **In production we do not use a `.env` file at all** — secrets are provided exclusively through a secrets manager.

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable                                 | Description                                                                                                                                                                                      |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `FIT_CONNECT_ENV`                        | Target environment: `test`, `stage`, or `prod` (see [Betriebsumgebungen](https://docs.fitko.de/fit-connect/docs/getting-started/environments)). Sets all API URLs automatically. Default: `test` |
| `FIT_CONNECT_CLIENT_ID`                  | OAuth2 Client-ID from the [Self-Service-Portal](https://docs.fitko.de/fit-connect/docs/receiving/destination/#zustellpunktverwaltung)                                                            |
| `FIT_CONNECT_CLIENT_SECRET`              | OAuth2 Client-Secret, same source as above                                                                                                                                                       |
| `FIT_CONNECT_DESTINATION_ID`             | UUID of the destination ([Zustellpunkt](https://docs.fitko.de/fit-connect/docs/receiving/destination/#zustellpunktverwaltung))                                                                   |
| `FIT_CONNECT_PUBLIC_KEY_ENCRYPTION_JWK`  | Public JWK for encryption, as JSON string ([JWK erzeugen](https://docs.fitko.de/fit-connect/docs/organisation-tasks/jwks-erzeugen#jwk_erzeugen))                                                 |
| `FIT_CONNECT_PRIVATE_KEY_DECRYPTION_JWK` | Corresponding private JWK for decryption, same source as above                                                                                                                                   |

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
pnpm run start:image
```

## Running the Tests

```bash
pnpm run test
```

or in watch mode, restarting on changes

```bash
pnpm run test:watch
```

### Running Tests in VSCode while secrets are stored in 1Password

The test runner is not able to read required secrets from 1Password. As a workaround add the following to your VSCode settings; this will make the test runner use a (1password aware) wrapper script instead of plain `node`:

`"vitest.nodeExecutable": "vitest.wrapper.sh",`

## Using Git Hooks

We're using [lefthook](https://lefthook.dev/) for Git hook configuration. After installing `lefthook`, run the following once:

```bash
lefthook install
```

## NPM Scripts

- `build` — Type-check only, no output; use `build:dev` or `build:prod` to produce `dist/`
- `build:dev` — Compile TypeScript to `./dist/` (keeps dev dependencies)
- `build:prod` — Compile TypeScript to `./dist/` and prune to prod dependencies (restores dev dependencies afterwards)
- `build:image` — Build app and Docker image
- `format` — Check format, fail on error (used in CI)
- `format:fix` — Check format, fix if possible (used in pre-commit Git hook)
- `lint` — Lint, fail on error (used in CI)
- `lint:fix` — Lint, fix if possible (used in pre-commit Git hook)
- `start` — Start API locally via ts-node (no building involved)
- `start:image` — Start API via Docker (built via `build:image`)
- `start:watch` — Start API locally via ts-node, restart on changes to TS, JSON, YAML, MD files
- `test` — Run tests once
- `test:coverage` — Run tests once, report coverage to console and `./coverage/` (lcov for SonarCloud)
- `test:ci:coverage` — Same as `test:coverage` but without 1Password secrets injection (for CI)
- `test:watch` — Run tests, restart on code changes
