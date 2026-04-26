from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read(relative_path):
    return (ROOT / relative_path).read_text(encoding="utf-8")


def assert_contains_all(content, phrases):
    missing = [phrase for phrase in phrases if phrase not in content]
    assert not missing, f"missing expected coverage phrases: {missing}"


def assert_prompt_is_user_grounded(prompt):
    forbidden = [
        "Skill contract:",
        "The skill should",
        "Classify whether",
    ]
    leaked = [phrase for phrase in forbidden if phrase in prompt]
    assert not leaked, f"eval prompt leaks contract language: {leaked}"


def test_authoring_functional_spec_eval_covers_flow_selection_and_traceability():
    config = read(
        "tests/evals/packages/authoring-functional-spec/"
        "skill-authoring-functional-spec.yaml"
    )
    prompt = read("tests/evals/prompts/skill-authoring-functional-spec.txt")
    assertion = read(
        "tests/evals/assertions/check-authoring-functional-spec-contract.js"
    )
    assert_prompt_is_user_grounded(prompt)

    assert_contains_all(
        config,
        [
            "candidate selection",
            "repo-filtered candidate IDs",
            "code-grounded behavior",
            "sibling flows and production artifacts",
        ],
    )
    assert_contains_all(
        prompt + assertion,
        [
            "one_flow_one_functional_spec_many_design_docs",
            "routes_functional_docs_to_authoring_functional_spec",
            "rejects_design_specs",
            "rejects_implementation_plans",
            "rejects_user_guides",
            "rejects_prompt_writing_requests",
            "functional_spec_lives_in_sheet_repo",
            "updates_existing_spec_in_place",
            "never_creates_duplicate_functional_spec",
            "primary_code_expected_in_sheet_repo",
            "requires_user_override_for_secondary_repo_code",
            "lists_candidate_ids_for_current_repo",
            "uses_code_only_to_ground_behavior",
            "cites_production_artifacts_by_stable_name",
            "preserves_sibling_flow_traceability",
        ],
    )


def test_authoring_design_spec_eval_covers_code_and_related_design_selection():
    config = read(
        "tests/evals/packages/authoring-design-spec/"
        "skill-authoring-design-spec.yaml"
    )
    prompt = read("tests/evals/prompts/skill-authoring-design-spec.txt")
    assertion = read("tests/evals/assertions/check-authoring-design-spec-contract.js")
    assert_prompt_is_user_grounded(prompt)

    assert_contains_all(
        config,
        [
            "child functional spec",
            "multiple related design docs",
            "source-file grounding",
            "unrelated docs",
        ],
    )
    assert_contains_all(
        prompt + assertion,
        [
            "one_flow_one_functional_spec_many_design_docs",
            "routes_design_specs_to_authoring_design_spec",
            "rejects_functional_spec_authoring",
            "rejects_implementation_plans",
            "rejects_user_guides",
            "rejects_prompt_writing_requests",
            "design_doc_lives_in_sheet_repo",
            "verifies_current_repo_matches_sheet_repo",
            "confirms_before_functional_spec_update",
            "updates_existing_functional_spec_in_place",
            "never_creates_duplicate_functional_spec",
            "primary_code_expected_in_sheet_repo",
            "requires_user_override_for_secondary_repo_code",
            "resolves_child_functional_spec_by_frontmatter_id",
            "selects_related_design_docs_by_multiple_signals",
            "ignores_unrelated_design_docs",
            "includes_accurate_source_files_when_code_exists",
            "states_when_code_missing",
        ],
    )


def test_authoring_user_guide_eval_covers_standalone_routing_and_ui_grounding():
    config = read(
        "tests/evals/packages/authoring-user-guide/"
        "skill-authoring-user-guide.yaml"
    )
    prompt = read("tests/evals/prompts/skill-authoring-user-guide.txt")
    assertion = read("tests/evals/assertions/check-authoring-user-guide-contract.js")
    assert_prompt_is_user_grounded(prompt)

    assert_contains_all(
        config,
        [
            "standalone discovery",
            "target page",
            "source-grounded writing",
            "guide navigation and help link integration",
        ],
    )
    assert_contains_all(
        prompt + assertion,
        [
            "routes_user_guides_to_authoring_user_guide",
            "rejects_functional_spec_authoring",
            "rejects_design_specs",
            "rejects_implementation_plans",
            "rejects_prompt_writing_requests",
            "updates_existing_user_guide_when_present",
            "studies_ui_source_before_drafting",
            "uses_exact_ui_labels",
            "documents_visual_states",
            "excludes_code_and_api_details",
            "updates_vitepress_sidebar",
            "updates_help_url_mapping",
            "checks_or_adds_help_icon",
        ],
    )


def test_writing_ai_prompts_eval_covers_standalone_routing_and_prompt_safety():
    config = read(
        "tests/evals/packages/writing-ai-prompts/"
        "skill-writing-ai-prompts.yaml"
    )
    prompt = read("tests/evals/prompts/skill-writing-ai-prompts.txt")
    assertion = read("tests/evals/assertions/check-writing-ai-prompts-contract.js")
    assert_prompt_is_user_grounded(prompt)
    assert "the skill needs" not in config.lower()
    assert "the skill should" not in config.lower()

    assert_contains_all(
        config,
        [
            "standalone discovery",
            "ambiguous target",
            "output lock",
            "safety boundaries",
        ],
    )
    assert_contains_all(
        prompt + assertion,
        [
            "routes_prompt_writing_to_writing_ai_prompts",
            "rejects_functional_spec_authoring",
            "rejects_design_specs",
            "rejects_implementation_plans",
            "rejects_user_guides",
            "confirms_target_tool_when_ambiguous",
            "confirms_unknown_tool_context_within_limit",
            "limits_clarifying_questions",
            "emits_copyable_prompt_block",
            "emits_tool_template_token_line",
            "emits_strategy_note",
            "adapts_to_target_tool_category",
            "avoids_cot_for_reasoning_native_models",
            "avoids_explicit_cot_in_generated_prompts",
            "avoids_fabricated_prompt_techniques",
        ],
    )


def test_writing_ai_prompts_skill_has_no_question_count_or_cot_contradiction():
    skill = read("skills/writing-ai-prompts/SKILL.md")
    templates = read("skills/writing-ai-prompts/references/templates.md")

    assert "ask these 4 questions" not in skill
    assert "Unknown tool — ask these 4 questions" not in skill
    assert "**Chain of Thought**" not in skill
    assert "Template E — Chain of Thought" not in templates
    assert "Template E - Chain of Thought" not in templates
    assert "<thinking>" not in templates
    assert "Give your final answer in <answer> tags only" not in templates
    assert "Template E - Reasoning Summary" in templates
    assert "Never ask the model to reveal hidden chain-of-thought" in templates
