---
name: authoring-design-spec
description: Use when authoring or updating developer-facing design specs under docs/design for one or more canonical functional specs (many-to-many via tags), especially architecture decisions, technical tradeoffs, states, data flows, schemas, source-file references, and gaps between flow behavior and current design coverage
---

# Authoring a Design Spec

## When to use this

Use this skill when authoring or updating the design spec that sits one level below a canonical functional spec. The functional spec is the behavioral source of truth; the design spec explains how the repo intends to realize that behavior.

## Canonical artifact model

- One canonical user flow maps to exactly one functional spec.
- The relationship between functional specs and design docs is many-to-many:
  - A functional spec may be supported by many design docs.
  - A design doc may cover behavior from many functional specs.
- Tagging expresses this relationship. Each design doc carries a `functional-specs` tag list in its frontmatter enumerating every canonical flow ID it covers; each functional spec may carry a `design-specs` tag list listing the design docs that realize it.
- The User-Flows-Details Sheet repo column is the primary repo for the flow.
- The functional spec and all design docs for that flow must live in the primary repo.
- Code grounding is expected to come from the primary repo. Read or cite code from another repo only when the user explicitly identifies that repo as a secondary helper location for the flow.

This skill is **not** for:

- User-flow, behavior, journey, or PRD-adjacent specs. Use `doc-skills:authoring-functional-spec` first. A direct request to author a functional spec is not a design-spec trigger; do not select this skill as the primary authoring workflow for that request.
- Implementation plans. Use `superpowers:writing-plans`.
- End-user help pages. Use `doc-skills:authoring-user-guide`.
- AI prompt-writing requests. Use `doc-skills:writing-ai-prompts`.

For implementation-plan requests based on a functional spec or design spec, do not continue in design-spec authoring mode. Route to `superpowers:writing-plans` and hand over the canonical flow ID, functional-spec path, relevant design-spec paths, gap analysis, source-file anchors, open questions, and any implementation constraints the user provided.

If existing design docs already cover the flow and the user asks for an implementation plan next, stop design-spec authoring and hand that covered design context to `superpowers:writing-plans`.

## Required inputs

- One or more canonical flow IDs. The first is the primary flow; additional IDs indicate other functional specs this design doc also covers (many-to-many).
- Existing functional spec for each canonical ID at `docs/functional/<canonical-id>/README.md`, or a child flow file under `docs/functional/<parent-id>/NN-<child-slug>.md` whose frontmatter `id` matches.
- Access to the User-Flows-Details Sheet through `gws`, so the skill can verify the flow's Sheet repo before writing a design doc.

If no canonical ID is supplied, ask:

> Which canonical flow ID(s) should this design spec cover?

If the matching functional spec is not present, abort:

> Functional spec `<canonical-id>` was not found under `docs/functional/`. Author the functional spec first with `authoring-functional-spec`, then rerun this skill.

Before stopping, prepare a handoff for `authoring-functional-spec` containing the canonical flow ID, the requested design goal, relevant docs or source files already identified, and the reason the design spec is blocked. Ask the user to switch back to `authoring-functional-spec` with that handoff instead of silently continuing in design-spec mode.

## Workflow

### Phase 0 - Precondition check

1. Verify `command -v gws` resolves.
2. Run `gws auth status`. If non-zero, abort with:

   > Run `gws auth login` first, then retry.

3. Verify `git rev-parse --is-inside-work-tree` exits zero.
4. Parse `git remote get-url origin` to extract the repo name (everything after the last `/`, stripping `.git`).
5. Confirm `superpowers:brainstorming` is available through the active runtime's skill mechanism. In Codex, use the available skills list and follow the relevant `SKILL.md`; in Claude Code, use the Skill tool.
6. Confirm the repo has `docs/functional/`. If not, abort with the missing functional-spec message above and include the `authoring-functional-spec` handoff context.

### Phase 1 - Resolve the canonical flow(s)

1. Use the supplied canonical ID(s), or ask if none provided. Treat the first as primary; resolve each additional ID through the same steps below.
2. Fetch the User-Flows-Details Sheet row for the primary canonical ID using the command patterns from `authoring-functional-spec/references/sheet-interop.md`. Extract column C (`repo`) as the primary repo.
3. Verify the current repo from Phase 0 matches the Sheet repo. If they differ, abort:

   > You are in `<current-repo>` but flow `<id>` targets `<sheet-repo>`. Re-run this skill from the correct repo so the design doc lands beside the functional spec.

4. For each canonical ID, check `docs/functional/<canonical-id>/README.md`.
5. If not found, search `docs/functional/**/*.md` for frontmatter `id: <canonical-id>`.
6. Read each matching functional spec. For each, extract:
   - title and persona
   - goal, scope, trigger, inputs, outputs, success outcome
   - main flow or phases
   - alternate flows, failure cases, state transitions
   - business rules, invariants, events / observability
   - open questions
