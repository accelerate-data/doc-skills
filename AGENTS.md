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

- `skills/create-spec/SKILL.md` - create a new module specification
- `skills/update-spec/SKILL.md` - update an existing module spec
- `skills/write-design-doc/SKILL.md` - create or update a design document
- `skills/write-user-guide/SKILL.md` - create or update a user guide page
- `skills/writing-ai-prompts/SKILL.md` - generate surgical, token-efficient AI prompts

## Conventions

- Keep all skill directories under `skills/`.
