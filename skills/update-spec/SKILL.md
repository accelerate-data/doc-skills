---
name: update-spec
description: |
  Updates an existing module spec to match the current state of code. Detects drift between spec and implementation.
  Triggers on "update spec", "sync spec", "refresh spec", or "/update-spec".
---

# Update Spec

You are a **spec updater**. Sync an existing spec with the current state of its module's code.

## Why This Matters

Specs and code must speak the same language. A stale spec is worse than no spec — it actively misleads agents. After code changes, the spec must reflect reality.

## Autonomy

Proceed autonomously. Only confirm:

- The updated spec content before writing (show diff summary: what was added/changed/removed)

## Input

`$ARGUMENTS` contains either:

- A spec file path (e.g., `specs/source-management/dlt-integration.md`)
- A spec name (e.g., `dlt-integration`) — resolve by searching `specs/` directory

If no argument, list existing specs and ask user which one to update.

## Flow

1. **Read the existing spec**
   - Load the spec file
   - Extract the `## Files` section — this is the module's file map

2. **Detect drift**
   - Spawn an `Explore` sub-agent with a focused scope:
     - Read every file listed in the spec's `## Files` section
     - Scan the same directories for new files not in the spec
     - Cross-reference each spec claim against actual code:
       - Are described patterns still accurate?
       - Are constraints still valid?
       - Are file paths still correct?
       - Are there new capabilities, integrations, or constraints?
     - Check `git log --oneline` on the listed files for recent changes
   - Output: list of drift items (added, changed, removed, stale)

3. **Apply updates** — edit the spec to reflect current state:
   - **Add** new sections for new capabilities
   - **Update** descriptions, file paths, and constraints that changed
   - **Remove** references to deleted code or features
   - **Never add history** — no "previously...", no "migrated from...", no changelog
   - **Keep it concise** — 50-150 lines target

4. **Show the user** a summary of changes before writing:
   - Sections added
   - Sections updated (with what changed)
   - Sections removed
   - File map changes

5. **Write** the updated spec.

## Writing Principles

Same as `/create-spec`:

1. **Agent audience**: Don't explain standard patterns agents already know.
2. **Density**: Tight, structured, no filler.
3. **Constraints first**: What CAN'T be done > what CAN.
4. **Present tense only**: No history, no roadmap.
5. **File paths are essential**: Always maintain an accurate `## Files` section.
6. **50-150 lines**: Trim if over, split if way over.
7. **No issue references, no code blocks over 10 lines, skip the obvious.**

## Drift Signals

Common patterns that indicate spec drift:

- File renamed or moved → update path in Files section
- New route/tool/component added → add to Current Implementation or new section
- Feature removed → remove from spec entirely (no "was removed" note)
- Constraint no longer applies → remove it
- New constraint introduced → add it
- Architecture changed (e.g., new execution path) → rewrite affected section
