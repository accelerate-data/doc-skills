# Session Start Hook — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a SessionStart hook to doc-skills that injects a routing priority
override so `authoring-functional-spec` and `authoring-design-spec` fire before
`superpowers:brainstorming` for spec and design requests.

**Architecture:** Three new files under `hooks/`, two manifest version bumps.
No existing skill files change. Each task ends with a commit.

**Design doc:** `docs/design/session-start-hook/README.md`
**Linear issue:** AD-30

---

## File Map

| File | Change |
|---|---|
| `hooks/hooks.json` | Create — SessionStart hook declaration |
| `hooks/run-hook.cmd` | Create — cross-platform bash wrapper |
| `hooks/session-start` | Create — routing instruction script |
| `.claude-plugin/plugin.json` | Edit — version bump (patch) |
| `.codex-plugin/plugin.json` | Edit — version bump (patch), keep in sync with Claude manifest |

---

## Task 1: Create `hooks/hooks.json`

**Files:**
- Create: `hooks/hooks.json`

- [ ] **Step 1: Write hooks.json**

Create `hooks/hooks.json` with this exact content:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|clear|compact",
        "hooks": [
          {
            "type": "command",
            "command": "\"${CLAUDE_PLUGIN_ROOT}/hooks/run-hook.cmd\" session-start",
            "async": false
          }
        ]
      }
    ]
  }
}
```

- [ ] **Step 2: Commit**

```
git commit -m "feat(hooks): add hooks.json declaring SessionStart hook"
```

---

## Task 2: Create `hooks/run-hook.cmd`

**Files:**
- Create: `hooks/run-hook.cmd`

- [ ] **Step 1: Write run-hook.cmd**

Copy the cross-platform polyglot pattern from superpowers verbatim. The file
must be executable on Unix (`chmod +x`). On Windows it runs the batch block to
locate Git Bash; on Unix the shell skips the CMDBLOCK heredoc and runs the
final `exec bash` line.

Reference the superpowers implementation at
`/Users/hbanerjee/.claude/plugins/cache/superpowers-dev/superpowers/5.0.7/hooks/run-hook.cmd`
for the exact content to copy.

- [ ] **Step 2: Make executable**

```
chmod +x hooks/run-hook.cmd
```

- [ ] **Step 3: Commit**

```
git commit -m "feat(hooks): add cross-platform run-hook.cmd wrapper"
```

---

## Task 3: Create `hooks/session-start`

**Files:**
- Create: `hooks/session-start`

- [ ] **Step 1: Write session-start script**

The script must:
- Be a bash script (`#!/usr/bin/env bash`)
- Output `hookSpecificOutput.additionalContext` for Claude Code (detect via `CLAUDE_PLUGIN_ROOT`)
- Output `additionalContext` for Copilot CLI / unknown platforms
- Keep the routing instruction under 150 words total

Routing instruction content (adapt to final wording during implementation):

```
doc-skills routing priority:

When doc-skills is installed:
- For product-level functional requirements, user flows, behavioral specs, or
  PRD-adjacent requests: invoke doc-skills:authoring-functional-spec BEFORE
  superpowers:brainstorming. That skill handles brainstorming internally.
- For technical design, architecture decisions, integration design, or feature
  design with implementation depth: invoke doc-skills:authoring-design-spec
  BEFORE superpowers:brainstorming. It invokes brainstorming at Phase 4 with
  canonical flow context.

Do not let brainstorming run first for these request types — it produces specs
unanchored to the functional spec or canonical flow.
```

- [ ] **Step 2: Make executable**

```
chmod +x hooks/session-start
```

- [ ] **Step 3: Smoke-test the script locally**

Run `CLAUDE_PLUGIN_ROOT=. bash hooks/session-start` and verify the JSON output
contains `hookSpecificOutput.additionalContext` with the routing text.

- [ ] **Step 4: Commit**

```
git commit -m "feat(hooks): add session-start hook with doc-skills routing override"
```

---

## Task 4: Bump plugin versions

**Files:**
- Edit: `.claude-plugin/plugin.json`
- Edit: `.codex-plugin/plugin.json`

- [ ] **Step 1: Read current versions**

Read both manifest files and note the current version string.

- [ ] **Step 2: Bump patch version in both manifests**

Increment the patch version (e.g. `1.2.2` → `1.2.3`) in both files. Versions
must stay in sync across manifests.

- [ ] **Step 3: Run manifest validation**

```
npm run validate:plugin-manifests
```

Fix any validation errors before committing.

- [ ] **Step 4: Commit**

```
git commit -m "chore: bump plugin version to <new-version> for SessionStart hook"
```

---

## Verification

- [ ] Start a new Claude Code session in any repo with doc-skills installed
- [ ] Send: "I want to write functional requirements for X" — confirm `authoring-functional-spec` is invoked, not brainstorming directly
- [ ] Send: "I want to design how X integrates with Y" — confirm `authoring-design-spec` is invoked, not brainstorming directly
- [ ] Send: a non-spec implementation request — confirm brainstorming still fires as normal
