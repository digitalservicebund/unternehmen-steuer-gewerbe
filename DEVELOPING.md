# Developing

## Getting All the Code

Parts of this code base are not public (e.g. the wrapper around the ELSTER [ERiC](https://www.elster.de/eportal/infoseite/entwickler) library). They have been added to this repository as Git submodules.

Fetching all the repository including the submodules' content can be done like this (assuming you have access to the submodules' repositories):

```bash
  git clone --recurse-submodules git@github.com:digitalservicebund/unternehmen-steuer-gewerbe.git
```

If the repository was cloned as usual, the following command will fetch the content of the submodules:

```bash
  git submodule update --init --recursive
```

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
docker run -p 3000:3000 \
  -e FIT_CONNECT_ENV="test" \
  -e FIT_CONNECT_CLIENT_ID="fit_connect_client_id_from_env_file" \
  -e FIT_CONNECT_CLIENT_SECRET="fit_connect_client_secret_from_env_file" \
  -e FIT_CONNECT_DESTINATION_ID="fit_connect_destination_id_from_env_file" \
  -e FIT_CONNECT_PUBLIC_KEY_ENCRYPTION_JWK='fit_connect_public_key_encryption_jwk_from_env_file' \
  -e FIT_CONNECT_PRIVATE_KEY_DECRYPTION_JWK='fit_connect_private_key_decryption_jwk_from_env_file' \
  unternehmen-steuer-gewerbe:latest
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

We have an annotated [package.json5](./package.json5). Please have a look, there.
