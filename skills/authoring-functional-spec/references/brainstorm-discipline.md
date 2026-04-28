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

## Design for isolation and clarity:

- Break the system into smaller units that each have one clear purpose, communicate through well-defined interfaces, and can be understood and tested independently
- For each unit, you should be able to answer: what does it do, how do you use it, and what does it depend on?
- Can someone understand what a unit does without reading its internals? Can you change the internals without breaking consumers? If not, the boundaries need work.
- Smaller, well-bounded units are also easier for you to work with - you reason better about code you can hold in context at once, and your edits are more reliable when files are focused. When a file grows large, that's often a signal that it's doing too much.

## Working in existing codebases:

- Explore the current structure before proposing changes. Follow existing patterns.
- Where existing code has problems that affect the work (e.g., a file that's grown too large, unclear boundaries, tangled responsibilities), include targeted improvements as part of the design - the way a good developer improves code they're working in.
- Don't propose unrelated refactoring. Stay focused on what serves the current goal.

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
