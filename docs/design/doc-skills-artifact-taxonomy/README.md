# Doc Skills Artifact Taxonomy

> **Status:** Draft

## Overview

`doc-skills` owns reusable documentation-authoring skills for Claude Code and
Codex. The plugin should align around durable documentation artifacts:
functional specs, design specs, user guides, and AI prompt writing. Implementation plans are
not owned here because `superpowers:writing-plans` already provides that
workflow.

## Key Decisions

| Decision | Rationale |
|---|---|
| Copy `authoring-functional-spec` into this plugin | Functional-spec authoring is documentation-domain behavior and belongs beside other doc authoring skills. The original `engineering-skills` copy remains until it is removed separately. |
| Rename the legacy design-doc skill to `authoring-design-spec` | The design-spec skill is a collaborative authoring workflow, not a simple write operation. The name should match `authoring-functional-spec` and reflect that the artifact is the design layer below a functional spec. |
| Remove `skills/write-design-doc/` | The legacy design-doc path is removed completely. Public routing now points to `authoring-design-spec`. |
| Require a canonical functional spec before design-spec authoring | Design specs are the next layer below functional specs. A design spec without its source flow risks becoming a product-flow substitute. |
| Make design specs gap-oriented | The design-spec skill should read the canonical flow, inspect related design specs in the same repo, identify coverage gaps or conflicts, and propose what should be covered or changed before drafting. |
| Keep user guides separate | User guides are end-user, screen-level help pages with exact UI labels and VitePress/help-link concerns. They should not inherit the flow/design brainstorming wrapper. |
| Route implementation plans to `superpowers:writing-plans` | There is no added value in duplicating implementation-plan scaffolding in this plugin. |
| Require Claude Code and Codex compatibility | Skills must avoid Claude-only tool calls in shared instructions and describe runtime-specific skill/file/web access only where needed. |
| Copy the eval framework from `engineering-skills` | The Promptfoo/OpenCode harness, JSON assertion helper, provider wrapper, coverage gate, and prompt runner are reusable infrastructure this plugin should not reinvent. |
| Copy the `authoring-functional-spec` eval package | The functional-spec workflow is being copied, so its existing behavioral contract eval should move with it unchanged except for package metadata paths. |
| Add an `authoring-design-spec` eval package | The new design-spec wrapper has its own contract: require a canonical flow, abort when missing, inspect related design docs, propose gap coverage, use brainstorming, and route implementation plans away. |

## Artifact Boundaries

| Artifact | Owning skill | Path | Required upstream |
|---|---|---|---|
| Functional / behavior spec | `authoring-functional-spec` | `docs/functional/<canonical-id>/README.md` or child file | User-Flows-Details Sheet row or parent inference |
| Design spec | `authoring-design-spec` | `docs/design/<topic>/README.md` or existing design subdoc | Existing canonical functional spec |
| Implementation plan | `superpowers:writing-plans` | `docs/plan/<date>-<topic>.md` | Approved design spec when implementation is requested |
| User guide | `write-user-guide` | `docs/user-guide/**/*.md` | Existing UI/source behavior |
| AI prompt | `writing-ai-prompts` | Chat output | Target AI tool |

## Flow-Spec Authoring

The copied `authoring-functional-spec` skill remains the source for behavior-level
docs. Its key requirements stay intact:

- validate the current repo and canonical flow identity
- fetch the User-Flows-Details Sheet row through `gws`
- write only to `docs/functional/`
- keep behavior above design and implementation detail
- use `superpowers:brainstorming` to close behavioral questions
- self-review for placeholders, contradictions, altitude violations, and
  unresolved product questions

The copied skill must be runtime-neutral. It can mention Claude Code and Codex
mechanisms, but shared workflow steps cannot require Claude-only tool names.

## Design-Doc Authoring

`authoring-design-spec` is the design layer below a canonical flow.

The skill must:

1. Ask for the canonical flow ID when it is not provided.
2. Resolve and read the matching functional spec under `docs/functional/`.
3. Abort if the functional spec is missing, telling the user to author it first.
4. Search `docs/design/` for related docs using the canonical ID, flow title,
   sibling flow IDs, production artifact names, and important behavior nouns.
