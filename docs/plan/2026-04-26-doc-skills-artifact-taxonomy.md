# Doc Skills Artifact Taxonomy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align `doc-skills` around functional-spec authoring, design-spec authoring, user-guide authoring, and prompt writing; copy `authoring-functional-spec` from `engineering-skills`; add `authoring-design-spec`; and prepare an eval harness that validates routing and Claude Code/Codex compatibility.

**Architecture:** Functional specs are the top-level behavior source of truth under `docs/functional/`. Design specs are the next layer under `docs/design/` and require an existing canonical functional spec. Implementation plans route to `superpowers:writing-plans`; this plugin does not duplicate that workflow. Shared skill instructions remain runtime-neutral so both Claude Code and Codex can execute them.

**Tech Stack:** Markdown skills, JSON plugin manifests, Python validation tests, Node.js/Promptfoo eval harness copied from `engineering-skills`.

---

## Current Working Tree Context

The interrupted implementation already created or modified:

- `skills/authoring-functional-spec/`
- `skills/authoring-design-spec/` from the interrupted draft, now using the
  final design-spec skill name
- removal of `write-design-doc` as part of the artifact taxonomy
- partial `tests/evals/` files copied from `engineering-skills`
- `.claude-plugin/plugin.json`
- `.codex-plugin/plugin.json`
- `README.md`
- `CLAUDE.md`
- `repo-map.json`
- `docs/design/doc-skills-artifact-taxonomy/README.md`
- this plan

Do not remove the original `engineering-skills` copy of `authoring-flow-spec`.
That cleanup is explicitly separate.

---

## Target File Structure

- Create/keep `skills/authoring-functional-spec/SKILL.md` and references adapted from `/Users/hbanerjee/src/engineering-skills/skills/authoring-flow-spec/`.
- Keep the current partial `skills/authoring-design-spec/` directory as the
  design-spec skill path.
- Create/keep `skills/authoring-design-spec/SKILL.md`.
- Confirm `write-design-doc` is removed now that public routing points to
  `authoring-design-spec`.
- Keep `skills/authoring-user-guide/SKILL.md`.
- Keep `skills/writing-ai-prompts/SKILL.md`.
- Remove `skills/create-spec/` and `skills/update-spec/` if the final taxonomy excludes module specs.
- Modify `README.md`, `CLAUDE.md`, and `repo-map.json` for the active inventory.
- Modify both plugin manifests and keep name/version/description aligned.
- Add `tests/test_skill_inventory.py`.
- Add `tests/evals/` harness copied from `engineering-skills`.

---

### Task 1: Stabilize Existing Partial Changes

**Files:**
- Read: `git status --short`
- Read: `skills/authoring-functional-spec/SKILL.md`
- Read: `skills/authoring-design-spec/SKILL.md` when present
- Read: `README.md`
- Read: `CLAUDE.md`
- Read: `repo-map.json`

- [ ] **Step 1: Inspect the interrupted state**

Run:

```bash
git status --short
find skills -maxdepth 2 -type f | sort
```

Expected: uncommitted copied flow skill, partial design-spec wrapper, metadata
edits, partial eval files, and design/plan docs are visible.

- [ ] **Step 2: Confirm no original source was modified**

Run:

```bash
git -C /Users/hbanerjee/src/engineering-skills status --short -- skills/authoring-flow-spec
```

Expected: no output for the original skill path.

---

### Task 2: Finish `authoring-functional-spec` Copy

**Files:**
- Modify: `skills/authoring-functional-spec/SKILL.md`
- Modify: `skills/authoring-functional-spec/references/functional-spec-template.md`
- Modify: `skills/authoring-functional-spec/references/writing-the-draft.md`

- [ ] **Step 1: Ensure frontmatter is CSO-compliant**

`skills/authoring-functional-spec/SKILL.md` frontmatter should be:

```markdown
---
name: authoring-functional-spec
description: Use when authoring or updating top-level Vibedata functional, behavior, journey, PRD-adjacent, or product-requirements specs that belong under docs/functional and must stay above design or implementation detail
version: 0.1.0
---
```

