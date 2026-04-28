---
name: authoring-functional-spec
description: Use when creating or updating a functional spec for a user flow listed in column B of the User-Flows-Details Sheet
version: 0.3.0
---

# Authoring a Vibedata Functional Spec

## Contract

Author the source-of-truth functional spec for one canonical User-Flows-Details Sheet row. One canonical user flow maps to exactly one functional spec — refuse to create a second spec for a canonical ID that already has one. Design docs are downstream; do not conflate them with the functional spec. The spec must live in the repo identified by Sheet column C. Code grounding comes from that repo; read code from other repos only when the user explicitly identifies them as supporting context.

This skill is not for design specs, implementation plans, end-user help pages, or AI prompt-writing requests. For implementation-plan requests, hand the user the canonical ID and spec path — what happens next is the user's decision.

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

## Phase 0 — Preflight

1. Verify `gws` exists and `gws auth status` exits zero; otherwise abort with
   `Run gws auth login first, then retry.`
2. Verify the current directory is inside a git checkout.
3. Resolve the current repo from `git remote get-url origin`.
4. Read the allowed target repo names at runtime from User-Flows-Details Sheet column C using `references/sheet-interop.md`. Case-fold and trim names; never use a hardcoded repo allowlist. Abort with an error listing the Sheet-derived repo names if the current repo is not in the allowed list.
5. Confirm `superpowers:verification-before-completion` is available before final completion claims. If unavailable, re-read the draft against all required fields manually before claiming completion.

## Phase 1 — Identify the Canonical ID

Use the canonical ID present in the user's message if one is given. Otherwise ask which canonical ID to author. If the author cannot name it, use `references/sheet-interop.md` to list candidate IDs for the current repo, filtered by the runtime-resolved Sheet repo list.

## Phase 2 — Fetch Sheet Row

Fetch the row for the column B canonical ID. Extract only B canonical ID, C repo, D category, E title, and K persona. Do NOT read column H (Status — managed by Sheet owners, not this skill). Do not write to the Sheet. If no exact row matches, abort and ask the user to add or correct the Sheet row.

## Phase 3 — Verify Repo and Existing Spec

Compare the current repo to Sheet column C. Abort with an error if they do not match. The target path is `docs/functional/<canonical-id>/README.md`. If the target exists, update it in place — do not create a sibling, alternate, or duplicate spec. If it does not exist, create it.

## Phase 4 — Gather References

If reference material has not already been provided by the user, ask before drafting. Read primary-repo functional specs and relevant code automatically once discovered. Use public web research for best-practice grounding when the subject domain has established external standards the user hasn't provided. Meeting notes, project management data, and documents in external services are user-provided only. Digest behavioral signals only; avoid verbatim copying. Cite code only to ground behavioral claims. Stable production artifacts and sibling flow IDs may be named for traceability; design-phase names stay out of the functional body.

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

## Phase 6 — Draft Directly

Read `references/functional-spec-template.md` and `references/writing-the-draft.md`. Use `doc-skills:writing-clearly-and-concisely` if available. Emit frontmatter with required fields `id`, `title`, `shape`, and `persona`, plus optional `renamed-from` and `absorbs` only when applicable. Do not add date, review-date, version, or SHA frontmatter; review history and provenance come from git commits, tags, and SHAs. Draft directly; do not emit placeholder scaffolds. Include `Goal`, `Inputs`, `Outputs`, `Invariants`, and `Cross-refs` when applicable, then choose sections from the matching shape menu. Omit sections that genuinely do not apply.

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

## References

- `references/functional-spec-template.md` — frontmatter schema and expected section list.
- `references/sheet-interop.md` — read-only `gws` commands, including column-C repo resolution.
- `references/writing-the-draft.md` — altitude rule and cite boundaries.
- `references/shape-lenses.md` — shape menus.
