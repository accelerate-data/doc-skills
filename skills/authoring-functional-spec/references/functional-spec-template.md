# Functional Spec Template & Authoring Prompt

This reference is the v0.2 template for behavior-focused functional specs under `docs/functional/`. Treat it as a menu, not a section checklist. The authoring skill chooses the sections that fit the subject and omits sections that do not apply. Do not emit `N/A`, `TBD`, or `[describe ...]` placeholders.

## Functional Spec Altitude

Functional specs describe outcomes, externally meaningful behavior, state guarantees, and user-visible terminal states. They do not prescribe UI layout, component structure, payload schemas, event names, retry policies, file paths, class names, API shapes, or implementation plans.

Pause on any paragraph and ask:

> Could a competent engineer using an agentic coding tool build this differently from what I am describing, and still be correct?

If yes, the paragraph is at functional-spec altitude. If no, cut the prescriptive detail or move it to a downstream design spec.

## Frontmatter

Every new v0.2 spec requires these fields:

```yaml
---
id: <canonical-id>
title: <human-readable title>
shape: <journey | surface | service | skill | install | utility>
persona: <DRE | FSA | CDO | CloudOps>
# Optional only when applicable:
# parent: <parent-id>
# sub-flows:
#   - <child-slug>
# renamed-from: <previous-id>
# absorbs:
#   - <prior-id>
---
```

`shape` lives only in the spec file. The User-Flows-Details Sheet has no shape column and the skill does not validate shape against Sheet category.

Do not add date fields, review-date fields, document version fields, or SHA fields to frontmatter. Functional spec provenance comes from git history: commits, tags, and commit SHAs.

`persona` is single-valued. Choose the persona whose work or outcome is most directly affected by the spec's behavior:

- `DRE` — data reliability or operations outcome owner.
- `FSA` — field solution / implementation outcome owner; AE and DE roll up here.
- `CDO` — business or governance outcome owner.
- `CloudOps` — platform, deployment, install, or operations owner.

Pre-v0.2 specs may contain older persona values. Do not migrate them as part of normal authoring.

## Expected Sections

These sections are expected in nearly every spec when they apply:

```markdown
# <Title> (`<canonical-id>`)

## Goal

## Inputs

## Outputs

## Invariants

## Cross-refs
```

If one genuinely does not apply, omit it. Absence means not applicable; it is not a failed checklist.

## Shape Menus

Load `shape-lenses.md` and choose from the matching shape section.
Starting menus are:

- `journey`: Trigger, Primary actor, Main flow / Phases, Alternate flows, Failure cases, State transitions, Business rules, Events / observability.
- `surface`: When-to-use, Surface inventory, Surface states, Interaction model, Cross-flow touch matrix, Access & responsiveness.
- `service`: Goals + Non-goals, Boundary contract, Lifecycle, Ownership, Consumers, Concurrency / ordering invariants, Risks & mitigations, Failure modes by class.
- `skill`: Invocation triggers, Phases, Refusal & scope rails, Handoffs, Runtime context contract, Resources used.
- `install`: Preconditions, Procedure, Verification, Rollback / recovery, Idempotency guarantees, Failure classes.
- `utility`: Public surface, Distribution kind, Audience class, Lifecycle, Exit conditions, Versioning & compatibility stance.

Section names in the final body are author-chosen. The menu is guidance, not an enforced vocabulary.

## File Layout

Standalone or parent specs live at:

```text
docs/functional/<canonical-id>/README.md
```

Child specs live beside the parent README:

```text
docs/functional/<parent-id>/NN-<child-slug>.md
```

Every child file requires an existing parent README and a corresponding `sub-flows:` entry in the parent frontmatter.

## Labels, Tags, and Signal Names

Three classes of names are legitimate to cite by value:

1. Existing production artifacts that already define behavior.
2. Canonical sibling flow IDs from the User-Flows-Details Sheet.
3. Already-cited artifacts in a prior version that still map to reality.

Hypothetical future labels, event names, payload keys, signal identifiers, UI copy, and schema names are design choices and stay downstream.

## Drafting Process

1. Resolve the Sheet row and target repo.
2. Decide `shape` and `persona`.
3. Read `shape-lenses.md` and use the matching shape section.
4. Enumerate the tentative behavioral model and assumptions before asking the
   first question.
5. Brainstorm one question at a time until behavioral gaps are resolved.
6. Draft directly, without placeholder scaffolds.
7. Self-review for altitude, coherence, scope match, cross-flow alignment,
   frontmatter consistency, completeness, and unresolved Open Questions.

Do not write to the Sheet. If Sheet data appears missing, stale, or inconsistent, report the discrepancy and the expected user action.
