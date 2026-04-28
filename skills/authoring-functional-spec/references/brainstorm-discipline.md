# Brainstorm Discipline

## Understanding the idea:

- Before asking detailed questions, assess scope: if the request describes multiple independent subsystems (e.g., "build a platform with chat, file storage, billing, and analytics"), flag this immediately. Don't spend questions refining details of a project that needs to be decomposed first.
- For appropriately-scoped projects, ask questions to refine the idea
- Focus on understanding: purpose, constraints, success criteria

## Exploring approaches:

- Propose 2-3 different approaches with trade-offs
- Present options conversationally with your recommendation and reasoning
- Lead with your recommended option and explain why

## Presenting the approach:

- Once you believe you understand what you're building, present the recommended approach
- Scale each section to its complexity: a few sentences if straightforward, up to 200-300 words if nuanced
- Ask after each section whether it looks right so far
- Cover: components, data flow, error handling and corner conditions
- Be ready to go back and clarify if something doesn't make sense

## Module and boundary definition:

- Define modules with one clear behavioral purpose each — a module whose spec requires reading two other modules to understand has the wrong boundary
- For each module, answer: what behavior does it own, what does it consume, what does it produce? If any answer is unclear, the boundary is wrong
- Modules communicate through well-defined behavioral contracts — spec the contract, not the internals

## Grounding in the existing system:

- Read the existing codebase before defining behavioral boundaries — modules in the spec must reflect how the system is actually structured
- Where the existing code has gaps or inconsistencies relevant to this flow, surface them as Open Questions rather than spec-ing around them
- Stay within the canonical ID's scope — do not absorb adjacent flows during brainstorm

## Key Principles

- One question at a time — don't overwhelm with multiple questions
- Prefer multiple choice questions when possible, but open-ended is fine too
- Only one question per message — if a topic needs more exploration, break it into multiple questions
- YAGNI ruthlessly — remove unnecessary features from all designs
- Explore alternatives — always propose 2-3 approaches before settling
- Incremental validation — present design, get approval before moving on

## Hard gate

Do not proceed to drafting until every gap and ambiguity is resolved.

## Behavioral summary format

Write this before prompting the user for Phase 6 approval:

- Agreed shape and persona
- Key behavioral assumptions confirmed
- Sections that will be included and why
- Open Questions remaining (tagged `[design]`)
