# Review Discipline

## Tiers

| Tier | What to address |
|---|---|
| **Hard stops** (fix before showing user) | Altitude violations · scope violations · repo mismatch |
| **Polish** (clean up) | Open Questions · frontmatter consistency · completeness |

## Altitude test

Apply to every paragraph:

> *"Could a competent engineer using an agentic coding tool build this differently from what I'm describing, and still be correct?"*

If **yes**, altitude is correct. If **no**, cut or move the prescriptive detail.

## Self-review checklist

- **Altitude scan:** apply the altitude test to every paragraph; cut anything that fails.
- **Business rules vs invariants:** kept separate? A business rule is an editable behavioral parameter; an invariant is a guarantee that must hold regardless of execution path. Combining them hides invariants.
- **Events / observability:** kind-level only — no event names, payload fields, or catalog schemas.
- **Open Questions:** each tagged `[product]` or `[design]`; product-tagged resolved before Phase 6; design-tagged may remain.
- **Placeholder scan:** any "TBD", "TODO", or vague requirements? Fix them.
- **Internal consistency:** do sections contradict each other?
- **Scope check:** one canonical ID, or needs decomposition?
- **Ambiguity:** any requirement interpretable two ways? Pick one.
