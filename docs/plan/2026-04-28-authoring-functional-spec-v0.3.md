# authoring-functional-spec v0.3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the v0.3 design for `authoring-functional-spec`: fix 12 ambiguity/explaining/over-fit issues, remove the subflow concept, add a phase checklist, expand Phase 5 brainstorm discipline, and add behavioral-summary and user-approval gates.

**Architecture:** Two files change — `SKILL.md` (all phase content) and `references/functional-spec-template.md` (scoped to frontmatter schema + expected section list only). Three reference files are untouched. Tasks are grouped by file and phase locality; each task ends with a commit.

**Design doc:** `docs/design/authoring-functional-spec-v0.3/README.md`
**Linear issue:** AD-28

---

## File Map

| File | Change |
|---|---|
| `skills/authoring-functional-spec/SKILL.md` | Edit — description, contract, checklist, phases 0–7 |
| `skills/authoring-functional-spec/references/functional-spec-template.md` | Edit — remove altitude block, Drafting Process, shape menus, child layout, parent/sub-flows |
| `skills/authoring-functional-spec/references/writing-the-draft.md` | No change |
| `skills/authoring-functional-spec/references/shape-lenses.md` | No change |
| `skills/authoring-functional-spec/references/sheet-interop.md` | No change |

---

## Task 1: SKILL.md — Description, Contract, and Checklist

**Files:**
- Modify: `skills/authoring-functional-spec/SKILL.md` (frontmatter + Contract section + new Checklist section)

- [ ] **Step 1: Update the frontmatter description**

Replace the current `description:` line:

```yaml
description: Use when authoring or updating top-level Vibedata functional, behavior, journey, PRD-adjacent, or product-requirements specs that belong under docs/functional and must stay above design or implementation detail
```

With:

```yaml
description: Use when creating or updating a functional spec for a user flow listed in column B of the User-Flows-Details Sheet
```

- [ ] **Step 2: Rewrite the Contract section**

Replace the entire `## Contract` section body with:

```markdown
## Contract

Author the source-of-truth functional spec for one canonical User-Flows-Details Sheet row. One canonical user flow maps to exactly one functional spec — refuse to create a second spec for a canonical ID that already has one. Design docs are downstream; do not conflate them with the functional spec. The spec must live in the repo identified by Sheet column C. Code grounding comes from that repo; read code from other repos only when the user explicitly identifies them as supporting context.

This skill is not for design specs, implementation plans, end-user help pages, or AI prompt-writing requests. For implementation-plan requests, hand the user the canonical ID and spec path — what happens next is the user's decision.
```

- [ ] **Step 3: Add a Checklist section immediately after Contract**

Insert the following section between `## Contract` and `## Phase 0`:

```markdown
## Checklist

Create a task for each item and complete them in order:

- [ ] Phase 0 — Preflight (gws auth, repo check, allowed repos)
- [ ] Phase 1 — Canonical ID confirmed
- [ ] Phase 2 — Sheet row fetched
- [ ] Phase 3 — Repo verified, target path established
- [ ] Phase 4 — Reference material gathered
- [ ] Phase 5 — Shape, persona set; gaps resolved; behavioral summary written and user-approved
- [ ] Phase 6 — Draft written
- [ ] Phase 7 — Review complete; user-approved; spec committed
```

- [ ] **Step 4: Verify the changes**

Check that:
- Description no longer contains "top-level" or "PRD-adjacent"
- Contract has enforcement rules ("refuse to create a second spec", "do not conflate")
- Contract routing-out clause does not describe the writing-plans handoff in detail
- Checklist section appears between Contract and Phase 0 with 8 items

- [ ] **Step 5: Commit**

```bash
git add skills/authoring-functional-spec/SKILL.md
git commit -m "feat(authoring-functional-spec): update description, contract, and add checklist"
```

---

## Task 2: SKILL.md — Phases 0, 1, 2, 3

**Files:**
- Modify: `skills/authoring-functional-spec/SKILL.md` (Phase 0 through Phase 3)

- [ ] **Step 1: Update Phase 0, Step 4**

Replace:

```
4. Read the allowed target repo names at runtime from User-Flows-Details Sheet column C using `references/sheet-interop.md`. Case-fold and trim names; never use a hardcoded repo allowlist. Abort outside allowed repos with the Sheet-derived repo names.
```

With:

