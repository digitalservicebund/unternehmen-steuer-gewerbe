# ADR 0004: Testing and Quality Assurance

## Date

2026-07-🚧

## Status

Proposed (🚧 should become "accepted")

## Context

Testing is an integral part of quality engineering, but then it's also not its end.

Here's our approach to quality.

## Decision

### Tests

We use tests for enforcing defined behavior and catch regressions:

1. unit tests,
1. integration tests
1. tests that include calling 3rd party services and
1. tests that span the full picture from API request to API response including 3rd party services.
1. load tests
1. smoke tests

We enforce a test coverage of 90+% (at the time of writing, it's roughly 96%)

### Continuous Integration

(Security related steps are omitted, here.)

We use [GitHub Actions](https://docs.github.com/en/actions) for running a Continuous Integration pipeline.

Each commit to a code branch triggers the following quality related tasks:

1. Confirm that code follows our formatting rules.
1. Confirm that the code follows the rules of the language (linting).
1. Confirm that the code passes all tests.
1. Confirm that the main artefact (a docker image) can be built successfully.
1. Confirm that the code passes our rules (static analysis) on
   1. Test coverage
   1. Reliability
   1. Maintainability
   1. Security hotspots
   1. Code duplication

All (merge) commits to `main` additionally trigger a

1. Load test

If any of these fail

1. the pipeline blocks deployment and
1. the engineers are notified (cf. processes below).

We work on continuous integration to be fast so the feedback loops are short. (At the time of writing it's around 3-4 minutes if no error triggered an early exit.)

### Continuous Deployment (development => production)

All (merge) commits to `main` that pass the above tests additionally trigger Continuous Deployment tasks:

1. Deploy to the development environment
1. Run a smoke test on the health of the new deployment
1. Deploy to production

These are run sequentially: any failure

1. blocks all following requests and
1. triggers a notification (cf. processes below)

We strive for a change lead time (cf. [DORA metrics](https://dora.dev/guides/dora-metrics/)) of less than 10 minutes so feedback loops are short. (At the time of writing, it's around 6 minutes.)

### Product Development Processes

Besides the tooling, the following processes work towards engineering quality:

1. We have a round-robin "maintenance shift" that assures our repositories stay in good health:
   1. Security updates get handled quickly
   1. Branches are handled through PRs
   1. We do a lot of code reviews
   1. We following "[ship, show, ask](https://martinfowler.com/articles/ship-show-ask.html)" in order to foster fast feedback loops.
1. We actively monitor a single, central notification channel ("alerts") and acknowledge, assign and address any issue as quickly as possible.
1. We have regular exchanges with fellow developers on technical issues.

## Consequences

1. Continuous integration and continuous deployment come with some real complexity and have implications on our workflow:
   1. A broken pipeline blocks both, deployment of `main` and development in branches, so it needs to be fixed as soon as possible.
   1. Flakyness has immediate consequences. We need to be extra vigilant to avoid it.
   1. Speed is of the essence. A slow pipeline creates drag in many places.

1. As all checks are breaking the pipeline if they fail, it's desirable to not fail them in the first place.
   1. Git hooks are a possible solution and we have configured some in the repository that try to fix formatting and linting on push. The trade-off is a delay during `git push`.
   1. Some devs have even added `build` and `test` to their `pre-push` hook trading local delay for getting the change merged faster.
