---
name: authoring-design-spec
description: Use when authoring or updating developer-facing design specs under docs/design for an existing canonical functional spec, especially architecture decisions, technical tradeoffs, states, data flows, schemas, source-file references, and gaps between flow behavior and current design coverage
---

# Authoring a Design Spec

## When to use this

Use this skill when authoring or updating the design spec that sits one
level below a canonical functional spec. The functional spec is the behavioral source of
truth; the design spec explains how the repo intends to realize that behavior.

This skill is **not** for:

- User-flow, behavior, journey, or PRD-adjacent specs. Use
  `authoring-functional-spec` first.
- Implementation plans. Use `superpowers:writing-plans`.
- End-user help pages. Use `write-user-guide`.

## Required inputs

- Canonical flow ID.
- Existing functional spec at `docs/functional/<canonical-id>/README.md`, or a child
  flow file under `docs/functional/<parent-id>/NN-<child-slug>.md` whose
  frontmatter `id` matches the canonical ID.

If the canonical ID is missing, ask:

> Which canonical flow ID should this design spec support?

If the matching functional spec is not present, abort:

> Functional spec `<canonical-id>` was not found under `docs/functional/`. Author the
> functional spec first with `authoring-functional-spec`, then rerun this skill.

## Workflow

### Phase 0 - Precondition check

1. Verify `git rev-parse --is-inside-work-tree` exits zero.
2. Confirm `superpowers:brainstorming` is available through the active
   runtime's skill mechanism. In Codex, use the available skills list and
   follow the relevant `SKILL.md`; in Claude Code, use the Skill tool.
3. Confirm the repo has `docs/functional/`. If not, abort with the missing
   functional-spec message above.

### Phase 1 - Resolve the canonical flow

1. Use the supplied canonical ID, or ask for it if missing.
2. Check `docs/functional/<canonical-id>/README.md`.
3. If not found, search `docs/functional/**/*.md` for frontmatter
   `id: <canonical-id>`.
4. Read the matching functional spec. Extract:
   - title and persona
   - goal, scope, trigger, inputs, outputs, success outcome
   - main flow or phases
   - alternate flows, failure cases, state transitions
   - business rules, invariants, events / observability
   - open questions

### Phase 2 - Find related design specs

Read `docs/design/README.md` when present, then search `docs/design/` for:

- the canonical flow ID
- the flow title
- named production artifacts cited by the functional spec
- sibling canonical IDs referenced in the functional spec
- important behavioral nouns from the flow's goal, outputs, failures, and
  invariants

Read only related design specs. Build a short internal coverage map:

- **covered** - behavior already addressed by an existing design spec.
- **partial** - behavior mentioned but missing design decisions or source
  anchors.
- **missing** - behavior with no design coverage.
- **conflicting** - design text that contradicts the functional spec.

### Phase 3 - Propose the design-spec gap

Before drafting, present the gap analysis to the author:

- canonical flow ID and functional-spec path
- related design specs read
- proposed target path under `docs/design/`
- what should be covered or changed
- what should stay out because it belongs in the functional spec or implementation
  plan

If no meaningful design gap exists, say so and stop without writing a new spec.

### Phase 4 - Hand off to `superpowers:brainstorming`

Invoke `superpowers:brainstorming` through the active runtime's skill mechanism
with this context:

> We are authoring a design spec under `docs/design/` for canonical flow
> `<canonical-id>`. The functional spec is `<functional-spec-path>` and is the behavioral
> source of truth. Related design specs read: `<paths>`. Gap analysis:
> `<covered/partial/missing/conflicting summary>`. Keep the design spec one level
> below the functional spec and above the implementation plan. Pressure-test the
> proposed design coverage, ask one question at a time, and keep implementation
> task sequencing for `superpowers:writing-plans`.

Wait for brainstorming to produce an approved design direction before drafting.

### Phase 5 - Draft or update the design spec

Write to the approved target path under `docs/design/`. Prefer
`docs/design/<topic>/README.md` for durable topics; use a sub-document only when
an existing design directory already owns the topic.

Use this structure unless the repo has a stricter local template:

```markdown
# <Design Topic>

> **Status:** Draft
> **Functional spec:** [`<canonical-id>`](../../functional/<canonical-id>/README.md)

## Overview

2-3 sentences explaining which part of the flow this design covers and why the
existing design coverage was insufficient.

## Design Scope

**Covers**

- ...

**Does not cover**

- ...

## Key Decisions

| Decision | Rationale |
|---|---|
| ... | ... |

## Architecture / How It Works

Design-level structure, data flow, APIs, schemas, state, lifecycle, or
integration behavior needed to realize the flow.

## States / Transitions

Include only state that matters to the design.

## Relationship to Existing Design Specs

| Spec | Relationship |
|---|---|
| `docs/design/...` | Covered / partial / superseded / dependency |

## Key Source Files

| File | Purpose |
|---|---|
| `src/path/file.ts` | One-line responsibility |

## Open Questions

1. `[design]` ...
```

## Writing principles

1. **Flow-backed**: Every design spec starts from a canonical functional spec.
2. **Gap-oriented**: Do not create a new design spec when an existing one already
   covers the flow. Update the existing spec instead.
3. **Design altitude**: Include design decisions, state, schemas, interfaces,
   data flow, and source anchors. Exclude behavior-source-of-truth content and
   implementation task sequencing.
4. **Traceability**: Link to the functional spec and related design specs.
5. **Decisions over descriptions**: State the decision and rationale.
6. **Present tense**: Describe the current intended design, not history.
7. **Source file references**: Include accurate source files when code already
   exists. If code does not exist, state that in the source-files section
   instead of inventing paths.

## Self-review

Before writing or claiming completion, check:

- The canonical functional spec exists and is linked.
- Related design specs were searched and read when relevant.
- The spec explicitly covers a gap, partial coverage, or conflict.
- No unresolved product-flow question is hidden in design text.
- Implementation plan tasks are absent.
- `docs/design/README.md` is updated when it exists.
- `superpowers:verification-before-completion` is invoked before completion
  when available.

## Output

After writing, summarize:

- canonical flow ID and functional-spec path
- design spec path
- related design specs read
- coverage added or changed
- open questions remaining
- whether `docs/design/README.md` was updated
