# Real User Evals and Skill Overfit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make doc-skills evals simulate realistic user prompts and catch overfit behavior in the eval harness and skill text.

**Architecture:** Add deterministic harness tests that reject all-true classifiers, meta-test scenario prose for realistic user prompts, then revise eval scenarios and assertions so each skill package has positive and negative behavioral pressure. Keep skill edits narrow: generalize overfit user-guide repo assumptions and remove remaining explicit chain-of-thought-adjacent wording from prompt-writing guidance.

**Tech Stack:** Node.js `node:test`, Promptfoo YAML packages, JavaScript assertion callbacks, Markdown skill docs, `qwen3.6-plus` via the existing OpenCode CLI provider.

---

## File Structure

- Modify `tests/evals/scripts/eval-harness-contract.test.js`
  - Add deterministic contract tests for scenario realism and assertion discrimination.
- Modify `tests/test_eval_gap_coverage.py`
  - Extend Python coverage checks to inspect package scenario text, not only prompt templates.
- Modify `tests/evals/assertions/check-authoring-functional-spec-contract.js`
  - Preserve static non-negotiable anchors, but ensure expected false values are evaluated and add helper-level regression coverage through tests.
- Modify `tests/evals/assertions/check-authoring-design-spec-contract.js`
  - Same expected false behavior and static-anchor cleanup.
- Modify `tests/evals/assertions/check-authoring-user-guide-contract.js`
  - Same expected false behavior and update static anchors after skill generalization.
- Modify `tests/evals/assertions/check-writing-ai-prompts-contract.js`
  - Same expected false behavior and add static contradiction guard for the remaining reasoning wording.
- Modify `tests/evals/packages/authoring-functional-spec/skill-authoring-functional-spec.yaml`
  - Split routing near-misses into natural user prompts and add negative expectations.
- Modify `tests/evals/packages/authoring-design-spec/skill-authoring-design-spec.yaml`
  - Split routing near-misses into natural user prompts and add negative expectations.
- Modify `tests/evals/packages/authoring-user-guide/skill-authoring-user-guide.yaml`
  - Add realistic non-VD-Studio and “docs exist but integration files absent” scenarios.
- Modify `tests/evals/packages/writing-ai-prompts/skill-writing-ai-prompts.yaml`
  - Add realistic prompt-writing negatives and an explicit no-hidden-CoT pressure scenario.
- Modify `skills/authoring-user-guide/SKILL.md`
  - Generalize repo-specific VitePress/help URL/HelpIcon behavior to “when present” repo conventions, unless the repo clearly matches VD Studio.
- Modify `skills/writing-ai-prompts/SKILL.md`
  - Replace “Think through this carefully before answering” with concise rationale / assumptions / checks guidance.

---

### Task 1: Add Deterministic Overfit Regression Tests

**Files:**
- Modify: `tests/evals/scripts/eval-harness-contract.test.js`

- [ ] **Step 1: Add helper functions for loading assertion modules and YAML text**

Add these helpers below `walkYaml`:

```js
function loadAssertion(relativePath) {
  return require(path.join(EVAL_ROOT, relativePath));
}

function assertionContext(vars) {
  return { vars };
}

function allTruePayload(fields) {
  return JSON.stringify(
    Object.fromEntries(fields.map((field) => [field, true])),
  );
}
```

- [ ] **Step 2: Add a failing all-true classifier test**

Append this test:

```js
test('eval assertions reject all-true outputs when a scenario expects false', () => {
  const cases = [
    {
      assertion: 'assertions/check-authoring-functional-spec-contract.js',
      vars: {
        expect_routes_functional_docs_to_authoring_functional_spec: 'false',
        expect_rejects_design_specs: 'true',
      },
    },
    {
      assertion: 'assertions/check-authoring-design-spec-contract.js',
      vars: {
        expect_routes_design_specs_to_authoring_design_spec: 'false',
        expect_rejects_functional_spec_authoring: 'true',
      },
    },
    {
      assertion: 'assertions/check-authoring-user-guide-contract.js',
      vars: {
        expect_routes_user_guides_to_authoring_user_guide: 'false',
        expect_rejects_design_specs: 'true',
      },
    },
    {
      assertion: 'assertions/check-writing-ai-prompts-contract.js',
      vars: {
        expect_routes_prompt_writing_to_writing_ai_prompts: 'false',
        expect_rejects_user_guides: 'true',
      },
    },
  ];

  for (const testCase of cases) {
    const assertion = loadAssertion(testCase.assertion);
    const fields = Object.keys(testCase.vars).map((name) => name.replace(/^expect_/, ''));
    const result = assertion(allTruePayload(fields), assertionContext(testCase.vars));

    assert.equal(result.pass, false, `${testCase.assertion} should reject all-true output`);
  }
});
```

