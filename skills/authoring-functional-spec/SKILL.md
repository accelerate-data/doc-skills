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
4. Read the allowed target repo names at runtime from User-Flows-Details Sheet column C using `references/using-gws.md`. Case-fold and trim names; never use a hardcoded repo allowlist. Abort with an error listing the Sheet-derived repo names if the current repo is not in the allowed list.
5. Availability check: confirm whether `superpowers:verification-before-completion` is reachable. If it is not available, substitute a manual re-read of all required frontmatter and section fields at Phase 7.

## Phase 1 — Identify the Canonical ID

Use the canonical ID present in the user's message if one is given. Otherwise ask which canonical ID to author. If the author cannot name it, use `references/using-gws.md` to list candidate IDs for the current repo, filtered by the runtime-resolved Sheet repo list.

## Phase 2 — Fetch Sheet Row

Fetch the row for the column B canonical ID. Extract only B canonical ID, C repo, D category, E title, and K persona. Do NOT read column H (Status — managed by Sheet owners, not this skill). Do not write to the Sheet. If no exact row matches, abort and ask the user to add or correct the Sheet row.

## Phase 3 — Verify Repo and Existing Spec

Compare the current repo to Sheet column C. Abort with an error if they do not match. The target path is `docs/functional/<canonical-id>/README.md`. If the target exists, update it in place — do not create a sibling, alternate, or duplicate spec. If it does not exist, create it.

Child pages may exist alongside the README (`docs/functional/<canonical-id>/<page>.md`) as author-managed supporting material — design context, UI detail, reference sketches that would lower the altitude of the main spec. This skill authors and reviews `README.md` only.

## Phase 4 — Gather References

- Read the current project state first (files, docs, recent commits)
- If reference material has not already been provided, ask before drafting
- Read primary-repo functional specs and relevant code automatically once discovered
- Use public web research when the domain has established external standards not yet provided by the user
- Meeting notes, project management data, and external-service documents are user-provided only
- Digest behavioral signals only; avoid verbatim copying
- Cite code only to ground behavioral claims
- Stable production artifact names and sibling flow IDs may appear for traceability; design-phase names stay out of the body

## Phase 5 — Shape and Brainstorm

Set `shape` and `persona` using the enums in `references/spec-template.md`. Read `references/shape-lenses.md` for the matching section menu. Apply discipline from `references/brainstorming.md`.

After resolving all gaps, write the behavioral summary (format in `references/brainstorming.md`) and prompt: "Behavioral model agreed. Here's what I'll draft — let me know if anything needs adjusting before I write the spec." Wait for user approval before proceeding to Phase 6.

## Phase 6 — Draft Directly

- Read `references/spec-template.md` and `references/altitude-discipline.md`; use `doc-skills:writing-clearly-and-concisely` if available
- Required frontmatter: `id`, `title`, `shape`, `persona`; add `renamed-from` / `absorbs` only when applicable
- No date, review-date, version, or SHA frontmatter — provenance comes from git commits, tags, SHAs
- Draft directly; no placeholder scaffolds
- Include `Goal`, `Inputs`, `Outputs`, `Invariants`, `Cross-refs` when applicable; choose remaining sections from the shape menu; omit what doesn't apply

## Phase 7 — Review and User Approval

Review per `references/reviewing.md`. Use `superpowers:verification-before-completion` before claiming completion. Refuse implementation-detail content — altitude test in `references/altitude-discipline.md`.

Show the draft (do not commit yet). Prompt: "Spec ready for review at `<path>`. Let me know if you want any changes — I'll commit once you're happy."

Do not commit until approved. If changes requested: revise → re-review → re-prompt.

After approval:
- New spec: `git commit -m "docs(functional): author functional spec for <canonical-id>"`
- Existing spec: `git commit -m "docs(functional): update functional spec for <canonical-id>"`

Never run `git push`. Summarize canonical ID, target path, sections populated, and remaining Open Questions.

## References

- `references/spec-template.md` — frontmatter schema and expected section list.
- `references/using-gws.md` — read-only `gws` commands, including column-C repo resolution.
- `references/brainstorming.md` — brainstorm rules, spec clarity, hard gate, behavioral summary format.
- `references/reviewing.md` — review tiers and self-review checklist.
- `references/altitude-discipline.md` — altitude rule and cite boundaries.
- `references/shape-lenses.md` — shape menus.
