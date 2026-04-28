---
name: authoring-functional-spec
description: Use when authoring or updating top-level Vibedata functional, behavior, journey, PRD-adjacent, or product-requirements specs that belong under docs/functional and must stay above design or implementation detail
version: 0.2.0
---

# Authoring a Vibedata Functional Spec

## Contract

Author the source-of-truth, product-level functional spec for one canonical User-Flows-Details Sheet row. One canonical user flow maps to exactly one functional spec. One functional spec may be supported by many design docs. The User-Flows-Details Sheet repo column is the primary repo for the flow. The functional spec must live in that primary repo. Code grounding is expected to come from the primary repo; read secondary helper code only when the user explicitly identifies another repo as supporting context.

This skill is not for design specs, implementation plans, End-user help pages, or AI prompt-writing requests. For implementation-plan requests based on a functional spec, route to `superpowers:writing-plans` and hand over the canonical flow ID, functional-spec path, open questions, relevant design docs or source files already identified, and implementation constraints the user gave.

## Phase 0 — Preflight

1. Verify `gws` exists and `gws auth status` exits zero; otherwise abort with
   `Run gws auth login first, then retry.`
2. Verify the current directory is inside a git checkout.
3. Resolve the current repo from `git remote get-url origin`.
4. Read the allowed target repo names at runtime from User-Flows-Details Sheet column C using `references/sheet-interop.md`. Case-fold and trim names; never use a hardcoded repo allowlist. Abort outside allowed repos with the Sheet-derived repo names.
5. Confirm `superpowers:verification-before-completion` is available before final completion claims.

## Phase 1 — Identify the Canonical ID

Use the invocation ID if present. Otherwise ask which canonical ID to author. If the author cannot name it, use `references/sheet-interop.md` to list candidate IDs for the current repo, filtered by the runtime-resolved Sheet repo list.

## Phase 2 — Fetch Sheet Row

Fetch the row for column B canonical ID. Extract only B canonical ID, C repo, D category, E title, and K persona. Do NOT read column H. Do not write to the Sheet. If no exact row exists, attempt longest-prefix child-flow inference against column B. If no parent prefix matches, abort and ask the user to add or correct the Sheet row.

## Phase 3 — Verify Repo and Existing Spec

Compare current repo to Sheet column C for a parent/standalone or to the parent's repo for a child. Abort on mismatch. Target paths are `docs/functional/<canonical-id>/README.md` for standalone/parent specs and `docs/functional/<parent-id>/NN-<child-slug>.md` for child specs. Child specs require the parent README and sub-flow listing. If the target exists, update that file in place; do not create a sibling, alternate, or duplicate functional spec.

## Phase 4 — Gather References

Ask for reference material before drafting. Read primary-repo functional specs and relevant code automatically once discovered. Use public web research when best-practice grounding would clarify the subject domain. Linear, Granola, Google Docs, Google Sheets, and cross-repo code are user-provided only. Digest behavioral signals only; avoid verbatim copying. Cite code only to ground behavioral claims. Stable production artifacts and sibling flow IDs may be named for traceability; design-phase names stay out of the functional body.

## Phase 5 — Shape and Brainstorm

Set frontmatter `shape:` to one of `journey | surface | service | skill | install | utility`. Set `persona:` to one of `DRE | FSA | CDO | CloudOps`, choosing the persona whose work or outcome is most directly affected. Load `references/shape-lenses.md` and use the matching shape section.

Before drafting, enumerate the tentative behavioral model and assumptions, then brainstorm in this skill: ask one question at a time, prefer multiple choice when real alternatives exist, apply the altitude rule, align with sibling specs, and resolve behavioral gaps before they enter prose. Do not hand off to `superpowers:brainstorming`.

## Phase 6 — Draft Directly

Load `references/functional-spec-template.md` and `references/writing-the-draft.md`. Emit frontmatter with required fields `id`, `title`, `shape`, and `persona`, plus optional `parent`, `sub-flows`, `renamed-from`, and `absorbs` only when applicable. Do not add date, review-date, version, or SHA frontmatter; review history and provenance come from git commits, tags, and SHAs. Draft directly; do not emit placeholder scaffolds. Include `Goal`, `Inputs`, `Outputs`, `Invariants`, and `Cross-refs` when applicable, then choose sections from the matching shape menu. Omit sections that genuinely do not apply.

## Phase 7 — Substantive Review and Commit Offer

Review and edit inline for altitude, internal coherence, scope match, cross-flow alignment, frontmatter consistency, completeness, and Open Questions cleanup. Refuse event names, payload schemas, label strings, UI details, file paths, class names, API shapes, and implementation plans. Use `superpowers:verification-before-completion` before claiming completion. Summarize the canonical ID, target path, sections populated, and remaining Open Questions. Offer a local commit with `git add <path>` and `git commit -m "docs(functional): author functional spec for <canonical-id>"`. Never run `git push`.

## References

- `references/functional-spec-template.md` — v0.2 frontmatter and section menu.
- `references/sheet-interop.md` — read-only `gws` commands, including column-C repo resolution.
- `references/writing-the-draft.md` — altitude rule and cite boundaries.
- `references/shape-lenses.md` — shape menus.
