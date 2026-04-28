# Brainstorm Discipline

## Brainstorm rules

- Enumerate the tentative behavioral model before asking the first question
- Ask one question at a time; prefer multiple choice when the answer is not obvious
- Align with sibling specs before drafting
- When a behavioral gap has more than one valid resolution, present the options before choosing
- Confirm each major behavioral assumption before moving to the next
- Brainstorm inline — do not hand off to `superpowers:brainstorming`

## Spec clarity

- One invocation = one canonical ID; flag and decompose if the request spans multiple IDs
- Each section: one clear purpose, independently understandable
- Each section must answer: what behavior, how it connects, what it depends on — unclear = wrong boundary
- Section doing double duty = scope or altitude problem — split or cut
- Spec must be readable without implementation knowledge; sentences that require it are too low
- YAGNI: omit sections that genuinely do not apply — absence means not applicable
- Gap surfaced during review? Return to Phase 5 — no placeholder prose

## Hard gate

Do not proceed to drafting until every gap and ambiguity is resolved.

## Behavioral summary format

Write this before prompting the user for Phase 6 approval:

- Agreed shape and persona
- Key behavioral assumptions confirmed
- Sections that will be included and why
- Open Questions remaining (tagged `[design]`)