5. Read only related design specs.
6. Produce a gap analysis before drafting:
   - behavior already covered
   - partial coverage
   - missing design coverage
   - conflicts with the functional spec
7. Stop without writing if no meaningful design gap exists.
8. Invoke `superpowers:brainstorming` with the flow path, related docs, and gap
   analysis.
9. Draft or update the design spec only after the design direction is approved.
10. Update `docs/design/README.md` when that index exists.

The design spec should explain architecture decisions, data flow, interfaces,
schemas, state transitions, integration behavior, source files, and open design
questions. It must not restate flow behavior as the source of truth or include
implementation task sequencing.

## Runtime Compatibility

Shared skills should use this wording pattern:

- skill handoff: “Invoke `<skill-name>` through the active runtime's skill
  mechanism.”
- Codex: “use the available skills list and follow the relevant `SKILL.md`.”
- Claude Code: “use the Skill tool.”
- file access: “read using the active runtime's file-reading mechanism.”
- web access: “use the active runtime's available web reader or browser tool.”

Shared skills should not require:

- `Skill("...")`
- Claude-only `Read` tool names
- Claude-only `WebFetch` names
- a specific subagent tool unless it is optional and runtime-gated

## Eval Strategy

The eval harness should be copied from `engineering-skills` and adapted under
`tests/evals/`.

Initial eval packages:

- `authoring-functional-spec` copied from
  `engineering-skills/tests/evals/packages/authoring-flow-spec/`, then adapted
  to `authoring-functional-spec`.
- `authoring-design-spec` added in this repo for the design-layer wrapper.
- `write-user-guide` added in this repo for standalone user-guide routing,
  exact-UI-label grounding, existing-page updates, and help-link integration.
- `writing-ai-prompts` added in this repo for standalone prompt-writing routing,
  target-tool clarification, output shape, and prompt-safety boundaries.

Routing and negative-boundary cases belong in the owning skill's eval package.
There is no separate plugin-level routing eval because the plugin is only
packaging; each skill must stand on its own.

The eval framework copy should include:

- `tests/evals/package.json`
- `tests/evals/.gitignore`
- `tests/evals/scripts/opencode-cli-provider.js`
- `tests/evals/scripts/promptfoo.sh`
- `tests/evals/scripts/check-skill-eval-coverage.js`
- `tests/evals/assertions/schema-helpers.js`
- the copied `authoring-functional-spec` assertion, prompt, and package
- the new `authoring-design-spec` assertion, prompt, and package
- the new `write-user-guide` assertion, prompt, and package
- the new `writing-ai-prompts` assertion, prompt, and package

The coverage gate should allow temporary uncovered skills through an explicit
baseline. After this change, `authoring-functional-spec` and `authoring-design-spec`
must both have eval packages; uncovered skills such as `write-user-guide` and
`writing-ai-prompts` may remain in the baseline until they receive targeted
evals.

## What This Is Not

- This is not the removal plan for the original `engineering-skills`
  `authoring-functional-spec`; that cleanup happens separately.
- This is not a new implementation-plan skill.
- This is not a redesign of user-guide authoring.
- This is not a global docs taxonomy for every repo; it is the plugin contract
  for shared documentation skills.

## Key Source Files

| File | Purpose |
|---|---|
| `skills/authoring-functional-spec/SKILL.md` | Copied functional-spec authoring workflow. |
| `skills/authoring-functional-spec/references/` | Functional-spec template, rationale, sheet interop, and altitude guidance. |
| `skills/authoring-design-spec/SKILL.md` | Design-spec authoring wrapper below canonical functional specs. |
| `skills/write-user-guide/SKILL.md` | Separate end-user guide authoring workflow. |
| `skills/writing-ai-prompts/SKILL.md` | Prompt-authoring workflow. |
| `README.md` | Public skill inventory and artifact routing. |
| `CLAUDE.md` | Claude Code adapter. |
| `.claude-plugin/plugin.json` | Claude plugin metadata. |
| `.codex-plugin/plugin.json` | Codex plugin metadata. |
| `tests/evals/` | Planned Promptfoo eval harness. |

## Open Questions

1. `[design]` Should `create-spec` and `update-spec` be removed in the same
   change as `authoring-design-spec`, or after eval routing is in place?