- [ ] **Step 3: Add a failing scenario-realism test**

Append this test:

```js
test('eval scenarios keep user prompts realistic and put fixtures in workspace context', () => {
  const packageFiles = walkYaml(path.join(EVAL_ROOT, 'packages'));
  const forbiddenScenarioPhrases = [
    'Nearby prompts that should route elsewhere',
    'should route elsewhere',
    'In a separate run',
    'The skill should',
    'Skill contract:',
  ];

  for (const filePath of packageFiles) {
    const relativePath = path.relative(EVAL_ROOT, filePath);
    const text = fs.readFileSync(filePath, 'utf8');

    for (const phrase of forbiddenScenarioPhrases) {
      assert.equal(
        text.includes(phrase),
        false,
        `${relativePath} uses meta-eval phrasing: ${phrase}`,
      );
    }
  }
});
```

- [ ] **Step 4: Run test to verify it fails before eval edits**

Run:

```bash
cd tests/evals
npm run test:eval-harness-contract
```

Expected: FAIL because current YAML contains `Nearby prompts that should route elsewhere`. The all-true test may pass immediately because the assertion loop already honors explicit false values; the scenario-realism test must fail.

- [ ] **Step 5: Commit the failing regression tests**

```bash
git add tests/evals/scripts/eval-harness-contract.test.js
git commit -m "test: expose eval overfit gaps"
```

---

### Task 2: Strengthen Python Coverage Checks for Scenario Realism

**Files:**
- Modify: `tests/test_eval_gap_coverage.py`

- [ ] **Step 1: Add package scenario helper**

Add below `assert_prompt_is_user_grounded`:

```python
def assert_scenarios_are_user_grounded(config):
    forbidden = [
        "Nearby prompts that should route elsewhere",
        "should route elsewhere",
        "In a separate run",
        "Skill contract:",
        "The skill should",
        "Classify whether",
    ]
    leaked = [phrase for phrase in forbidden if phrase in config]
    assert not leaked, f"eval scenarios leak meta-test language: {leaked}"
```

- [ ] **Step 2: Call the helper in every package coverage test**

Add `assert_scenarios_are_user_grounded(config)` after `assert_prompt_is_user_grounded(prompt)` in:

```python
test_authoring_functional_spec_eval_covers_flow_selection_and_traceability
test_authoring_design_spec_eval_covers_code_and_related_design_selection
test_authoring_user_guide_eval_covers_standalone_routing_and_ui_grounding
test_writing_ai_prompts_eval_covers_standalone_routing_and_prompt_safety
```

- [ ] **Step 3: Run test to verify it fails before YAML edits**

Run:

```bash
pytest tests/test_eval_gap_coverage.py -q
```

Expected: FAIL with `eval scenarios leak meta-test language`.

- [ ] **Step 4: Commit the Python coverage guard**

```bash
git add tests/test_eval_gap_coverage.py
git commit -m "test: check eval scenario realism"
```

---

### Task 3: Rewrite Routing Scenarios as Natural User Prompts

**Files:**
- Modify: `tests/evals/packages/authoring-functional-spec/skill-authoring-functional-spec.yaml`
- Modify: `tests/evals/packages/authoring-design-spec/skill-authoring-design-spec.yaml`
- Modify: `tests/evals/packages/authoring-user-guide/skill-authoring-user-guide.yaml`
- Modify: `tests/evals/packages/writing-ai-prompts/skill-writing-ai-prompts.yaml`

- [ ] **Step 1: Replace functional-spec routing scenario**

Replace the first test in `authoring-functional-spec` with separate natural scenarios:

```yaml
  - description: "routes functional spec request to authoring-functional-spec"
    vars:
      scenario: |-
        User prompt:
        "Create the functional spec for flow intent-user-data-mart-build. I want the behavior and acceptance rules under docs/functional, not a design doc yet."
      expect_routes_functional_docs_to_authoring_functional_spec: "true"
      expect_rejects_design_specs: "false"
      expect_rejects_implementation_plans: "false"
      expect_rejects_user_guides: "false"
      expect_rejects_prompt_writing_requests: "false"

  - description: "rejects design doc request as functional spec work"
    vars:
      scenario: |-
        User prompt:
        "Write the technical design for intent-user-data-mart-build. The functional spec already exists."
      expect_routes_functional_docs_to_authoring_functional_spec: "false"
      expect_rejects_design_specs: "true"

  - description: "rejects implementation plan request as functional spec work"
    vars:
      scenario: |-
        User prompt:
        "Turn the intent-user-data-mart-build functional spec into implementation tasks."
      expect_routes_functional_docs_to_authoring_functional_spec: "false"
      expect_rejects_implementation_plans: "true"
```