- [ ] **Step 2: Ensure runtime-neutral skill handoffs**

The Phase 0 handoff check should include:

```markdown
Do not rely on local filesystem paths alone; use the active runtime's skill
availability mechanism so the check reflects what can actually be invoked.
In Codex, use the available skills list and follow the relevant `SKILL.md`;
in Claude Code, use the Skill tool.
```

Phase 7 should say:

```markdown
Invoke `superpowers:brainstorming` through the active runtime's skill mechanism
with the following context:
```

- [ ] **Step 3: Remove copied Claude-only tool names**

Run:

```bash
rg -n 'Skill\("|`Read`|WebFetch|mcp__read|Claude Code build' skills/authoring-functional-spec
```

Expected: no output.

---

### Task 3: Finalize `authoring-design-spec`

**Files:**
- Modify: `skills/authoring-design-spec/SKILL.md`

- [ ] **Step 1: Confirm skill identity**

Frontmatter should be:

```markdown
---
name: authoring-design-spec
description: Use when authoring or updating developer-facing design specs under docs/design for an existing canonical functional spec, especially architecture decisions, technical tradeoffs, states, data flows, schemas, source-file references, and gaps between flow behavior and current design coverage
---
```

- [ ] **Step 2: Enforce canonical flow prerequisite**

The skill must require:

```markdown
- Canonical flow ID.
- Existing functional spec at `docs/functional/<canonical-id>/README.md`, or a child
  flow file under `docs/functional/<parent-id>/NN-<child-slug>.md` whose
  frontmatter `id` matches the canonical ID.
```

Missing flow behavior must abort with:

```markdown
Functional spec `<canonical-id>` was not found under `docs/functional/`. Author the
functional spec first with `authoring-functional-spec`, then rerun this skill.
```

- [ ] **Step 3: Add related-design gap analysis**

The skill must search `docs/design/` using:

- canonical flow ID
- flow title
- named production artifacts cited by the functional spec
- sibling canonical IDs
- behavior nouns from goal, outputs, failures, and invariants

It must classify related docs as:

- covered
- partial
- missing
- conflicting

- [ ] **Step 4: Add brainstorming handoff payload**

The handoff must include:

```markdown
We are authoring a design spec under `docs/design/` for canonical flow
`<canonical-id>`. The functional spec is `<functional-spec-path>` and is the behavioral
source of truth. Related design specs read: `<paths>`. Gap analysis:
`<covered/partial/missing/conflicting summary>`. Keep the design spec one level
below the functional spec and above the implementation plan. Pressure-test the
proposed design coverage, ask one question at a time, and keep implementation
task sequencing for `superpowers:writing-plans`.
```

- [ ] **Step 5: Remove the legacy design-doc skill**

The legacy `skills/write-design-doc/` directory is removed completely. No
legacy fallback is kept; README/CLAUDE routing points to `authoring-design-spec`.

---

### Task 4: Update Public Inventory And Adapter Routing

**Files:**
- Modify: `README.md`
- Modify: `CLAUDE.md`
- Modify: `repo-map.json`
- Modify: `.claude-plugin/plugin.json`
- Modify: `.codex-plugin/plugin.json`

- [ ] **Step 1: Update README skill table**

Use:

```markdown
| Skill | Description |
|-------|-------------|
| `authoring-functional-spec` | Author top-level behavior/functional specs under `docs/functional/` |
| `authoring-design-spec` | Author design specs under `docs/design/` from an existing canonical functional spec |
| `authoring-user-guide` | Create or update user guide pages under `docs/user-guide/` |
| `writing-ai-prompts` | Generate surgical, token-efficient prompts |
```

- [ ] **Step 2: Update README routing**

Use:

```markdown
- Functional docs, behavior specs, journey specs, and PRD-adjacent product flows: use `authoring-functional-spec`.
- Design specs: use `authoring-design-spec`; it requires an existing canonical functional spec.
- Implementation plans: use `superpowers:writing-plans`; this plugin does not duplicate that workflow.
- User guides: use `authoring-user-guide`.
```