```
4. Read the allowed target repo names at runtime from User-Flows-Details Sheet column C using `references/sheet-interop.md`. Case-fold and trim names; never use a hardcoded repo allowlist. Abort with an error listing the Sheet-derived repo names if the current repo is not in the allowed list.
```

- [ ] **Step 2: Update Phase 0, Step 5**

Replace:

```
5. Confirm `superpowers:verification-before-completion` is available before final completion claims.
```

With:

```
5. Confirm `superpowers:verification-before-completion` is available before final completion claims. If unavailable, re-read the draft against all required fields manually before claiming completion.
```

- [ ] **Step 3: Update Phase 1**

Replace the entire Phase 1 body with:

```markdown
## Phase 1 — Identify the Canonical ID

Use the canonical ID present in the user's message if one is given. Otherwise ask which canonical ID to author. If the author cannot name it, use `references/sheet-interop.md` to list candidate IDs for the current repo, filtered by the runtime-resolved Sheet repo list.
```

- [ ] **Step 4: Rewrite Phase 2**

Replace the entire Phase 2 body with:

```markdown
## Phase 2 — Fetch Sheet Row

Fetch the row for the column B canonical ID. Extract only B canonical ID, C repo, D category, E title, and K persona. Do NOT read column H (Status — managed by Sheet owners, not this skill). Do not write to the Sheet. If no exact row matches, abort and ask the user to add or correct the Sheet row.
```

- [ ] **Step 5: Rewrite Phase 3**

Replace the entire Phase 3 body with:

```markdown
## Phase 3 — Verify Repo and Existing Spec

Compare the current repo to Sheet column C. Abort with an error if they do not match. The target path is `docs/functional/<canonical-id>/README.md`. If the target exists, update it in place — do not create a sibling, alternate, or duplicate spec. If it does not exist, create it.
```

- [ ] **Step 6: Verify the changes**

Check that:
- Phase 0 Step 4 abort message says "listing the Sheet-derived repo names"
- Phase 0 Step 5 has a fallback for unavailable verification skill
- Phase 1 uses "canonical ID present in the user's message" not "invocation ID"
- Phase 2 has column H rationale inline, no longest-prefix inference
- Phase 3 has one path only, no child spec paths, simple file-exists branch

- [ ] **Step 7: Commit**

```bash
git add skills/authoring-functional-spec/SKILL.md
git commit -m "feat(authoring-functional-spec): fix phases 0-3 ambiguity and remove child spec logic"
```

---

## Task 3: SKILL.md — Phases 4 and 5

**Files:**
- Modify: `skills/authoring-functional-spec/SKILL.md` (Phase 4 and Phase 5 — largest change)

- [ ] **Step 1: Rewrite Phase 4**

Replace the entire Phase 4 body with:

```markdown
## Phase 4 — Gather References

If reference material has not already been provided by the user, ask before drafting. Read primary-repo functional specs and relevant code automatically once discovered. Use public web research for best-practice grounding when the subject domain has established external standards the user hasn't provided. Meeting notes, project management data, and documents in external services are user-provided only. Digest behavioral signals only; avoid verbatim copying. Cite code only to ground behavioral claims. Stable production artifacts and sibling flow IDs may be named for traceability; design-phase names stay out of the functional body.
```

- [ ] **Step 2: Rewrite Phase 5**

Replace the entire Phase 5 body with:

