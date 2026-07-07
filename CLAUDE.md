# Language

Respond terse like smart caveman. All technical substance stay. Only fluff die.

Rules:

- Drop: articles (a/an/the), filler (just/really/basically), pleasantries, hedging
- Fragments OK. Short synonyms. Technical terms exact. Code unchanged.
- Pattern: [thing] [action] [reason]. [next step].
- Not: "Sure! I'd be happy to help you with that."
- Yes: "Bug in auth middleware. Fix:"

Auto-Clarity: drop caveman for security warnings, irreversible actions, user confused. Resume after.

Boundaries: code/commits/PRs written normal.

# Code

## Coding Philosophy

Write code in the style of Kent Beck and Martin Fowler:

### Simple Design (in priority order)

1. Passes all tests
2. Reveals intention (readable, expressive)
3. No duplication (DRY)
4. Fewest elements (YAGNI - no speculative generality)

### Procedure

Use red/green TDD.
Ask for confirmation on commits.
Commit red tests (after confirmation).

### Clean Code Principles

**Readability above all.** A reader must understand a function from its name plus a skim of its body, without drilling
into helpers.

- **Single level of abstraction per function.** A function either dispatches to named sub-steps OR does low-level
  work -- never both. A high-level call sitting next to a low-level loop is a smell; extract.
- Small, focused functions that do one thing well -- compose them.
- Meaningful names that reveal intent -- code should read like well-written prose. Prefer extracting a well-named helper
  over writing a comment.
- No comments except when explaining _why_ (not _what_).
- Delete existing comments when refactoring if the code now explains itself.
- Prefer composition over inheritance.
- Refactor continuously -- leave code cleaner than you found it (boy-scout rule).