- [ ] **Step 3: Update CLAUDE adapter**

Include route entries for:

- `authoring-functional-spec`
- `authoring-design-spec`
- `authoring-user-guide`
- `writing-ai-prompts`

Remove `create-spec` and `update-spec` entries if those skills are removed.

- [ ] **Step 4: Update repo map**

Set skills description to:

```json
"Canonical skill directories: authoring-functional-spec, authoring-design-spec, authoring-user-guide, writing-ai-prompts."
```

- [ ] **Step 5: Keep manifests aligned**

Both manifests should share:

```json
"description": "Create and maintain functional specs, design specs, user guides, and AI prompts for codebases.",
"version": "1.1.0"
```

Run:

```bash
python3 scripts/validate_plugin_manifests.py
```

Expected: `Plugin manifests are valid.`

---

### Task 5: Add Inventory Guard Tests

**Files:**
- Create: `tests/test_skill_inventory.py`

- [ ] **Step 1: Add taxonomy test**

Create:

```python
from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SKILLS = ROOT / "skills"


def skill_dirs() -> set[str]:
    return {
        path.name
        for path in SKILLS.iterdir()
        if path.is_dir() and (path / "SKILL.md").exists()
    }


def test_doc_artifact_skill_inventory() -> None:
    assert {
        "authoring-functional-spec",
        "authoring-design-spec",
        "authoring-user-guide",
        "writing-ai-prompts",
    }.issubset(skill_dirs())
    assert "create-spec" not in skill_dirs()
    assert "update-spec" not in skill_dirs()


def test_shared_skills_avoid_claude_only_runtime_instructions() -> None:
    forbidden = [
        "Skill(\"",
        "`Read` them",
        "WebFetch",
        "mcp__read",
        "Spawn an `Explore` sub-agent",
    ]
    for skill in skill_dirs():
        content = (SKILLS / skill / "SKILL.md").read_text(encoding="utf-8")
        for phrase in forbidden:
            assert phrase not in content, f"{skill} contains shared-runtime-only forbidden phrase: {phrase}"
```

- [ ] **Step 2: Run test**

Run:

```bash
python3 -m pytest -q tests/test_skill_inventory.py
```

Expected: PASS after obsolete skills are removed and runtime wording is fixed.

---

### Task 6: Copy Eval Framework And Add Skill Eval Packages

**Files:**
- Create: `package.json`
- Create: `tests/evals/package.json`
- Create: `tests/evals/package-lock.json`
- Create: `tests/evals/.gitignore`
- Create: `tests/evals/assertions/schema-helpers.js`
- Create: `tests/evals/assertions/check-authoring-functional-spec-contract.js`
- Create: `tests/evals/assertions/check-authoring-design-spec-contract.js`
- Create: `tests/evals/assertions/check-authoring-user-guide-contract.js`
- Create: `tests/evals/assertions/check-writing-ai-prompts-contract.js`
- Create: `tests/evals/prompts/skill-authoring-functional-spec.txt`
- Create: `tests/evals/prompts/skill-authoring-design-spec.txt`
- Create: `tests/evals/prompts/skill-authoring-user-guide.txt`
- Create: `tests/evals/prompts/skill-writing-ai-prompts.txt`
- Create: `tests/evals/packages/authoring-functional-spec/skill-authoring-functional-spec.yaml`
- Create: `tests/evals/packages/authoring-design-spec/skill-authoring-design-spec.yaml`
- Create: `tests/evals/packages/authoring-user-guide/skill-authoring-user-guide.yaml`
- Create: `tests/evals/packages/writing-ai-prompts/skill-writing-ai-prompts.yaml`
- Create: `tests/evals/scripts/opencode-cli-provider.js`
- Create: `tests/evals/scripts/promptfoo.sh`
- Create: `tests/evals/scripts/check-skill-eval-coverage.js`
- Create: `tests/evals/skill-eval-coverage-baseline.json`

- [ ] **Step 1: Copy the reusable eval framework**

Run:

