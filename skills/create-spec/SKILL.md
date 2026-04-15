---
name: create-spec
description: |
  Creates a new module spec in the `specs/` directory. Specs provide architectural context so agents don't need to explore code each session.
  Triggers on "create spec", "new spec", "write spec", or "/create-spec".
---

# Create Spec

You are a **spec writer**. Create a module spec that serves as architectural context for AI agents.

## Why Specs Exist

Specs replace code exploration. An agent reading a spec should understand a module's architecture, constraints, and gotchas WITHOUT reading source files. Maintaining specs is more important than code — both must stay in sync.

## Autonomy

Proceed autonomously. Only confirm:

- Which directory under `specs/` to place the file (if ambiguous)
- The final spec content before writing

## Input

`$ARGUMENTS` contains either:

- A module name or description (e.g., `chat orchestration`, `dbt tools`)
- A directory path hint (e.g., `source-management/discovery`)

## Flow

1. **Determine scope and placement**
   - Parse `$ARGUMENTS` for the target module
   - Check existing `specs/` directories — reuse if the module fits
   - Create a new directory only if no existing category applies
   - File name: `kebab-case.md` matching the module

2. **Explore the module**
   - Spawn an `Explore` sub-agent to map the module. Give it a focused scope:
     - Entry points (routes, components, tools)
     - Key services and responsibilities
     - External integrations and data flow
     - Non-obvious patterns, constraints, gotchas
     - File paths with one-line purpose
   - Output stays internal — do not dump raw exploration into the spec

3. **Draft the spec** following the template below. Apply the Writing Principles strictly.

4. **Show the draft** to the user for review before writing.

5. **Write** to `specs/{directory}/{name}.md`.

## Spec Template

```markdown
# [Module Name]

**Architecture Note**: [Only if non-pluggable, tightly coupled, or has major constraints. Delete this line if not applicable.]

## Current Implementation

- Key architectural fact 1
- Key architectural fact 2
- Key architectural fact 3
  (3-7 bullets. Focus on HOW things connect, not WHAT they are.)

## [Domain-Specific Sections]

Vary by module. Pick what matters:

- Execution Paths (pipeline modules)
- Data Flow (integration modules)
- Security Model (auth modules)
- Tool API (MCP tool modules)
- State Management (frontend modules)

## Key Constraints

- What can't be done and why
- Known failure modes with workarounds
- Non-obvious limitations

## Why This Way

Brief rationale for non-obvious decisions only.
1-2 paragraphs max. Skip entirely if decisions are self-evident.

## Files

- `src/path/file.ts` — One-line responsibility
```

## Writing Principles

1. **Agent audience**: Agents know TypeScript, React, Express, SQL, dbt, dlt. Don't explain standard patterns.
2. **Density**: Pack information tight. Agents parse structured text well. No filler words.
3. **Constraints first**: What CAN'T be done is more valuable than what CAN.
4. **Present tense only**: How it works now. No history, no roadmap, no "we decided to...".
5. **File paths are essential**: Every spec ends with a Files section — the agent's entry point to code.
6. **50-150 lines**: Longer means the spec is too detailed or the module needs splitting.
7. **No issue references**: No VD-123, no Linear links, no changelog entries.
8. **No code blocks over 10 lines**: If you need that much code, link to the file instead.
9. **Skip the obvious**: No explaining CRUD, REST conventions, or what middleware does.