```markdown
## Phase 5 — Shape and Brainstorm

Set frontmatter `shape:` to one of `journey | surface | service | skill | install | utility`. Set `persona:` to one of `DRE | FSA | CDO | CloudOps`, choosing the persona whose work or outcome is most directly affected. Read `references/shape-lenses.md` and use the matching shape section.

**Interaction rules:**
- Enumerate the tentative behavioral model before asking the first question
- Ask one question at a time
- Prefer multiple choice when the answer is not obvious from the subject alone
- Align with sibling specs before drafting
- Resolve all behavioral gaps before entering prose — do not carry gaps into the draft
- Brainstorm inline here — do not hand off to `superpowers:brainstorming`

**Key principles:**
- YAGNI: omit sections that genuinely do not apply — absence means not applicable, not a failed checklist
- Explore alternatives: when a behavioral gap has more than one valid resolution, present the options before choosing
- Incremental validation: confirm each major behavioral assumption before moving to the next
- Be flexible: if something does not make sense during the brainstorm, go back and clarify

**Spec clarity discipline:**
- Scope check first: if the request spans multiple canonical IDs, flag and decompose — one invocation = one canonical ID
- Break the spec into sections where each has one clear purpose and can be understood independently
- For each section, answer: what behavior does it describe, how does it connect to the flow, what does it depend on? If you cannot answer, the section boundary is wrong
- A section doing double duty signals a scope or altitude problem — split or cut
- The spec must be readable without implementation knowledge — if a sentence requires it, the altitude is wrong
- If a gap surfaces during review, return to Phase 5 — do not fill gaps with placeholder prose or assumptions

**Hard gate:** Do not proceed until every gap and ambiguity is resolved — no gaps enter the draft.

**Behavioral summary:** After all gaps are resolved, write a brief behavioral summary capturing:
- Agreed shape and persona
- Key behavioral assumptions confirmed during brainstorm
- Sections that will be included and why
- Open Questions remaining (tagged `[design]`)

Prompt: "Behavioral model agreed. Here's what I'll draft — let me know if anything needs adjusting before I write the spec." Wait for user approval before proceeding to Phase 6.
```

- [ ] **Step 3: Verify the changes**

Check that:
- Phase 4 uses "meeting notes and external documents" not "Granola"
- Phase 4 ask-for-refs is conditional ("if not already provided")
- Phase 5 has six interaction-rule bullets as a named block
- Phase 5 has three key-principles bullets
- Phase 5 has six spec-clarity-discipline bullets
- Phase 5 has a hard gate statement
- Phase 5 has a behavioral summary step with prompt and wait instruction
- Phase 5 does not mention `superpowers:brainstorming` as a handoff target

- [ ] **Step 4: Commit**

```bash
git add skills/authoring-functional-spec/SKILL.md
git commit -m "feat(authoring-functional-spec): rewrite phases 4-5 with brainstorm discipline and behavioral summary gate"
```

---

## Task 4: SKILL.md — Phases 6 and 7

**Files:**
- Modify: `skills/authoring-functional-spec/SKILL.md` (Phase 6 and Phase 7)

- [ ] **Step 1: Update Phase 6**

Replace the entire Phase 6 body with:

```markdown
## Phase 6 — Draft Directly

Read `references/functional-spec-template.md` and `references/writing-the-draft.md`. Use `doc-skills:writing-clearly-and-concisely` if available. Emit frontmatter with required fields `id`, `title`, `shape`, and `persona`, plus optional `renamed-from` and `absorbs` only when applicable. Do not add date, review-date, version, or SHA frontmatter; review history and provenance come from git commits, tags, and SHAs. Draft directly; do not emit placeholder scaffolds. Include `Goal`, `Inputs`, `Outputs`, `Invariants`, and `Cross-refs` when applicable, then choose sections from the matching shape menu. Omit sections that genuinely do not apply.
```

- [ ] **Step 2: Rewrite Phase 7**

Replace the entire Phase 7 body with:

```markdown
## Phase 7 — Review and User Approval

**Hard stops — fix before proceeding:**
Altitude violations, scope violations, repo mismatch. Use `superpowers:verification-before-completion` before claiming completion.

**Polish — clean up before showing to user:**
Open Questions cleanup, frontmatter consistency, completeness check.

**Self-review checklist:**
- Placeholder scan: any "TBD", "TODO", incomplete sections, or vague requirements? Fix them.
- Internal consistency: do any sections contradict each other?
- Scope check: is this spec focused on one canonical ID, or does it need decomposition?
- Ambiguity check: could any requirement be interpreted two ways? Pick one and make it explicit.
- Fix issues inline — no need to re-review after fixing.

Refuse event names, payload schemas, label strings, UI details, file paths, class names, API shapes, and implementation plans.

**User review gate:**
After self-review passes, show the draft to the user (do not commit yet). Prompt: "Spec ready for review at `<path>`. Let me know if you want any changes — I'll commit once you're happy."

Wait for user response. Do not commit until approved. If changes are requested, make them, re-run self-review, and re-prompt.

After approval, commit with:
- `git commit -m "docs(functional): author functional spec for <canonical-id>"` for new specs
- `git commit -m "docs(functional): update functional spec for <canonical-id>"` for existing specs

Never run `git push`. Summarize the canonical ID, target path, sections populated, and remaining Open Questions.
```

