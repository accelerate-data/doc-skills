# authoring-functional-spec v0.3 — Design

## Context

Review of the v0.2 skill (`skills/authoring-functional-spec/`) found 12 issues across two categories: contract ambiguity (6 high, 4 medium) and prose discipline (explaining + over-fit). This document captures the agreed v0.3 design and drives the implementation pass.

## Principles (applied to all changes)

- **Direct, don't narrate.** Every sentence constrains behavior or specifies an action. Background context is cut.
- **Name the fallback.** Any conditional step gets an explicit outcome — abort, warn-and-continue, or self-substitute.
- **One authoritative home per rule.** If a rule lives in a reference file, SKILL.md points to it and does not restate it.

---

## SKILL.md Changes

### Description

- Remove "top-level" — the skill handles any user flow from Sheet column B
- Remove "PRD-adjacent" — redundant alongside "functional"
- Trigger: "Use when creating or updating a functional spec for a user flow listed in column B of the User-Flows-Details Sheet"

### Add: Checklist section (after Contract, before phases)

Phase-based, ordered. Agent must create a task per item:

```
- [ ] Phase 0 — Preflight (gws auth, repo check, allowed repos)
- [ ] Phase 1 — Canonical ID confirmed
- [ ] Phase 2 — Sheet row fetched
- [ ] Phase 3 — Repo verified, target path established
- [ ] Phase 4 — Reference material gathered
- [ ] Phase 5 — Shape, persona set; brainstorm complete
- [ ] Phase 6 — Draft written
- [ ] Phase 7 — Review passed; commit offered
```

### Contract

- Convert background statements to enforcement rules:
  - "Refuse to create a second functional spec for a canonical ID that already has one"
  - "Design docs are downstream — do not conflate them with the functional spec"
- Strip handoff detail from routing-out clause — "hand the user the canonical ID and spec path, then invoke `superpowers:writing-plans`"

### Phase 0

- Step 4: "Abort with an error listing the Sheet-derived repo names" (was grammatically ambiguous)
- Step 5: Add fallback — "If `superpowers:verification-before-completion` is unavailable, re-read the draft against all required fields manually before claiming completion"

### Phase 1

- Define "invocation ID": "canonical ID present in the user's message"

### Phase 2

- Add inline rationale for column H: "Do NOT read column H (Status — managed by Sheet owners, not this skill)"
- Remove longest-prefix child-flow inference — if no exact row match, abort and ask user to fix the Sheet
- Ask-for-refs step: make conditional — "if reference material has not already been provided by the user"

### Phase 3

- Remove all child spec logic — one path only: `docs/functional/<canonical-id>/README.md`
- Repo check: current repo must match Sheet column C — abort on mismatch
- File exists → update in place; does not exist → create

### Phase 4

- Web research: remove built-in justification — "Use public web research for best-practice grounding when the subject domain has established external standards the user hasn't provided"
- "Granola" → "meeting notes and external documents" (source class, not tool name)
- Ask-for-refs: apply conditional from Phase 2 fix

### Phase 5

- "real alternatives" → "when the answer is not obvious from the subject alone"
- "brainstorm in this skill" → "brainstorm inline here — do not hand off to `superpowers:brainstorming`"

### Phase 6

- "Load" → "Read" (unambiguous tool action)

### Phase 7

- Split review into two tiers:
  - **Hard stops** (fix before proceeding): altitude violations, scope violations, repo mismatch
  - **Polish** (clean up before committing): Open Questions, frontmatter consistency
- Commit verb: "Use `author` for new specs, `update` for existing"

---

## Reference File Changes

### `functional-spec-template.md`

- Remove altitude test block (the "pause and ask" paragraph) — `writing-the-draft.md` is the authoritative source
- Add one-line pointer: "See `writing-the-draft.md` for the altitude test"
- Remove `parent` and `sub-flows` from optional frontmatter — users add what they need; skill does not enumerate
- Remove child spec file layout section — one path only

### `writing-the-draft.md`

- No changes — already the authoritative home for the altitude rule

### `shape-lenses.md`

- No changes

### `sheet-interop.md`

- No changes

---

## What Is Removed

### Subflow / child spec concept

Removed entirely. The skill authors one spec per canonical ID. How the user organises content within that doc (modules, phases, sub-sections) is up to them — the skill does not impose structure.

Removed from SKILL.md:
- Child spec file path (`docs/functional/<parent-id>/NN-<child-slug>.md`)
- Longest-prefix child-flow inference
- Child repo check logic

Removed from `functional-spec-template.md`:
- `parent`, `sub-flows` optional frontmatter fields
- Child file layout section

Note: `renamed-from` and `absorbs` frontmatter fields stay — they track canonical ID history, not subflow structure.

---

## Files Touched

| File | Change type |
|---|---|
| `skills/authoring-functional-spec/SKILL.md` | Edit — 11 targeted fixes + checklist + subflow removal |
| `skills/authoring-functional-spec/references/functional-spec-template.md` | Edit — altitude block → pointer; optional frontmatter simplified; child layout removed |
| `skills/authoring-functional-spec/references/writing-the-draft.md` | No change |
| `skills/authoring-functional-spec/references/shape-lenses.md` | No change |
| `skills/authoring-functional-spec/references/sheet-interop.md` | No change |
