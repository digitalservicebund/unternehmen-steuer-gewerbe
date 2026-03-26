[![Pipeline](https://github.com/digitalservicebund/unternehmen-steuer-gewerbe/actions/workflows/ci-pipeline.yml/badge.svg)](https://github.com/digitalservicebund/unternehmen-steuer-gewerbe/actions/workflows/ci-pipeline.yml)<br/>
Quality Gate badge (missing)

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

or in watcher, restarting on changes

```bash
pnpm run start:watch
```

### Scripts

- `format` - checks the format
- `format:fix` - fixes formatting errors
- `lint` - checks linting
- `lint:fix` - fixes linting errors
