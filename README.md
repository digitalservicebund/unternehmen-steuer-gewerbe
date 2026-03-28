[![Pipeline](https://github.com/digitalservicebund/unternehmen-steuer-gewerbe/actions/workflows/ci-pipeline.yml/badge.svg)](https://github.com/digitalservicebund/unternehmen-steuer-gewerbe/actions/workflows/ci-pipeline.yml)<br/>
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=digitalservicebund_unternehmen-steuer-gewerbe&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=digitalservicebund_unternehmen-steuer-gewerbe)

> [!NOTE]
> We're currently in the process of setting up this repository. Nothing of value is to be expected at this stage.

# unternehmen-steuer-gewerbe

API for registering with "ELSTER" and "Gewerbeämtern"

Component of [digitalservicebund/unternehmen-one-stop-shop](https://github.com/digitalservicebund/unternehmen-one-stop-shop)

## Developing

### GitHooks

Requires [lefthook](https://lefthook.dev/) and a

```bash
lefthook install
```

### Running the API

```bash
pnpm start
```

or in watch mode, restarting on changes

```bash
pnpm run start:watch
```

### Running the Tests

```bash
pnmp run test
```

or in watch mode, restarting on changes

```bash
pnmp run test:watch
```

### Scripts

Cf. [package.json](./package.json)