- [ ] **Step 3: Verify the changes**

Check that:
- Phase 6 uses "Read" not "Load"
- Phase 6 references `doc-skills:writing-clearly-and-concisely`
- Phase 6 optional frontmatter lists only `renamed-from` and `absorbs` (no `parent`, `sub-flows`)
- Phase 7 has hard-stops as a named tier separate from polish
- Phase 7 has a four-item self-review checklist
- Phase 7 has a user review gate with exact prompt text
- Phase 7 commit happens after user approval, not before
- Phase 7 has two commit verb variants (author / update)

- [ ] **Step 4: Commit**

```bash
git add skills/authoring-functional-spec/SKILL.md
git commit -m "feat(authoring-functional-spec): rewrite phases 6-7 with self-review checklist and user-approval gate"
```

---

## Task 5: functional-spec-template.md — Scope to Frontmatter Schema Only

**Files:**
- Modify: `skills/authoring-functional-spec/references/functional-spec-template.md`

- [ ] **Step 1: Replace the altitude test block with a pointer**

The `## Functional Spec Altitude` section currently contains a full altitude test paragraph. Replace the body of that section with a single pointer line:

```markdown
## Functional Spec Altitude

See `writing-the-draft.md` for the altitude test and discipline rules.
```

- [ ] **Step 2: Remove `parent` and `sub-flows` from optional frontmatter**

The optional frontmatter block currently reads:

```yaml
# Optional only when applicable:
# parent: <parent-id>
# sub-flows:
#   - <child-slug>
# renamed-from: <previous-id>
# absorbs:
#   - <prior-id>
```

Replace with:

```yaml
# Optional only when applicable:
# renamed-from: <previous-id>
# absorbs:
#   - <prior-id>
```

- [ ] **Step 3: Remove the detailed shape menu bullet list**

The `## Shape Menus` section currently has:
- A one-liner "Load `shape-lenses.md` and choose from the matching shape section."
- A "Starting menus are:" subheading with six shape bullets
- A closing note "Section names in the final body are author-chosen."

Replace the section with:

```markdown
## Shape Menus

Read `shape-lenses.md` and use the matching shape section. Section names in the final body are author-chosen; the menu is guidance, not an enforced vocabulary.
```

- [ ] **Step 4: Remove the child spec file layout**

The `## File Layout` section currently has two blocks: standalone path and child spec path. Replace with:

```markdown
## File Layout

All specs live at:

```text
docs/functional/<canonical-id>/README.md
```
```

- [ ] **Step 5: Remove the Drafting Process section**

Delete the entire `## Drafting Process` section (including the "Do not write to the Sheet" line). This content is covered by SKILL.md phases and sheet-interop.md.

- [ ] **Step 6: Verify the changes**

Check that:
- `## Functional Spec Altitude` body is one line pointing to `writing-the-draft.md`
- Optional frontmatter has only `renamed-from` and `absorbs`
- `## Shape Menus` has no bullet list — one-liner reference only
- `## File Layout` has one path only — no child path, no "Every child file requires..." sentence
- `## Drafting Process` section is gone entirely
- `## Expected Sections`, `## Labels, Tags, and Signal Names` are untouched

- [ ] **Step 7: Commit**

```bash
git add skills/authoring-functional-spec/references/functional-spec-template.md
git commit -m "feat(authoring-functional-spec): scope functional-spec-template to frontmatter schema only"
```

---

## Task 6: Final Validation

**Files:** None modified

- [ ] **Step 1: Run eval coverage check**

```bash
npm run eval:coverage
```

Expected: PASS — no new uncovered skills introduced.

- [ ] **Step 2: Run codex compatibility check**

```bash
npm run eval:codex-compatibility
```

Expected: PASS.

- [ ] **Step 3: Verify both files read cleanly end-to-end**

Read `skills/authoring-functional-spec/SKILL.md` from top to bottom and confirm:
- No "invocation ID" without definition
- No "Load" as a tool-call verb
- No "Granola"
- No child spec paths
- No longest-prefix inference
- Phase 5 hard gate is present
- Phase 7 commit is after user approval

Read `skills/authoring-functional-spec/references/functional-spec-template.md` end-to-end and confirm:
- No altitude test prose (only the pointer line)
- No `parent` or `sub-flows` in frontmatter
- No shape bullet lists
- No child file path
- No `## Drafting Process` section
