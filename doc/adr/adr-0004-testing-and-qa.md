# ADR 0004: Testing and Quality Assurance

## Date

2026-07-16 (revised 2026-09-08)

## Status

Proposed (🚧 should become "accepted")

## Context

Testing is an integral part of quality engineering, as are other tools and processes.

Here's our approach to quality.

## Decision

### Tests

We use tests for enforcing defined behavior and catching regressions. A test's file name suffix decides its tier, and each tier has its own vitest config:

1. `*.unit.test.ts` — one unit under test, all externals mocked. No network.
1. `*.integration.test.ts` — the whole app driven through `app.request(...)` with all API clients mocked. This covers routing, transformation, XML building, XSD/Schematron validation and error mapping end to end within our own code.
1. `*.contract.test.ts` — calls the real test endpoints of the services we depend on (PVOG, FIT-Connect, ELSTER/ERiC, OSCI) to confirm that their contracts still hold.
1. `*.load.test.ts` — concurrency behavior of `POST /api/v1/register-gewerbe`.
1. `*.smoke.test.ts` — health of a freshly deployed environment, run against that deployment.

Unit and integration tests are the tiers that gate a merge (cf. Continuous Integration below).

Test coverage is enforced by the SonarQube quality gate. We enforce a test coverage of 90+% (at the time of writing, it's 94%). Coverage is measured over the unit and integration tiers, whose reports are merged before the scan (`test:coverage:merge`).

### Continuous Integration

(Security-related steps are omitted here.)

We use [GitHub Actions](https://docs.github.com/en/actions) for running a Continuous Integration pipeline.

Each commit to a code branch and each pull request against `main` triggers the following quality-related tasks, which run in parallel:

1. Confirm that code follows our formatting rules.
1. Confirm that the code follows the rules of the language (linting).
1. Confirm that file and directory names follow our naming rules.
1. Confirm that the code passes the unit and integration tests (sharded for speed).
1. Confirm that the main artifact (a docker image) can be built successfully.
1. Confirm that the code passes our rules (static analysis) on:
   1. Test coverage.
   1. Reliability.
   1. Maintainability.
   1. Security hotspots.
   1. Code duplication.

If any of these fail:

1. The pipeline blocks deployment.
1. The engineers are notified (cf. processes below).

Tests that call 3rd party services are deliberately _not_ part of this pipeline. Contract tests run on a schedule instead — every 30 minutes between 06:00 and 18:00 (Europe/Berlin), hourly outside that window. A failure there usually means a 3rd party is unavailable, which must not block our merges, but we still want to learn about it within half an hour. They report to our "notifications" channel (cf. processes below).

The load test likewise runs on its own nightly schedule and is not wired into the commit pipeline.

We work to keep continuous integration fast so the feedback loops are short (at the time of writing it's around 5-6 minutes if no error triggered an early exit).

### Continuous Deployment (development => production)

All (merge) commits to `main` that pass the above tests additionally trigger Continuous Deployment tasks:

1. Publish the scanned image: promote the private candidate image, sign it with cosign and attest the vulnerability scan.
1. Deploy to the development environment.
1. Run a smoke test on the health of the new deployment.
1. Deploy to production.

Steps 2 to 4 are a single GitHub Actions job on purpose, so that one concurrency group covers the whole deploy phase. Split into separate jobs, a later run's development deploy could overtake an earlier run's smoke test and production deploy, because the concurrency queue only orders entries into one job, not along a chain of jobs.

These are run sequentially: any failure

1. Blocks all following requests.
1. Triggers a notification (cf. processes below).

We strive for a change lead time (cf. [DORA metrics](https://dora.dev/guides/dora-metrics/)) of less than 10 minutes so feedback loops are short. (At the time of writing, it's around 6 minutes.)

### Product Development Processes

Besides the tooling, the following processes work towards engineering quality:

1. We have a round-robin "maintenance shift" that ensures our repositories stay in good health:
   1. Security updates get handled quickly.
   1. Branches are handled through PRs.
   1. We do a lot of code reviews.
   1. We follow "[ship, show, ask](https://martinfowler.com/articles/ship-show-ask.html)" in order to foster fast feedback loops.
1. We actively monitor two notification channels and acknowledge, assign and address any issue as quickly as possible:
   1. "alerts" — our own pipeline: failing checks on `main`, failing deployments, failing load tests.
   1. "notifications" — failing contract tests, i.e. mostly the availability of the services we depend on.
1. We have regular exchanges with fellow developers on technical issues.

## Consequences

1. Continuous integration and continuous deployment come with some real complexity and have implications on our workflow:
   1. A broken pipeline blocks both deployment of `main` and development in branches, so it needs to be fixed as soon as possible.
   1. Flakiness has immediate consequences. We need to be extra vigilant to avoid it.
   1. Speed is of the essence. A slow pipeline creates drag in many places.

1. Keeping 3rd party calls out of the commit pipeline buys us a fast, non-flaky merge gate, but a change that only breaks against a real 3rd party is not caught by the pull request. It surfaces in the next scheduled contract run (up to an hour later) or in the smoke test after the development deployment.

1. Since any failing check breaks the pipeline, it's desirable to not fail them in the first place.
   1. Git hooks are a possible solution and we have configured some in the repository: a `pre-commit` hook fixes formatting and linting, checks file and directory names and scans for secrets, staging its own fixes. The trade-off is a delay during `git commit`.
