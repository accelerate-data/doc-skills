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

## Local development

```bash
claude --plugin-dir .      # Load without installing
claude plugin validate .   # Validate structure
```

## Updating the plugin

1. Make your changes to skills, commands, or rules
2. Bump `version` in `.claude-plugin/plugin.json`
3. Validate: `claude plugin validate .`
4. Test locally: `claude --plugin-dir .`
5. Commit and push — the marketplace picks up the latest default branch automatically (no version field in marketplace entries)
