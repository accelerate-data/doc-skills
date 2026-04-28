# Doc Skills

Create and maintain functional specs, design specs, user guides, and AI prompts for codebases.

## Skills

| Skill | Description |
|-------|-------------|
| `authoring-functional-spec` | Author top-level behavior/functional specs under `docs/functional/` |
| `authoring-design-spec` | Author design specs under `docs/design/` from an existing canonical functional spec |
| `authoring-user-guide` | Create or update user guide pages under `docs/user-guide/` |
| `writing-clearly-and-concisely` | Tighten prose in functional specs, design documents, user guides, and implementation plans |
| `writing-ai-prompts` | Generate surgical, token-efficient prompts |

## Skill Entry Points

Each skill owns its trigger and negative-boundary contract. The plugin only packages
the skills; it does not provide a separate routing workflow.

- Functional docs, behavior specs, journey specs, and PRD-adjacent product flows: use `authoring-functional-spec`.
- Design specs: use `authoring-design-spec`; it requires an existing canonical functional spec.
- Implementation plans: use `superpowers:writing-plans`; this plugin does not duplicate that workflow.
- User guides: use `authoring-user-guide`.
- Prose tightening for functional specs, design documents, user guides, and implementation plans: use `writing-clearly-and-concisely`.
- AI prompt-writing requests: use `writing-ai-prompts`.

## Install

```bash
claude plugin add accelerate-data/doc-skills
```

Codex installs plugins through registered marketplaces. Register the marketplace repo or
marketplace checkout that contains `doc-skills`; do not register this plugin source repo
directly as a marketplace root.

## Local development

```bash
claude --plugin-dir .      # Load without installing
claude plugin validate .   # Validate structure
python3 scripts/validate_plugin_manifests.py
python3 scripts/check_plugin_version_bump.py --base-ref origin/main
codex plugin marketplace --help  # Confirm the local Codex CLI marketplace workflow
```

## Updating the plugin

1. Make your changes to skills, commands, or rules
2. Bump `version` in both `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json` to the same value
3. Validate: `python3 scripts/validate_plugin_manifests.py`
4. Check the shared version bump: `python3 scripts/check_plugin_version_bump.py --base-ref origin/main`
5. Validate in Claude: `claude plugin validate .`
6. Test locally in Claude: `claude --plugin-dir .`
7. Confirm the local Codex CLI marketplace workflow: `codex plugin marketplace --help`
8. Commit and push — the marketplaces pick up the latest default branch automatically
9. After merge, verify from the marketplace repo that references this plugin source
