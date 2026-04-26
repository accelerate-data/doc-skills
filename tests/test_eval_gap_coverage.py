from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read(relative_path):
    return (ROOT / relative_path).read_text(encoding="utf-8")


def assert_contains_all(content, phrases):
    missing = [phrase for phrase in phrases if phrase not in content]
    assert not missing, f"missing expected coverage phrases: {missing}"


def test_authoring_functional_spec_eval_covers_flow_selection_and_traceability():
    config = read(
        "tests/evals/packages/authoring-functional-spec/"
        "skill-authoring-functional-spec.yaml"
    )
    prompt = read("tests/evals/prompts/skill-authoring-functional-spec.txt")
    assertion = read(
        "tests/evals/assertions/check-authoring-functional-spec-contract.js"
    )

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
