# Session Start Hook — Routing Priority Override

> **Status:** Draft
> **Linear issue:** [AD-30](https://linear.app/acceleratedata/issue/AD-30)

## Overview

This design covers the `hooks/` infrastructure that injects a routing priority
override at session start. Without it, `superpowers:brainstorming` fires first
for any creative or design request, bypassing the pre-flight checks, canonical
flow resolution, and gap analysis that `authoring-functional-spec` and
`authoring-design-spec` perform. The hook shifts both skills from
implementation-tier to process-tier for their respective request types.

## Design Scope

**Covers**

- SessionStart hook wiring (`hooks/hooks.json`, `hooks/run-hook.cmd`)
- Routing instruction content (`hooks/session-start`)
- Plugin version bump for both Claude and Codex manifests

**Does not cover**

- Changes to `superpowers:brainstorming` or the superpowers plugin
- Changes to any existing `skills/` content
- Routing for implementation plans (`superpowers:writing-plans` handles that downstream)

## Key Decisions

| Decision | Rationale |
|---|---|
| SessionStart hook instead of per-user CLAUDE.md | Ships with the plugin to all users automatically; a CLAUDE.md approach requires every user to add the override manually |
| Single hook script for both routing rules | One context injection is less noisy than two; both rules share the same session-start event |
| Keep routing text short | The superpowers SessionStart injection already occupies significant context window; the doc-skills addition must be concise to avoid competing noise |
| Mirror the superpowers `run-hook.cmd` pattern exactly | Proven cross-platform wrapper (Unix + Windows Git Bash); consistent with the established plugin hook convention |
| Matcher: `startup\|clear\|compact` | Matches the superpowers hook; fires on session start, clear, and context compaction — all points where prior context is reset |

## Architecture / How It Works

```
hooks/
  hooks.json        ← declares SessionStart hook, references run-hook.cmd
  run-hook.cmd      ← cross-platform polyglot wrapper (bash on Unix, Git Bash on Windows)
  session-start     ← bash script; outputs hookSpecificOutput.additionalContext
```

`hooks.json` uses the same structure as superpowers:

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

`session-start` outputs `hookSpecificOutput.additionalContext` with two routing
rules:

1. **Functional spec rule** — when the request involves product-level functional
   requirements, user flows, behavioral specs, or PRD-adjacent work, invoke
   `doc-skills:authoring-functional-spec` before `superpowers:brainstorming`.
   `authoring-functional-spec` has its own brainstorming discipline
   (`references/brainstorming.md`) and calls it internally.

2. **Design spec rule** — when the request involves technical design,
   architecture decisions, integration design, or feature design with
   implementation depth, invoke `doc-skills:authoring-design-spec` before
   `superpowers:brainstorming`. `authoring-design-spec` invokes brainstorming
   at Phase 4 with canonical flow context.

The injected text must be short. Both rules fit in under 120 words.

## Key Source Files

| File | Purpose |
|---|---|
| `hooks/hooks.json` | Hook event declaration (new) |
| `hooks/run-hook.cmd` | Cross-platform bash wrapper (new) |
| `hooks/session-start` | Routing instruction script (new) |
| `.claude-plugin/plugin.json` | Claude plugin manifest — version bump |
| `.codex-plugin/plugin.json` | Codex plugin manifest — version bump |

## Open Questions

None.
