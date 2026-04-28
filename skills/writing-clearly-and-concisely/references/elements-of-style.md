# Clear and Concise Documentation Style

This reference adapts a small set of useful principles from William Strunk Jr.'s
1918 public-domain _The Elements of Style_ for modern documentation work. Use it
as a style lens for functional specs, design documents, user guides, and
implementation plans.

## Principles

### Use Active Voice

Prefer sentences where the actor and action are clear.

- Weak: The deployment can be started by the operator.
- Better: The operator starts the deployment.

Passive voice is still useful when the actor is unknown, unimportant, or less
important than the state.

### Use Concrete Language

Replace vague claims with specific behavior when the source material supports it.

- Weak: The system handles bad states better.
- Better: The system blocks promotion when validation has not passed.

Do not invent specificity. If the source material does not prove the detail,
preserve the uncertainty or mark the gap.

### Omit Needless Words

Cut filler that does not change the meaning.

- Weak: It is important to note that users are able to configure the setting.
- Better: Users can configure the setting.

Do not cut caveats, constraints, acceptance criteria, unresolved gaps, or source
references just to make text shorter.

### Keep Paragraphs Focused

One paragraph should carry one idea. Split paragraphs that mix behavior,
rationale, constraints, and implementation notes.

### Use Parallel Structure

Make repeated bullets, steps, and acceptance criteria follow the same grammar.

- Weak:
  - Users can create checks.
  - Editing existing checks is supported.
  - Disabled checks should not run.
- Better:
  - Users can create checks.
  - Users can edit checks.
  - Users can disable checks.

### Preserve Document Shape

Style edits must preserve headings, frontmatter, IDs, links, tables, acceptance
criteria, traceability, and required workflow gates.

## Attribution

Inspired by
`https://github.com/obra/the-elements-of-style/tree/main/skills/writing-clearly-and-concisely`
and William Strunk Jr.'s 1918 public-domain _The Elements of Style_.
