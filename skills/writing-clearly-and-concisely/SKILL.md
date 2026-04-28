---
name: writing-clearly-and-concisely
description: Use when writing or tightening prose for functional specs, design documents, user guides, or implementation plans, especially when draft text is wordy, vague, passive, duplicative, or hard to scan. Do not use for AI prompt-writing, code comments, commit messages, general chat, or unrelated prose.
---

# Writing Clearly and Concisely

Use this skill to improve prose quality in documentation deliverables:

- Functional specs
- Design documents
- User guides
- Implementation plans

This is a style pass, not a routing replacement. If the user is asking to author a
functional spec, design spec, user guide, or implementation plan from scratch,
use the owning workflow first, then apply this skill to the prose.

## Core Rules

1. Preserve meaning, scope, requirements, and document structure.
2. Make the writing direct: prefer active voice and concrete nouns.
3. Cut filler, throat-clearing, repeated qualifiers, and needless transitions.
4. Keep each paragraph focused on one point.
5. Use parallel structure for repeated bullets, steps, and acceptance criteria.
6. Replace vague claims with specific behavior or evidence when the source
   material supports it.
7. Do not flatten product, architecture, or implementation nuance just to make a
   sentence shorter.

## Working Pattern

1. Identify the document type and its required structure.
2. Read the surrounding context before rewriting a section.
3. Tighten sentences while preserving headings, frontmatter, tables, links, IDs,
   acceptance criteria, and source references.
4. Check that the edited text still says the same thing and still routes to the
   same downstream workflow.
5. For tricky usage or composition questions, consult
   `references/elements-of-style.md`.

## Boundaries

- Do not use this for AI prompt-writing requests; use `writing-ai-prompts`.
- Do not use this for code comments, commit messages, release notes, emails, or
  general chat unless the user explicitly asks to apply this style skill there.
- Do not use it to invent missing requirements, design decisions, UX behavior, or
  implementation details.
- Do not remove required traceability, caveats, constraints, or unresolved gaps.

## Upstream Attribution

This skill is adapted from
`https://github.com/obra/the-elements-of-style/tree/main/skills/writing-clearly-and-concisely`.
The bundled reference file is William Strunk Jr.'s 1918 public-domain
_The Elements of Style_ text from that upstream skill.
