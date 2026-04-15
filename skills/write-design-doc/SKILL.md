---
name: write-design-doc
description: |
  Creates or updates a design document in `docs/design/`. Follows the project's design doc template with status blocks, key decisions, and source file references.
  Triggers on "write design doc", "create design doc", "new design doc", "update design doc", "document <feature>", or "/write-design-doc".
---

# Write Design Doc

You are a **technical writer**. Create or update a design document following the project's established conventions.

## Autonomy

Proceed autonomously. Only confirm:

- Which subdirectory under `docs/design/` to place the file (if ambiguous)
- The final content before writing (show draft)

## Standards

All design documents follow the spec in `docs/design/documentation/README.md`. The master index is `docs/design/README.md`.

## Input

`$ARGUMENTS` contains either:

- A feature/system name (e.g., `agent logging`, `source management`)
- A path hint (e.g., `platform/observability`)
- An existing doc path to update

## Flow

1. **Determine scope and placement**
   - Parse `$ARGUMENTS` for the target topic
   - Check existing `docs/design/` directories — reuse if topic fits
   - New topics get their own subdirectory with a `README.md`
   - Read the master index at `docs/design/README.md`

2. **Research the feature**
   - Spawn an `Explore` sub-agent to map the relevant code:
     - Entry points (routes, components, tools, services)
     - Key architectural decisions and constraints
     - External integrations and data flow
     - Non-obvious patterns and gotchas
     - File paths with one-line purpose
   - If updating an existing doc, read it first and identify drift

3. **Draft the document** following the template below. Apply the Writing Principles strictly.

4. **Show the draft** to the user for review before writing.

5. **Write** to `docs/design/{directory}/README.md` (or the appropriate filename for sub-docs).

6. **Update the index** — ensure `docs/design/README.md` includes an entry for this doc.

## Design Doc Template

```markdown
# [Feature/System Name]

> **Status:** [Draft | In Progress | Shipped] — [Linear issue refs if any]

## Overview

2-3 sentences: what this is and why it exists.

## Key Decisions

| Decision | Rationale |
|---|---|
| ... | ... |

## Architecture / How It Works

[Main technical content — diagrams, data flows, schemas, state machines]

## What This Is Not

[Explicit scope boundaries — what's excluded and why]

## States / Transitions (if applicable)

[State machines, lifecycle diagrams, event flows]

## Key Source Files

| File | Purpose |
|---|---|
| `src/path/file.ts` | One-line responsibility |

## Open Questions

[Unresolved items, numbered or lettered]
```

## Writing Principles

1. **Developer audience**: Readers know TypeScript, React, Express, SQL, dbt. Don't explain standard patterns.
2. **Decisions over descriptions**: State the decision and the reason — not the reasoning process.
3. **Tables over prose**: Use tables for structured comparisons, options, file inventories.
4. **"What this is not" matters**: Explicit scope boundaries prevent future scope creep.
5. **Present tense only**: How it works now. No history, no roadmap, no "we decided to...".
6. **Source file references are essential**: Every doc ends with a Key Source Files table.
7. **Status block at top**: Always include status with Linear issue references when applicable.
8. **One topic per subdirectory**: Each topic gets its own dir with a README.md. Sub-docs for deep dives.
9. **Max 500 lines per doc**: If longer, split into sub-documents within the same directory.
10. **No code blocks over 15 lines**: Link to the source file instead.

## Existing Patterns to Follow

- `docs/design/platform/devops/README.md` — model index with key decisions table
- `docs/design/agents/context-assembly.md` — excellent: alternatives considered, FAQ, gaps
- `docs/design/agents/logging/README.md` — good: problem statement, phases, security section
- `docs/design/intent/intent-functional-flow.md` — good: error paths, invariants

## After Writing

- Verify `docs/design/README.md` index includes the new/updated doc
- If the doc covers a feature with UI, check if a corresponding user guide exists in `docs/user-guide/` — suggest creating one via `/write-user-guide` if not