```bash
mkdir -p tests/evals/assertions tests/evals/prompts tests/evals/packages tests/evals/scripts
cp /Users/hbanerjee/src/engineering-skills/tests/evals/.gitignore tests/evals/.gitignore
cp /Users/hbanerjee/src/engineering-skills/tests/evals/assertions/schema-helpers.js tests/evals/assertions/schema-helpers.js
cp /Users/hbanerjee/src/engineering-skills/tests/evals/scripts/opencode-cli-provider.js tests/evals/scripts/opencode-cli-provider.js
cp /Users/hbanerjee/src/engineering-skills/tests/evals/scripts/promptfoo.sh tests/evals/scripts/promptfoo.sh
cp /Users/hbanerjee/src/engineering-skills/tests/evals/scripts/check-skill-eval-coverage.js tests/evals/scripts/check-skill-eval-coverage.js
cp /Users/hbanerjee/src/engineering-skills/tests/evals/package-lock.json tests/evals/package-lock.json
chmod +x tests/evals/scripts/promptfoo.sh
```

- [ ] **Step 2: Create eval package metadata**

Create `tests/evals/package.json`:

```json
{
  "name": "@doc-skills/evals",
  "private": true,
  "description": "Promptfoo eval harness for doc-skills",
  "scripts": {
    "eval": "npm run eval:authoring-functional-spec && npm run eval:authoring-design-spec && npm run eval:authoring-user-guide && npm run eval:writing-ai-prompts && npm run eval:coverage",
    "eval:authoring-functional-spec": "./scripts/promptfoo.sh eval --no-cache -c packages/authoring-functional-spec/skill-authoring-functional-spec.yaml",
    "eval:authoring-design-spec": "./scripts/promptfoo.sh eval --no-cache -c packages/authoring-design-spec/skill-authoring-design-spec.yaml",
    "eval:authoring-user-guide": "./scripts/promptfoo.sh eval --no-cache -c packages/authoring-user-guide/skill-authoring-user-guide.yaml",
    "eval:writing-ai-prompts": "./scripts/promptfoo.sh eval --no-cache -c packages/writing-ai-prompts/skill-writing-ai-prompts.yaml",
    "eval:coverage": "node scripts/check-skill-eval-coverage.js",
    "view": "./scripts/promptfoo.sh view"
  },
  "dependencies": {
    "@opencode-ai/sdk": "1.14.21",
    "promptfoo": "0.121.7"
  }
}
```

- [ ] **Step 3: Copy the `authoring-functional-spec` eval package**

Run:

```bash
cp /Users/hbanerjee/src/engineering-skills/tests/evals/assertions/check-authoring-flow-spec-contract.js tests/evals/assertions/check-authoring-functional-spec-contract.js
cp /Users/hbanerjee/src/engineering-skills/tests/evals/prompts/skill-authoring-flow-spec.txt tests/evals/prompts/skill-authoring-functional-spec.txt
mkdir -p tests/evals/packages/authoring-functional-spec
cp /Users/hbanerjee/src/engineering-skills/tests/evals/packages/authoring-flow-spec/skill-authoring-flow-spec.yaml tests/evals/packages/authoring-functional-spec/skill-authoring-functional-spec.yaml
```

Keep the existing scenarios for:

- preconditions
- required cross-skill handoffs
- Sheet lookup and no Sheet writes
- child-flow inference
- parent/child output paths
- behavioral altitude
- brainstorming, self-review, commit offer, and no push

- [ ] **Step 4: Add `authoring-design-spec` eval package**

Create `tests/evals/assertions/check-authoring-design-spec-contract.js`:

```javascript
const { extractJsonObject } = require('./schema-helpers');

function parseExpectedBoolean(value) {
  if (value === undefined) return null;
  return String(value).trim().toLowerCase() === 'true';
}

module.exports = (output, context) => {
  let payload;
  try {
    payload = extractJsonObject(output);
  } catch (error) {
    return { pass: false, score: 0, reason: `Failed to parse JSON output: ${error.message}` };
  }

  for (const [varName, varValue] of Object.entries(context.vars || {})) {
    if (!varName.startsWith('expect_')) continue;
    const field = varName.slice('expect_'.length);
    const expected = parseExpectedBoolean(varValue);
    if (expected === null) continue;
    if (payload[field] !== expected) {
      return { pass: false, score: 0, reason: `Expected ${field}=${expected}, got ${payload[field]}` };
    }
  }

  return { pass: true, score: 1, reason: 'authoring-design-spec contract matched expected behavior' };
};
```

