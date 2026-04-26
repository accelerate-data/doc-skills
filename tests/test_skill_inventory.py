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
    assert skill_dirs() == {
        "authoring-functional-spec",
        "authoring-design-spec",
        "write-user-guide",
        "writing-ai-prompts",
    }


def test_shared_skills_avoid_claude_only_runtime_instructions() -> None:
    forbidden = [
        'Skill("',
        "`Read` them",
        "WebFetch",
        "mcp__read",
        "Spawn an `Explore` sub-agent",
    ]
    for skill in skill_dirs():
        content = (SKILLS / skill / "SKILL.md").read_text(encoding="utf-8")
        for phrase in forbidden:
            assert phrase not in content, (
                f"{skill} contains shared-runtime-only forbidden phrase: {phrase}"
            )