- [ ] **Step 2: Replace design-spec routing scenario**

Replace the first test in `authoring-design-spec` with separate natural scenarios:

```yaml
  - description: "routes design spec request to authoring-design-spec"
    vars:
      scenario: |-
        User prompt:
        "Write the design spec for canonical flow intent-user-data-mart-build. The functional spec already exists; I want the technical design under docs/design."
      expect_routes_design_specs_to_authoring_design_spec: "true"
      expect_rejects_functional_spec_authoring: "false"
      expect_rejects_implementation_plans: "false"
      expect_rejects_user_guides: "false"
      expect_rejects_prompt_writing_requests: "false"

  - description: "rejects functional spec request as design spec work"
    vars:
      scenario: |-
        User prompt:
        "Author the functional spec for intent-user-data-mart-build before we design it."
      expect_routes_design_specs_to_authoring_design_spec: "false"
      expect_rejects_functional_spec_authoring: "true"
```

- [ ] **Step 3: Replace user-guide routing scenario**

Replace the first test in `authoring-user-guide` with:

```yaml
  - description: "routes user guide request to authoring-user-guide"
    vars:
      scenario: |-
        User prompt:
        "Create a user guide page for the domain settings screen under docs/user-guide."
      expect_routes_user_guides_to_authoring_user_guide: "true"
      expect_rejects_functional_spec_authoring: "false"
      expect_rejects_design_specs: "false"
      expect_rejects_implementation_plans: "false"
      expect_rejects_prompt_writing_requests: "false"

  - description: "rejects design spec request as user guide work"
    vars:
      scenario: |-
        User prompt:
        "Write the design spec for the settings domain model."
      expect_routes_user_guides_to_authoring_user_guide: "false"
      expect_rejects_design_specs: "true"
```

- [ ] **Step 4: Replace prompt-writing routing scenario**

Replace the first test in `writing-ai-prompts` with:

```yaml
  - description: "routes prompt-writing request to writing-ai-prompts"
    vars:
      scenario: |-
        User prompt:
        "Help me write a prompt for Claude Code to refactor this module without touching unrelated files."
      expect_routes_prompt_writing_to_writing_ai_prompts: "true"
      expect_rejects_functional_spec_authoring: "false"
      expect_rejects_design_specs: "false"
      expect_rejects_implementation_plans: "false"
      expect_rejects_user_guides: "false"

  - description: "rejects user-guide request as prompt-writing work"
    vars:
      scenario: |-
        User prompt:
        "Document this screen for users in docs/user-guide."
      expect_routes_prompt_writing_to_writing_ai_prompts: "false"
      expect_rejects_user_guides: "true"
```

- [ ] **Step 5: Run deterministic checks**

Run:

```bash
cd tests/evals
npm run test:eval-harness-contract
cd ../..
pytest tests/test_eval_gap_coverage.py -q
```

Expected: PASS for both deterministic checks.

- [ ] **Step 6: Commit routing scenario cleanup**

```bash
git add tests/evals/packages tests/evals/scripts/eval-harness-contract.test.js tests/test_eval_gap_coverage.py
git commit -m "test: make routing evals use natural prompts"
```

---

### Task 4: Add Realistic Negative and Ambiguous Scenarios Per Skill

**Files:**
- Modify: `tests/evals/packages/authoring-functional-spec/skill-authoring-functional-spec.yaml`
- Modify: `tests/evals/packages/authoring-design-spec/skill-authoring-design-spec.yaml`
- Modify: `tests/evals/packages/authoring-user-guide/skill-authoring-user-guide.yaml`
- Modify: `tests/evals/packages/writing-ai-prompts/skill-writing-ai-prompts.yaml`

- [ ] **Step 1: Add functional-spec duplicate/edit scenario**

Append:

```yaml
  - description: "existing functional spec - edits canonical file instead of creating a second FS"
    vars:
      scenario: |-
        User prompt:
        "The FS for intent-user-data-mart-build already exists, but it is stale. Update it instead of making a new version."

        Workspace context:
        docs/functional/intent-user-data-mart-build/README.md exists in the repo named by the User-Flows sheet.
      expect_updates_existing_spec_in_place: "true"
      expect_never_creates_duplicate_functional_spec: "true"
      expect_functional_spec_lives_in_sheet_repo: "true"
```

