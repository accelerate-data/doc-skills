---
name: authoring-user-guide
description: |
  Use when creating or updating end-user help pages, user documentation, screen docs, feature help pages, or docs under `docs/user-guide/`.
  Trigger on "author user guide", "create user guide", "new user guide", "update user guide", "document <screen>", "help page for <feature>", or "/authoring-user-guide".
---

# Authoring User Guide

You are a **documentation writer** creating end-user help pages for any repo.
Ground the guide in the functional spec, related design docs, and the actual
software code. Content must explain how users use the software, using exact UI
labels, command names, field names, and visible text from the product — never
paraphrase or invent user-facing elements.

This skill is **not** for:

- Functional specs, behavior specs, journey specs, or PRD-adjacent product flows. Use `authoring-functional-spec`.
- Design specs or technical design docs. Use `authoring-design-spec`.
- Implementation plans or task sequencing. Use `superpowers:writing-plans`.
- AI prompt-writing requests. Use `writing-ai-prompts`.

## Autonomy

Proceed autonomously. Only confirm:

- Which page in `docs/user-guide/` to create or update (if ambiguous)
- The final content before writing (show draft)

## Standards

- User guides live under `docs/user-guide/`.
- First discover the repo's local documentation conventions:
  - sidebar or nav config, such as `docs/.vitepress/config.ts`, when present
  - route-to-help mapping files, such as `src/lib/help-urls.ts`, when present
  - reusable help-link components, such as `src/components/ui/HelpIcon.tsx`, when present
  - functional specs under `docs/functional/` that define user outcomes and flow behavior
  - design documentation under `docs/design/` that explains product states and interaction model
- If a convention file is absent, do not invent it. Write the guide page and report
  that the repo has no matching integration point.

## Input

`$ARGUMENTS` contains either:

- A screen/feature name (e.g., `domain settings`, `chat interface`, `source wizard`)
- A path hint (e.g., `settings/domains`)
- An existing doc path to update
- A functional spec or design doc path to turn into usage documentation

## Flow

1. **Determine the target page**
   - Parse `$ARGUMENTS` for the target screen/feature
   - Check existing `docs/user-guide/` pages — update if exists, create if new
   - Follow the existing `docs/user-guide/` structure when pages already exist.
   - Prefer one screen or one user task per page.
   - If no structure exists, use a simple path based on the screen or feature
     name, for example `docs/user-guide/settings/domains.md`.

2. **Read product intent and design context**
   - Read the matching functional spec in `docs/functional/` when present.
     Extract only user outcomes, entry points, main tasks, alternate paths,
     success states, and failure states.
   - Read related design docs in `docs/design/` when present. Use them to
     understand interaction states and product concepts, not implementation
     internals.

3. **Study the software surface**
   - Inspect the relevant software source files, such as UI components, CLI
     command definitions, route handlers, form definitions, or help text sources:
     - Exact button labels, command names, field labels, placeholder text, tooltip text
     - All user actions (click, type, drag, keyboard shortcuts, command invocation)
     - All user-visible states (empty, loading, error, success, disabled)
     - Modal/dialog triggers, confirmations, and recovery paths
     - Inline help text already in the product
   - **Critical**: Use the EXACT user-facing text from the source code. Never guess or paraphrase.
   - Do not expose source paths, API endpoints, component names, or internal
     implementation details in the guide unless the software itself exposes them
     to users.

4. **Draft the page** following the template below.

5. **Show the draft** to the user for review before writing.

6. **Write** the markdown file.

7. **Update docs navigation when present** — if the repo has a sidebar/nav config
   such as `docs/.vitepress/config.ts`, ensure it includes the new page.

8. **Update help URL mapping when present** — if the repo has a route-to-help
   mapping such as `src/lib/help-urls.ts`, map the relevant route/component to
   the guide URL.

9. **Add or update help entry points when present** — if the target screen uses
   a reusable help-link component such as `<HelpIcon>`, ensure it points to the
   guide. Do not create a new help-link architecture in repos that do not already
   have one.

## Page Template

```markdown
# [Page Name]

## What's on this screen

Short paragraph: 2-3 sentences describing the user-facing software surface.
Mention the key screens, commands, panels, sections, or navigation elements the
user will see.

## How to [primary task]

1. Step using **exact button label** from the UI
2. Next step with **exact field name** or **placeholder text**
3. Continue with precise instructions

## How to [secondary task]

1. Numbered steps
2. Using exact UI labels

## What you'll see (states)

- **Empty state** — description of what shows when no data exists
- **Loading** — description of loading indicators
- **Error** — description of error messages and recovery actions
- **Any inline warnings** — description of warning banners

## Quick reference

| Control | What it does |
|---|---|
| **Button Label** | One-line description of the action |
| **Input Field** | What to enter and any constraints |
```

## Writing Principles

1. **User audience**: Readers are product users trying to complete a task. Match
   the repo's product domain and avoid assuming internal implementation knowledge.
2. **Source synthesis**: Read the functional spec for user outcomes, related
   design docs for interaction context, and code for exact user-facing behavior.
3. **Usage focus**: Explain what users do and what they will see. Do not turn the
   guide into a functional spec, design doc, code walkthrough, or API reference.
4. **Exact labels**: Every button, command, field, tab, and menu item uses the
   EXACT text from the source code. Bold all UI labels.
5. **Action-oriented**: Lead with "How to" sections. Users come to docs to DO things.
6. **States matter**: Document every user-visible state — users need to know what's normal vs. broken.
7. **No code**: Never show code, API endpoints, or technical implementation details.
8. **No screenshots**: Describe the software in words. Screenshots go stale quickly.
9. **Cross-link**: Reference other guide pages where relevant (e.g., "See [Domain Settings](../settings/domains.md) for full configuration").
10. **One surface per page**: Don't combine unrelated screens, commands, or flows. Modals spawned from a screen are included on the parent page.

## After Writing

- Verify the repo's sidebar or nav config includes the page when such config exists
- Verify route-to-help mapping includes the page when the repo has such a mapping
- Check existing help-link components such as `<HelpIcon>` when the repo uses them
- Verify the guide reflects the functional spec's user outcome and does not
  contradict related design docs
- If the feature has a design doc in `docs/design/`, verify they're consistent