Create `tests/evals/prompts/skill-authoring-design-spec.txt`:

```text
You are evaluating the `authoring-design-spec` skill workflow for this scenario:

{{scenario}}

Skill contract:

- The skill authors or updates developer-facing design specs under docs/design only.
- It requires a canonical flow ID.
- It must find and read the existing canonical functional spec under docs/functional before proceeding.
- It aborts when the matching functional spec is missing and tells the user to author the functional spec first.
- It searches docs/design for related design docs using the canonical ID, flow title, sibling flow IDs, cited production artifacts, and behavioral nouns.
- It reads only related design docs.
- It builds a gap analysis: covered, partial, missing, and conflicting design coverage.
- It presents the gap analysis and proposed target path before drafting.
- It stops without writing when no meaningful design gap exists.
- It invokes superpowers:brainstorming with the canonical flow path, related design docs, and gap analysis.
- It keeps design specs below functional specs and above implementation plans.
- It routes implementation-plan requests to superpowers:writing-plans.
- It updates docs/design/README.md when that index exists.
- It uses runtime-neutral wording compatible with Claude Code and Codex.

Do not actually call tools. Return JSON only with this shape:

{
  "asks_for_canonical_flow_id": false,
  "requires_existing_flow_spec": false,
  "aborts_when_flow_spec_missing": false,
  "reads_canonical_flow_spec": false,
  "searches_related_design_docs": false,
  "reads_only_related_design_docs": false,
  "builds_gap_analysis": false,
  "presents_gap_before_drafting": false,
  "stops_when_no_design_gap_exists": false,
  "invokes_brainstorming_with_gap_context": false,
  "keeps_design_below_flow_above_plan": false,
  "routes_implementation_plans_to_writing_plans": false,
  "updates_design_index_when_present": false,
  "supports_claude_code_and_codex": false,
  "notes": "string"
}
```

Create `tests/evals/packages/authoring-design-spec/skill-authoring-design-spec.yaml`:

```yaml
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
description: "authoring-design-spec skill - core design-spec authoring contract"

prompts:
  - id: authoring-design-spec
    label: authoring-design-spec
    raw: file://../../prompts/skill-authoring-design-spec.txt

providers:
  - id: file://../../scripts/opencode-cli-provider.js
    config:
      provider_id: opencode
      model: qwen3.6-plus
      working_dir: ../..
      max_turns: 12
      tools:
        read: true
        grep: true
        glob: true
        list: true
        bash: true

defaultTest:
  assert:
    - type: javascript
      value: file://../../assertions/check-authoring-design-spec-contract.js

tests:
  - description: "flow prerequisite - canonical id and existing functional spec required"
    vars:
      scenario: |-
        - The user asks to author a design spec but does not provide a canonical flow ID.
        - In another run, the user provides an ID but docs/functional has no matching spec.
      expect_asks_for_canonical_flow_id: "true"
      expect_requires_existing_flow_spec: "true"
      expect_aborts_when_flow_spec_missing: "true"

  - description: "context gathering - reads flow and related design docs only"
    vars:
      scenario: |-
        - The canonical functional spec exists.
        - docs/design contains several unrelated docs and two docs related by canonical ID, title, sibling flow, or cited artifact.
      expect_reads_canonical_flow_spec: "true"
      expect_searches_related_design_docs: "true"
      expect_reads_only_related_design_docs: "true"
      expect_builds_gap_analysis: "true"

  - description: "drafting gate - gap analysis and brainstorming precede writing"
    vars:
      scenario: |-
        - Related design docs partially cover the flow but miss state and integration decisions.
        - The user asks to start writing immediately.
      expect_presents_gap_before_drafting: "true"
      expect_invokes_brainstorming_with_gap_context: "true"
      expect_keeps_design_below_flow_above_plan: "true"
      expect_updates_design_index_when_present: "true"

  - description: "routing - no-op when covered and plans route elsewhere"
    vars:
      scenario: |-
        - Existing design docs fully cover the flow.
        - The user asks for implementation tasks after the design review.
      expect_stops_when_no_design_gap_exists: "true"
      expect_routes_implementation_plans_to_writing_plans: "true"
      expect_supports_claude_code_and_codex: "true"
```

