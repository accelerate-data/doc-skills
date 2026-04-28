# Functional Spec Template

This reference is the template for behavior-focused functional specs under `docs/functional/`. Treat it as a menu, not a section checklist. The authoring skill chooses the sections that fit the subject and omits sections that do not apply. Do not emit `N/A`, `TBD`, or `[describe ...]` placeholders.

## Functional Spec Altitude

See `altitude-discipline.md` for the altitude test and discipline rules.

## Frontmatter

Every spec requires these fields:

```yaml
---
id: <canonical-id>
title: <human-readable title>
shape: <journey | surface | service | skill | install | utility>
persona: <DRE | FSA | CDO | CloudOps>
# Optional only when applicable:
# renamed-from: <previous-id>
# absorbs:
#   - <prior-id>
---
```

`shape` lives only in the spec file. The User-Flows-Details Sheet has no shape column and the skill does not validate shape against Sheet category.

Do not add date fields, review-date fields, document version fields, or SHA fields to frontmatter. Functional spec provenance comes from git history: commits, tags, and commit SHAs.

`persona` is single-valued. Choose the persona whose work or outcome is most directly affected by the spec's behavior:

- `DRE` — data reliability or operations outcome owner.
- `FSA` — field solution / implementation outcome owner; AE and DE roll up here.
- `CDO` — business or governance outcome owner.
- `CloudOps` — platform, deployment, install, or operations owner.

Pre-v0.2 specs may contain older persona values. Do not migrate them as part of normal authoring.

## Expected Sections

These sections are expected in nearly every spec when they apply:

```markdown
# <Title> (`<canonical-id>`)

## Goal

## Inputs

## Outputs

## Invariants

## Cross-refs
```

If one genuinely does not apply, omit it. Absence means not applicable; it is not a failed checklist.

## Shape Menus

Read `shape-lenses.md` and use the matching shape section. Section names in the final body are author-chosen; the menu is guidance, not an enforced vocabulary.

## File Layout

The main spec lives at:

```text
docs/functional/<canonical-id>/README.md
```

Child pages may live alongside the README for supporting material — high-level design context, UI detail, or reference sketches that would lower the altitude of the main spec. Child pages are author-managed and are not authored or reviewed by this skill.

## Labels, Tags, and Signal Names

See `altitude-discipline.md` for the three exception classes that allow citing a specific name by value.


