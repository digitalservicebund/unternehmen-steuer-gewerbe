# Developing

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
docker build . --tag "unternehmen-steuer-gewerbe"
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

We have an annotated [package.json](./package.json). Please have a look, there.
