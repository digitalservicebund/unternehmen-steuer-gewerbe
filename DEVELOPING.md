# Developing

## Using Git Hooks (DO NOT SKIP as a contributor)

We use GitHooks to prevent some problems from reaching the remote repository. This includes _security-related_ issues.

As this relates to our [commitment](./SECURITY.md) to security, we urge you to

1. Install [lefthook](https://lefthook.dev/) and run its install script once to enable the hooks:

```bash
lefthook install
```

2. Install [trivy](https://trivy.dev/) so that the hooks can use it to prevent passwords / security tokens from being leaked accidentally.

## Getting All the Code

This project relies on proprietary code which is included via an npm dependency that wraps it in a Node interface (`"@digitalservicebund/unternehmen-steuer-gewerbe-privat"`).

If you don't have access to that repository, you can check the interface and implement your own replacement (the proprietary code is available to anyone by (a) registering [here](https://www.elster.de/elsterweb/entwickler/login) and by (b) accepting the corresponding license.)

If you do have access, you still need to authenticate in order to fetch the dependency:

- Create a [GitHub personal access token](https://github.com/settings/tokens), assign the `read:packages` scope.
- Export the token as `NODE_AUTH_TOKEN` in your shell.

Once set up, `pnpm install` is all that's needed; there is an `.npmrc` in this repo that routes the `@digitalservicebund` scope to `npm.pkg.github.com` and makes the install use your `NODE_AUTH_TOKEN`.

(It's also possible to extend the default GitHub CLI token (`gh auth token`) to include `read:packages`, but exporting it is a security risk.)

## Secrets and Environment Variables

In production, secrets and environment variables are exclusively provided through a secrets manager.

For local development and testing, [`.env`](.env) is read. See [`.env.example`](.env.example) for details.

We strongly recommend against storing plaintext secrets in either of these files. Use a tool like [1Password](https://developer.1password.com/docs/cli/secrets-environment-variables/) instead.

## Running the API (by default on port 3000)

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

Start, mapping the local port to the container port

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

For CI scenarios there are more test-related NPM scripts. See the list below.

### Running Tests in VSCodium/VSCode with secrets stored in 1Password

The VSCode test runner is not able to read required secrets from 1Password. As a workaround, you can make make the test runner use a (1Password-aware) wrapper script instead of plain `node`. In order to do so, add this to your settings:

`"vitest.nodeExecutable": "vitest.wrapper.sh",`

## NPM Scripts

- `build` — Type-check only, no output; use `build:dev` or `build:prod` to produce `dist/`
- `build:dev` — Compile TypeScript to `./dist/` (keeps dev dependencies)
- `build:prod` — Compile TypeScript to `./dist/` and prune to prod dependencies (restores dev dependencies afterwards)
- `build:image` — Build app and Docker image
- `format` — Check format, fail on error (used in CI)
- `format:fix` — Check format, fix if possible (used in pre-commit Git hook)
- `lint` — Lint, fail on error (used in CI)
- `lint:fix` — Lint, fix if possible (used in pre-commit Git hook)
- `start` — Start API locally via tsx (no building involved)
- `start:image` — Start API via Docker (built via `build:image`)
- `start:watch` — Start API locally via nodemon, restart on changes to TS, JSON, YAML, MD files
- `test` — Run tests once
- `test:load` — Run load tests once
- `test:load:ci` — Same as `test:load` but without 1Password secrets injection (for CI)
- `test:smoke:ci` — Run smoke tests (CI only, no 1Password)
- `test:coverage` — Run tests once, report coverage to console and `./coverage/` (lcov for SonarCloud)
- `test:coverage:ci` — Same as `test:coverage` but without 1Password secrets injection (for CI)
- `test:watch` — Run tests, restart on code changes
