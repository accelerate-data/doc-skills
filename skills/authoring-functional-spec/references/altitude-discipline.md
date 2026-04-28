# Writing the Draft — Altitude Discipline

Keep every sentence at behavioral level. Apply the altitude test when writing any section.

## Altitude test

> *"Could a competent engineer using an agentic coding tool build this differently from what I'm describing, and still be correct?"*

If **yes**, altitude is correct. If **no**, cut the prescriptive detail or move it to a downstream spec.

## Must not document

- UI layout, visual design, styling, component structure.
- Copywriting, interaction microdetails.
- Specific event names, payload schemas, label strings, column names, signal identifiers.
- Exact retry counts, iteration limits, timeout values.
- Internal state machines of implementation components.
- File paths, class names, API shapes, code snippets.

## Exception classes

Cite a specific name only when it falls into one of these:

1. **Existing production artifacts** — data structures, protocol blocks, file conventions, or runtimes already in code (e.g. `vd-meta` block, `intent.md`, `vd-monitoring-agents` runtime).
2. **Canonical sibling flow IDs** — when describing what this flow excludes or what upstream/downstream flows own (e.g. `alert-fire-route`, `operate-diagnosis-agent`).
3. **Already-cited artifacts** — if a prior spec version cited an artifact by name and it still maps to reality, preserve the reference.

Anything else that looks like a specific name is an illustrative example, not a prescription — state that explicitly.
