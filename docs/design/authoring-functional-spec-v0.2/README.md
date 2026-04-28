# Authoring Functional Specs v0.2

> **Status:** As built
> **Linear:** AD-26
> **Implemented in:** `skills/authoring-functional-spec/`

## Problem

The v0.1 skill treated every functional spec like a user journey. That made service, surface, install, skill, and utility specs harder to write because the template pushed authors toward irrelevant journey sections.

The old flow also used a hardcoded repo list. That list drifted from the User-Flows-Details Sheet.

## As-Built Design

The v0.2 skill keeps one functional-spec workflow, but lets each spec choose the shape that fits the subject.

Every new spec declares:

```yaml
---
id: <canonical-id>
title: <title>
shape: <journey | surface | service | skill | install | utility>
persona: <DRE | FSA | CDO | CloudOps>
---
```

Optional frontmatter is allowed only when it applies:

- `parent`
- `sub-flows`
- `renamed-from`
- `absorbs`

Specs do not carry review dates, document versions, or commit SHAs in frontmatter. Git already records review history and provenance through commits, tags, and SHAs.

## Shapes

| Shape | Use For |
| --- | --- |
| `journey` | Actor-led workflows with a beginning, progression, and terminal outcome. |
| `surface` | Screens, panels, widgets, dashboards, and other user-facing surfaces. |
| `service` | Backend services, modules, subsystems, and continuously available capabilities. |
| `skill` | Agent skills, slash commands, and agent-facing workflow contracts. |
| `install` | Installation, bootstrap, setup, and operator-run configuration procedures. |
| `utility` | CLI tools, libraries, helpers, and separately shipped utilities. |

Shape menus live in `skills/authoring-functional-spec/references/shape-lenses.md`. The menus give section ideas; they are not checklists.

## Spec Body

The shared sections are:

- `Goal`
- `Inputs`
- `Outputs`
- `Invariants`
- `Cross-refs`

The author includes a shared section only when it applies. There are no `N/A`, `TBD`, or placeholder sections.

The rest of the body comes from the selected shape menu. Section names can vary when clearer wording fits the spec.

## Persona Rule

`persona` is single-valued. Pick the persona whose work or outcome is most directly affected.

- `DRE` — data reliability or operations owner.
- `FSA` — field solution or implementation owner. AE and DE roll up here.
- `CDO` — business or governance owner.
- `CloudOps` — platform, deployment, install, or operations owner.

Existing older specs may still use older persona values. This change does not migrate them.

## Repo and Sheet Rules

The User-Flows-Details Sheet remains the source for:

- canonical ID
- target repo
- category
- title
- persona

The skill reads the allowed target repos from Sheet column C at runtime. It no longer hardcodes repo names.

The skill never writes to the Sheet and never reads Sheet status as spec content.

## Authoring Flow

1. Check `gws`, auth, git checkout, and the Sheet-derived repo list.
2. Resolve the canonical ID and Sheet row.
3. Verify the current repo matches the Sheet target repo.
4. Reuse the existing spec file when it exists.
5. Gather references before drafting.
6. Choose `shape` and `persona`.
7. Read `shape-lenses.md` and use the matching shape section.
8. State the tentative behavior and assumptions before asking the first question.
9. Ask one question at a time until behavior is clear.
10. Draft directly, without placeholder scaffolds.
11. Review for scope, altitude, coherence, frontmatter, and unresolved questions.
12. Offer a local commit. Do not push.

## Boundaries

The skill writes functional specs only under `docs/functional/`.

It does not create:

- design specs
- implementation plans
- user guides
- prompt-writing outputs

Implementation-plan requests based on a functional spec route to `superpowers:writing-plans`.

## Files Changed

- `skills/authoring-functional-spec/SKILL.md`
- `skills/authoring-functional-spec/references/functional-spec-template.md`
- `skills/authoring-functional-spec/references/writing-the-draft.md`
- `skills/authoring-functional-spec/references/sheet-interop.md`
- `skills/authoring-functional-spec/references/shape-lenses.md`
- `tests/evals/packages/authoring-functional-spec/skill-authoring-functional-spec.yaml`
- `tests/evals/prompts/skill-authoring-functional-spec.txt`
- `tests/evals/assertions/check-authoring-functional-spec-contract.js`