7. If design discovery shows the functional spec itself is stale, incomplete, or contradicted by the intended design, present the proposed functional-spec change to the author and ask for explicit confirmation before editing it. When confirmed, modify the existing canonical functional spec in place in the same Sheet repo; do not create a second functional spec for the flow. If not confirmed, keep the design spec aligned to the current functional spec and record the unresolved product question instead of silently changing behavior.

### Phase 2 - Find related design specs

Read `docs/design/README.md` when present, then search `docs/design/` for:

- the canonical flow ID (including in `functional-specs` frontmatter tags)
- the flow title
- named production artifacts cited by the functional spec
- sibling canonical IDs referenced in the functional spec
- important behavioral nouns from the flow's goal, outputs, failures, and invariants

When a design doc already carries the canonical ID in its `functional-specs` tag, treat it as a direct candidate for update rather than a new file.

Read only related design specs. Build a short internal coverage map:

- **covered** - behavior already addressed by an existing design spec.
- **partial** - behavior mentioned but missing design decisions or source anchors.
- **missing** - behavior with no design coverage.
- **conflicting** - design text that contradicts the functional spec.

### Phase 3 - Propose the design-spec gap

Before drafting, present the gap analysis to the author:

- canonical flow ID(s) and functional-spec path(s) this design doc will tag
- related design specs read
- any functional-spec changes that need explicit author confirmation before editing the canonical functional spec in place
- proposed target path under `docs/design/`
- proposed `functional-specs` tag list for the design doc frontmatter
- what should be covered or changed
- what should stay out because it belongs in the functional spec or implementation plan

If no meaningful design gap exists, say so and stop without writing a new spec.

### Phase 4 - Hand off to `superpowers:brainstorming`

Invoke `superpowers:brainstorming` through the active runtime's skill mechanism with this context:

> We are authoring a design spec under `docs/design/` covering canonical flow(s) `<canonical-id-list>`. Functional spec(s): `<functional-spec-paths>` — behavioral source(s) of truth. Related design specs read: `<paths>`. Gap analysis: `<covered/partial/missing/conflicting summary>`. Keep the design spec one level below the functional spec and above the implementation plan. Pressure-test the proposed design coverage, ask one question at a time, and keep implementation task sequencing for `superpowers:writing-plans`.

Wait for brainstorming to produce an approved design direction before drafting.

### Phase 5 - Draft or update the design spec

Write to the approved target path under `docs/design/` in the primary repo from the Sheet. Prefer `docs/design/<topic>/README.md` for durable topics; use a sub-document only when an existing design directory already owns the topic.

Use this structure unless the repo has a stricter local template:

```markdown
---
functional-specs: [<canonical-id>, ...]
---

# <Design Topic>

> **Status:** Draft
> **Functional specs:** [`<canonical-id>`](../../functional/<canonical-id>/README.md), ...

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
2. **Gap-oriented**: Do not create a new design spec when an existing one already covers the flow. Update the existing spec instead.
3. **Design altitude**: Include design decisions, state, schemas, interfaces, data flow, and source anchors. Exclude behavior-source-of-truth content and implementation task sequencing.
4. **Functional spec stewardship**: If design work reveals a needed product-flow correction, confirm with the author first, then edit the existing canonical functional spec in place. Never create an alternate functional spec for the same canonical flow.
5. **Traceability**: Tag every canonical flow ID this design doc covers in the `functional-specs` frontmatter list and link to each functional spec in the header. Link to related design specs in the relationship table.
6. **Decisions over descriptions**: State the decision and rationale.
7. **Present tense**: Describe the current intended design, not history.
8. **Source file references**: Include accurate source files when code already exists in the primary repo. If code does not exist, state that in the source-files section instead of inventing paths. Cite another repo only when the user explicitly identifies it as secondary helper code for the flow.

## Self-review

Before writing or claiming completion, check:

- All canonical functional specs this design doc covers exist, are listed in the `functional-specs` frontmatter tag, and are linked in the header.
- The current repo matches the Sheet repo for the canonical flow.
- Related design specs were searched and read when relevant.
- The spec explicitly covers a gap, partial coverage, or conflict.
- No unresolved product-flow question is hidden in design text.
- Any functional-spec change discovered during design was explicitly confirmed by the author and applied to the existing canonical functional spec in place, or left as an unresolved product question.
- Implementation plan tasks are absent.
- `docs/design/README.md` is updated when it exists.
- `doc-skills:writing-clearly-and-concisely` is applied to tighten prose before showing the draft.
- `superpowers:verification-before-completion` is invoked before completion when available.

## Output

After writing, summarize:

- canonical flow ID(s) tagged and functional-spec path(s)
- design spec path
- related design specs read
- functional spec updates made after author confirmation, or product-flow questions left unresolved
- coverage added or changed
- open questions remaining
- whether `docs/design/README.md` was updated