- [ ] **Step 2: Add design-spec covered/no-op scenario with negative creation pressure**

Append:

```yaml
  - description: "covered design - refuses duplicate design doc when existing docs already cover the flow"
    vars:
      scenario: |-
        User prompt:
        "Check whether this flow already has design coverage. If it does, don't create another design doc just to have one."

        Workspace context:
        The canonical functional spec exists. Existing design docs cover every behavior, state, and source-file anchor needed for the flow.
      expect_stops_when_no_design_gap_exists: "true"
      expect_presents_gap_before_drafting: "false"
```

- [ ] **Step 3: Add user-guide generic repo scenario**

Append:

```yaml
  - description: "generic docs repo - follows local guide conventions when VD Studio wiring is absent"
    vars:
      scenario: |-
        User prompt:
        "Add a user guide for the account settings page."

        Workspace context:
        The repo has docs/user-guide/ and React screen components, but no docs/.vitepress/config.ts, no src/lib/help-urls.ts, and no HelpIcon component.
      expect_routes_user_guides_to_authoring_user_guide: "true"
      expect_studies_ui_source_before_drafting: "true"
      expect_uses_exact_ui_labels: "true"
      expect_updates_vitepress_sidebar: "false"
      expect_updates_help_url_mapping: "false"
      expect_checks_or_adds_help_icon: "false"
```

- [ ] **Step 4: Add prompt-writing non-prompt scenario**

Append:

```yaml
  - description: "direct answer request - does not force prompt-writing skill"
    vars:
      scenario: |-
        User prompt:
        "Explain how this function works. I am not asking you to write a prompt."
      expect_routes_prompt_writing_to_writing_ai_prompts: "false"
```

- [ ] **Step 5: Run deterministic checks**

Run:

```bash
cd tests/evals
npm run test:eval-harness-contract
cd ../..
pytest tests/test_eval_gap_coverage.py -q
```

Expected: PASS.

- [ ] **Step 6: Commit new negative scenarios**

```bash
git add tests/evals/packages tests/evals/scripts/eval-harness-contract.test.js tests/test_eval_gap_coverage.py
git commit -m "test: add realistic negative skill evals"
```

---

### Task 5: Generalize `authoring-user-guide` Without Losing VD Studio Support

**Files:**
- Modify: `skills/authoring-user-guide/SKILL.md`
- Modify: `tests/evals/assertions/check-authoring-user-guide-contract.js`

- [ ] **Step 1: Replace hardcoded standards with convention discovery**

Replace the `## Standards` section with:

```markdown
## Standards

- User guides live under `docs/user-guide/`.
- First discover the repo's local documentation conventions:
  - sidebar or nav config, such as `docs/.vitepress/config.ts`, when present
  - route-to-help mapping files, such as `src/lib/help-urls.ts`, when present
  - reusable help-link components, such as `src/components/ui/HelpIcon.tsx`, when present
  - design documentation under `docs/design/` that explains the docs architecture
- If a convention file is absent, do not invent it. Write the guide page and report
  that the repo has no matching integration point.
```

- [ ] **Step 2: Replace fixed page tree with local structure discovery**

Replace the file tree block in Step 1 with:

```markdown
   - Follow the existing `docs/user-guide/` structure when pages already exist.
   - Prefer one screen or one user task per page.
   - If no structure exists, use a simple path based on the screen or feature
     name, for example `docs/user-guide/settings/domains.md`.
```

- [ ] **Step 3: Make closeout integrations conditional**

Replace steps 6-8 in `## Flow` with:

```markdown
6. **Update docs navigation when present** — if the repo has a sidebar/nav config
   such as `docs/.vitepress/config.ts`, ensure it includes the new page.

7. **Update help URL mapping when present** — if the repo has a route-to-help
   mapping such as `src/lib/help-urls.ts`, map the relevant route/component to
   the guide URL.

8. **Add or update help entry points when present** — if the target screen uses
   a reusable help-link component such as `<HelpIcon>`, ensure it points to the
   guide. Do not create a new help-link architecture in repos that do not already
   have one.
```

- [ ] **Step 4: Generalize audience wording**

Replace writing principle 1 with:

```markdown
1. **User audience**: Readers are product users trying to complete a task. Match
   the repo's product domain and avoid assuming internal implementation knowledge.
```

- [ ] **Step 5: Update assertion static anchors**

In `check-authoring-user-guide-contract.js`, replace hard requirements for exact VD Studio files with conditional wording anchors:

```js
const required = [
  'name: authoring-user-guide',
  'Use when creating or updating end-user help pages',
  'docs/user-guide/',
  'Functional specs',
  'Design specs',
  'Implementation plans',
  'AI prompt-writing requests',
  'update if exists',
  'Inspect the relevant React components',
  'EXACT text from the source code',
  'No code',
  'sidebar or nav config',
  'route-to-help mapping',
  'help-link component',
  'Do not create a new help-link architecture',
];
```

- [ ] **Step 6: Run user-guide deterministic checks**

Run:

```bash
cd tests/evals
npm run test:eval-harness-contract
cd ../..
pytest tests/test_eval_gap_coverage.py -q
```

Expected: PASS.

- [ ] **Step 7: Commit user-guide generalization**

```bash
git add skills/authoring-user-guide/SKILL.md tests/evals/assertions/check-authoring-user-guide-contract.js tests/evals/packages/authoring-user-guide/skill-authoring-user-guide.yaml
git commit -m "fix: reduce user guide skill overfit"
```

---

### Task 6: Remove Remaining Prompt-Writing CoT Contradiction

**Files:**
- Modify: `skills/writing-ai-prompts/SKILL.md`
- Modify: `tests/evals/assertions/check-writing-ai-prompts-contract.js`
- Modify: `tests/test_eval_gap_coverage.py`

- [ ] **Step 1: Replace the contradictory diagnostic line**

In `skills/writing-ai-prompts/SKILL.md`, replace:

```markdown
- Logic or analysis task with no step-by-step → add "Think through this carefully before answering"
```

with:

```markdown
- Logic or analysis task with no reasoning support → ask for a concise rationale,
  key assumptions, verification checks, and final answer without revealing hidden
  chain-of-thought
```

- [ ] **Step 2: Add static contradiction guard**

In `check-writing-ai-prompts-contract.js`, add this check inside `staticContradictionReason()`:

```js
if (content.includes('Think through this carefully before answering')) {
  return 'Prompt-writing skill still recommends explicit reasoning process wording';
}
```

- [ ] **Step 3: Add Python guard**

In `test_writing_ai_prompts_skill_has_no_question_count_or_cot_contradiction`, add:

```python
assert "Think through this carefully before answering" not in skill
assert "without revealing hidden" in skill
```

- [ ] **Step 4: Run deterministic tests**

Run:

```bash
cd tests/evals
npm run test:eval-harness-contract
cd ../..
pytest tests/test_eval_gap_coverage.py -q
```

Expected: PASS.

- [ ] **Step 5: Commit prompt-writing cleanup**

```bash
git add skills/writing-ai-prompts/SKILL.md tests/evals/assertions/check-writing-ai-prompts-contract.js tests/test_eval_gap_coverage.py
git commit -m "fix: remove prompt reasoning contradiction"
```

---

### Task 7: Run Targeted Promptfoo Evals and Final Verification

**Files:**
- No source edits expected.

- [ ] **Step 1: Run deterministic eval harness tests**

Run:

```bash
cd tests/evals
npm run test:eval-harness-contract
npm run test:opencode-cli-provider
cd ../..
pytest tests/test_eval_gap_coverage.py -q
```

Expected:
- Node tests PASS.
- Python test PASS.

- [ ] **Step 2: Run changed Promptfoo eval packages**

Run:

```bash
cd tests/evals
npm run eval:authoring-functional-spec
npm run eval:authoring-design-spec
npm run eval:authoring-user-guide
npm run eval:writing-ai-prompts
npm run eval:coverage
```

Expected:
- All package evals pass on `qwen3.6-plus`.
- Coverage reports `4/4 skills have eval packages`.

- [ ] **Step 3: Inspect worktree**

Run:

```bash
git status --short
git diff --stat origin/main...HEAD
```

Expected:
- Only planned files changed.
- Diff stat is limited to skills, eval assertions, eval YAMLs, and tests.

- [ ] **Step 4: Final commit if any verification-only changes remain**

If the previous tasks left uncommitted edits:

```bash
git add skills tests docs/superpowers/plans/2026-04-26-real-user-evals-and-skill-overfit.md
git commit -m "test: tighten skill eval realism"
```

- [ ] **Step 5: Push branch**

Run:

```bash
git push
```

Expected: branch pushes successfully.

---

## Self-Review

- Spec coverage: The plan covers all identified gaps: all-true eval loophole, meta-test scenario wording, realistic negative scenarios, user-guide repo overfit, prompt-writing CoT contradiction, and final Qwen Promptfoo verification.
- Placeholder scan: No steps rely on “TBD,” unspecified tests, or vague “handle edge cases” language.
- Type consistency: Helper names and file paths are consistent across Node and Python tests.
