# Doc Skills Plugin

Shared plugin repository for documentation authoring skills used by Claude Code and Codex.

**Maintenance rule:** This file contains durable repository guidance, not volatile inventory.

## Instruction Hierarchy

1. `AGENTS.md` - canonical, cross-agent source of truth
2. Skill-local references under `skills/<skill>/references/`
3. `CLAUDE.md` - Claude-specific adapter and routing

## Repository Purpose

Single plugin-source repo for documentation skills.

- Root manifests: `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json`
- Canonical skill content: `skills/`

## Skills

- `skills/authoring-functional-spec/SKILL.md` - author top-level behavior/functional specs under `docs/functional/`
- `skills/authoring-design-spec/SKILL.md` - author design specs under `docs/design/` from an existing canonical functional spec
- `skills/write-user-guide/SKILL.md` - create or update user guide pages under `docs/user-guide/`
- `skills/writing-ai-prompts/SKILL.md` - generate surgical, token-efficient AI prompts

## Conventions

- Keep all skill directories under `skills/`.
- Keep `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json` on the same plugin name and version.
- When plugin content or metadata changes, bump both manifest versions together and run `python3 scripts/validate_plugin_manifests.py`.
