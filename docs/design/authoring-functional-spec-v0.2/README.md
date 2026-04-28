# Functional Spec Skill v0.2 Design — 2026-04-28

> **Status:** Draft

Design-time companion to the v0.2 implementation of `authoring-functional-spec` (path: `skills/authoring-functional-spec/`). Once v0.2 lands, `skills/authoring-functional-spec/references/functional-spec-template-rationalization.md` will be updated to incorporate the new structure and this file becomes historical.

## Motivation

The v0.1 template was designed for one shape: an actor-initiated, sheet-anchored user-flow journey. In practice, Vibedata authors will write functional specs across many shapes — UI surfaces, backend services, agent skills, install procedures, separately-shipped utilities. The v0.1 template fails them in three ways:

- **Density.** The rigid section list forces every spec into ~12 sections regardless of subject. Authors fill `[describe …]` placeholders for sections that don't apply, then strip them in self-review. The cleanup step is the ceremony cost.
- **Wrong shape.** Mandatory `Trigger`, `Primary actor`, and `Main flow` assume an actor-initiated, sequenced flow. A backend service is continuous; a UI surface is reactive; a CLI utility is invoked but not "triggered" in the user-flow sense.
- **Hardcoded repo allowlist.** Phase 0 hardcodes `{studio, skill-builder, domain-cicd, migration-utility}`. Already two repos out of date.

In Vibedata terminology, all six shapes are **user flows** — every one gets a row in the User-Flows-Details Sheet. The v0.2 design treats shape as a **content profile** chosen at authoring time, not a question of whether the subject is a user flow.

## Design goals

1. One template that supports six shapes without forcing structure onto subjects that don't fit.
2. Coding agents draft a spec in one pass — no placeholder scaffold step.
3. Templates are menus, not contracts. Authors pick what fits.
4. Brainstorming runs **before** drafting so assumption-based gaps don't get committed to prose.
5. The skill body in `SKILL.md` shrinks to under 100 lines (today: ~315), with mechanics pushed to references.

## Decisions

### D1. Shape enum (new frontmatter field)

Every spec frontmatter has a `shape:` field. Values: `journey | surface | service | skill | install | utility`.

| Shape | Subject |
|---|---|
| `journey` | Actor-initiated user workflow. Today's default. |
| `surface` | A UI screen, panel, widget, or dashboard. |
| `service` | A backend service, module, or subsystem. |
| `skill` | An agent skill or slash command. |
| `install` | An installation / setup procedure. |
| `utility` | A separately-shipped CLI tool or library. |

Shape lives only in the spec file. The Sheet has no shape column and the skill does not validate shape against any Sheet field.

### D2. Mandated frontmatter fields

`id`, `title`, `shape`, `persona`, plus the existing `last-reviewed` and optional `parent` / `sub-flows` / `renamed-from` / `absorbs`.

The skill refuses to proceed without the four mandated fields. Everything else in the frontmatter is optional.

### D3. Persona enum (consolidated)

`DRE | FSA | CDO | CloudOps`. Single-valued — exactly one persona per spec. AE and DE roll up into FSA. MST rolls up into DRE. Pre-existing values in archived specs (`AE`, `DE`, `MST`) need no migration; they simply do not appear in new specs.

**Selection rule:** *the persona whose work or outcome is most directly affected by this spec's behavior — i.e., who owns the success outcome.* Across shapes:

- journey: who initiates and benefits
- surface: who uses the surface
- service: who consumes the service (often another flow's runtime)
- skill: who invokes the skill
- install: the operator running the procedure
- utility: the audience class the utility ships to

### D4. Body sections — expected when applicable

Five sections are expected in nearly every spec because they apply nearly everywhere:

- **Goal**
- **Inputs**
- **Outputs**
- **Invariants**
- **Cross-refs**

If a section genuinely doesn't apply to the subject (e.g., a UI surface with no upstream inputs), the author **omits** it. No `N/A` or `TBD` placeholders. Their absence reads as "not applicable" — there is no checklist that fails because a section is missing.

### D5. Other body sections — fluid menu per shape

Beyond the five expected sections, each shape has a suggestion menu. The menus live in `references/lens-<shape>.md`. Authors pick what fits the subject. There is no enforced section vocabulary — section names in the body are author-chosen.

Starting menus per shape (to be pruned by real specs over time):

**journey** — Trigger, Primary actor, Main flow / Phases, Alternate flows (A1, A2 …), Failure cases (F1, F2 …), State transitions, Business rules, Events / observability (kind-level)

**surface** — When-to-use, Surface inventory, Surface states, Interaction model, Cross-flow touch matrix, Access & responsiveness

**service** — Goals + Non-goals, Boundary contract, Lifecycle, Ownership, Consumers, Concurrency / ordering invariants, Risks & mitigations, Failure modes by class

**skill** — Invocation triggers, Phases, Refusal & scope rails, Handoffs, Runtime context contract, Resources used

**install** — Preconditions, Procedure, Verification, Rollback / recovery, Idempotency guarantees, Failure classes

**utility** — Public surface, Distribution kind, Audience class, Lifecycle, Exit conditions, Versioning & compatibility stance

### D6. Altitude rule kept

Every paragraph passes the test: *"Could a competent engineer using an agentic coding tool build this differently from what I'm describing, and still be correct?"* If no, cut the prescriptive detail.

This is the single load-bearing authoring rule. Without it, "functional spec" becomes indistinguishable from "design doc" or "implementation note."

The three legitimate-cite exception classes (existing production artifacts, canonical sibling flow IDs, already-cited prior-version artifacts) carry over from v0.1.

### D7. Lean 8-phase skill flow

| # | Phase |
|---|---|
| 0 | Preflight — gws auth, git tree, **runtime-resolved repo allowlist from Sheet column C** (see D10) |
| 1 | Identify canonical ID |
| 2 | Fetch Sheet row + verify repo alignment |
| 3 | Check for existing spec — create vs in-place update |
| 4 | Gather references — repo functional specs auto, repo code auto, internal sources (Linear / Granola / Docs) user-provided only |
| 5 | Brainstorm / grill — BEFORE drafting; inlined into this skill, not handed off (see D8) |
| 6 | Agent drafts the spec directly — no placeholder scaffold |
| 7 | Substantive spec review + commit (see D9) |

Down from v0.1's 10 phases. Phase boundaries are **porous**: the agent keeps discovering related material (more code, sibling specs, public best-practice sources) throughout phases 5–7 as questions surface.

### D8. Brainstorming inlined, not handed off

`superpowers:brainstorming` has its own terminal state — write a design doc to `docs/superpowers/specs/` and invoke `writing-plans`. That conflicts with our flow, which writes a functional spec to `docs/functional/<canonical-id>/` and never invokes writing-plans.

Rather than handing off and fighting that terminal state, the v0.2 SKILL.md inlines the brainstorming discipline directly:

- Ask one question at a time. Multiple-choice preferred.
- Propose 2–3 approaches with trade-offs and recommendation when the design has legitimate paths.
- YAGNI ruthlessly.
- Follow existing patterns; don't propose unrelated refactoring.
- Validate incrementally — get user approval section-by-section.
- Apply this even to "simple" specs.

On top of that base, Phase 5 layers Vibedata-specific overlays:

- Altitude rule applies to every framing question.
- Shape lens determines which menu is in play.
- Persona-owns-success rule.
- Sibling-flow alignment — read other specs in `docs/functional/` and surface conflicts.
- Public-web research allowed for best-practice grounding on the subject domain (internal sources — Linear / Granola / Google Docs — stay user-provided).
- Agent enumerates its tentative behavioral model and assumptions explicitly **before** asking the first question, so the author can challenge the framing.

The point of putting brainstorming before drafting is gap prevention: assumption-based gaps caught here never reach the prose.

### D9. Substantive Phase 7 review

Not a high-level smell check. The agent walks each pass and edits inline:

- **Altitude** on every paragraph.
- **Internal coherence** — no contradictions across sections (Goal vs Outputs, Inputs vs Cross-refs, Failure outcomes vs Invariants).
- **Scope match** — body matches what was agreed in Phase 5.
- **Cross-flow alignment** — no conflict with sibling functional specs in `docs/functional/`.
- **Frontmatter consistency** — shape matches body, persona matches who owns success.
- **Completeness** — every Input has a consumption explanation, every Output has a producer, every Invariant is testable in principle.
- **Open Questions cleanup** — behavioral OQs from Phase 5 are resolved; design-tagged OQs stay.

Then offer commit. No `git push`.

### D10. Bug fix — de-hardcode target-repo whitelist

v0.1 Phase 0 hardcodes `{studio, skill-builder, domain-cicd, migration-utility}`. Already two repos out of date.

v0.2 resolves the legitimate target-repo set at runtime from User-Flows-Details Sheet column C (`gws sheets spreadsheets values get`). Cached once per invocation, reused for Phase 2 alignment, case-folded + trimmed compare.

## Out of scope

- **Migration of existing v0.1 specs.** They stay in their current shape. Only new specs use v0.2.
- **Sheet column for shape.** Not added. Shape lives spec-side only.
- **Visual Companion** (from `superpowers:brainstorming`). Skipped — overkill for spec authoring.
- **Formal `superpowers:brainstorming` handoff.** Skipped — conflicts with our terminal state.

## Deferred / open

- The first real spec authored under each non-journey shape will likely prune or extend its lens menu. Treat the starting menus in D5 as v0.2-shipped guesses, not final.
- The brainstorming-skill self-review (placeholders, consistency, ambiguity, scope) overlaps in spirit with Phase 7 review. v0.2 rolls its own to add altitude + cross-flow alignment. Revisit in v0.3 if gaps surface.
- Whether `category` (Sheet column D) and `shape` should ever cross-validate is deferred until enough non-journey specs exist to evaluate.

## Implementation plan

1. Land this design doc; HB approves.
2. Implement:
   - Rewrite `SKILL.md` to the lean 8-phase shape (target: under 100 lines).
   - Add `references/lens-<shape>.md` for each of the six shapes.
   - Update `references/functional-spec-template.md` to reflect mandated frontmatter, the five expected body sections, the altitude rule, and the lens-menu pointer.
   - Update `references/functional-spec-template-rationalization.md` with a v0.2 addendum or replacement.
   - Update `references/writing-the-draft.md` if altitude phrasing shifts.
   - Fix Phase 0 repo-allowlist resolution against Sheet column C.
3. Add focused promptfoo evals: the de-hardcoded repo allowlist, the brainstorm-before-draft flow, frontmatter validation (id / title / shape / persona present and well-formed).
4. Run existing evals; fix regressions.
5. Bump `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json` versions; run `python3 scripts/validate_plugin_manifests.py`.
6. Commit + open PR.
