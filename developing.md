# Development Guide

## Build and Deployment Scripts

### `pnpm run build`

Compile TypeScript to `./dist/`

### `pnpm run build:image`

Build app and docker image

### `pnpm run format`

Check format, fail on error (used in CI)

### `pnpm run format:fix`

Check format, fix if possible (used in pre-commit GitHook)

### `pnpm run lint`

Lint, fail on error (used in CI)

### `pnpm run lint:fix`

Lint, fix if possible (used in pre-commit GitHook)

### `pnpm run start`

Start API locally via ts-node (no building involved)

### `pnpm run start:image`

Start API via docker (built via `pnpm run build:image`)

### `pnpm run start:watch`

Start API locally via ts-node (no building involved), restart on changes to files of type TS, JS, JSON, JSON5, YAML, MD

### `pnpm run test`

Run tests once

### `pnpm run test:coverage`

Run tests once, report coverage on console and in `./coverage`. Format is HTML and lconv (in pipeline, lconv is consumed by SonarCloud)

### `pnpm run test:ci:coverage`

Run tests once, report coverage on console and in `./coverage`. Format is HTML and lconv (in pipeline, lconv is consumed by SonarCloud)

### `pnpm run test:watch`

Run tests, restart on code changes