- [ ] **Step 5: Add doc routing eval**

Add an eval prompt and assertion that checks:

- flow docs route to `authoring-functional-spec`
- design specs route to `authoring-design-spec`
- design specs require an existing canonical functional spec
- each skill owns its own standalone routing and negative-boundary cases
- user guides route to `authoring-user-guide` inside the `authoring-user-guide` package
- prompt-writing routes to `writing-ai-prompts` inside the `writing-ai-prompts`
  package

- [ ] **Step 6: Add root eval scripts**

Root `package.json` should expose:

```json
{
  "scripts": {
    "eval": "npm --prefix tests/evals run eval",
    "eval:authoring-functional-spec": "npm --prefix tests/evals run eval:authoring-functional-spec",
    "eval:authoring-design-spec": "npm --prefix tests/evals run eval:authoring-design-spec",
    "eval:authoring-user-guide": "npm --prefix tests/evals run eval:authoring-user-guide",
    "eval:writing-ai-prompts": "npm --prefix tests/evals run eval:writing-ai-prompts",
    "eval:coverage": "npm --prefix tests/evals run eval:coverage"
  }
}
```

- [ ] **Step 7: Update coverage baseline**

Create `tests/evals/skill-eval-coverage-baseline.json` with only intentionally
uncovered skills:

```json
{
  "uncovered_skills": []
}
```

No skill should appear in the baseline once all four skills have standalone eval
packages.

- [ ] **Step 8: Run coverage gate**

Run:

```bash
npm --prefix tests/evals run eval:coverage
```

Expected: PASS with intentional uncovered skills listed in
`skill-eval-coverage-baseline.json`.

---

### Task 7: Verification

**Files:**
- No expected source changes.

- [ ] **Step 1: Run Python tests**

Run:

```bash
python3 -m pytest -q
```

Expected: all tests pass.

- [ ] **Step 2: Run manifest validation**

Run:

```bash
python3 scripts/validate_plugin_manifests.py
```

Expected: `Plugin manifests are valid.`

- [ ] **Step 3: Run version bump check**

Run:

```bash
python3 scripts/check_plugin_version_bump.py --base-ref origin/main
```

Expected: `Plugin version bump is valid.`

- [ ] **Step 4: Run shared-runtime scan**

Run:

```bash
rg -n 'Skill\("|`Read` them|WebFetch|mcp__read|Spawn an `Explore` sub-agent' skills
```

Expected: no output.

- [ ] **Step 5: Run targeted evals when provider runtime is available**

Run:

```bash
npm run eval:authoring-functional-spec
npm run eval:authoring-design-spec
npm run eval:authoring-user-guide
npm run eval:writing-ai-prompts
```

Expected: Promptfoo evals pass. If OpenCode/provider credentials are not
configured, capture the exact failure and keep the harness and coverage gate
passing.

---

## Self-Review

**Spec coverage:** This plan covers every discussed change: copied functional-spec
authoring, `authoring-design-spec` naming, canonical-flow prerequisite, related
design-spec gap analysis, brainstorming handoff payload, user-guide separation,
implementation-plan routing to `superpowers:writing-plans`, eval harness, and
Claude Code/Codex compatibility.

**Placeholder scan:** No placeholder task remains. The only decision left open
is when to remove module-spec skills.

**Type/name consistency:** The active taxonomy consistently uses
`authoring-functional-spec`, `authoring-design-spec`, `authoring-user-guide`,
`writing-ai-prompts`, and `superpowers:writing-plans`.
