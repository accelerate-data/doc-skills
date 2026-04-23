# Doc Skills

Create and maintain specs, design docs, user guides, and AI prompts for codebases.

## Skills

| Skill | Description |
|-------|-------------|
| `create-spec` | Create a new module specification |
| `update-spec` | Update an existing module spec |
| `write-design-doc` | Create or update a design document |
| `write-user-guide` | Create or update a user guide page |
| `writing-ai-prompts` | Generate surgical, token-efficient AI prompts |

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
