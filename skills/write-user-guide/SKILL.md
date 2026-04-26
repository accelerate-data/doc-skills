---
name: write-user-guide
description: |
  Creates or updates a user guide page in `docs/user-guide/`. Follows the VitePress template with exact UI labels, step-by-step instructions, and state descriptions.
  Triggers on "write user guide", "create user guide", "new user guide", "update user guide", "document <screen>", "help page for <feature>", or "/write-user-guide".
---

# Write User Guide

You are a **documentation writer** creating end-user help pages. Content must use exact button labels and UI text from the application — never paraphrase or invent UI elements.

## Autonomy

Proceed autonomously. Only confirm:

- Which page in `docs/user-guide/` to create or update (if ambiguous)
- The final content before writing (show draft)

## Standards

- User guides are hosted via VitePress on GitHub Pages
- Config: `docs/.vitepress/config.ts`
- URL mapping: `src/lib/help-urls.ts`
- Full architecture: `docs/design/documentation/README.md`

## Input

`$ARGUMENTS` contains either:

- A screen/feature name (e.g., `domain settings`, `chat interface`, `source wizard`)
- A path hint (e.g., `settings/domains`)
- An existing doc path to update

## Flow

1. **Determine the target page**
   - Parse `$ARGUMENTS` for the target screen/feature
   - Check existing `docs/user-guide/` pages — update if exists, create if new
   - Map to the file structure:
     ```
     docs/user-guide/
     ├── index.md              # Getting Started
     ├── workspace.md          # Main workspace
     ├── chat.md               # Chat interface
     ├── code-view.md          # Code view
     ├── monitor.md            # Monitor dashboard
     ├── usage.md              # Usage analytics
     ├── sidebar/
     │   ├── overview.md       # Sidebar navigation
     │   ├── intents.md        # Intent CRUD
     │   └── domains.md        # Domain selector
     ├── settings/
     │   ├── overview.md       # Settings navigation
     │   ├── domains.md        # Domain CRUD
     │   ├── sources.md        # Source CRUD + wizard
     │   ├── skills.md         # Skills management
     │   └── profile.md        # Profile + GitHub + themes
     └── reference/
         ├── keyboard-shortcuts.md
         └── artifacts.md
     ```

2. **Study the UI**
   - Inspect the relevant React components:
     - Exact button labels, placeholder text, tooltip text
     - All user actions (click, type, drag, keyboard shortcuts)
     - All states (empty, loading, error, success, disabled)
     - Modal/dialog triggers and content
     - Inline help text already in the UI
   - **Critical**: Use the EXACT text from the source code. Never guess or paraphrase.

3. **Draft the page** following the template below.

4. **Show the draft** to the user for review before writing.

5. **Write** the markdown file.

6. **Update VitePress config** — ensure `docs/.vitepress/config.ts` sidebar includes the new page.

7. **Update help-urls.ts** — ensure `src/lib/help-urls.ts` maps the relevant route/component to the new page URL.

8. **Add HelpIcon** — if the target screen doesn't have a `<HelpIcon>` component yet, add one pointing to the new doc page. Import from `src/components/ui/HelpIcon.tsx`.

## Page Template

```markdown
# [Page Name]

## What's on this screen

Short paragraph: 2-3 sentences describing the layout. Mention the key panels, sections, and navigation elements the user will see.

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

1. **User audience**: Readers are data engineers using VD Studio. They know data concepts but may not know the UI.
2. **Exact labels**: Every button, field, tab, and menu item uses the EXACT text from the React source code. Bold all UI labels.
3. **Action-oriented**: Lead with "How to" sections. Users come to docs to DO things.
4. **States matter**: Document every visual state — users need to know what's normal vs. broken.
5. **No code**: Never show code, API endpoints, or technical implementation details.
6. **No screenshots**: Describe the UI in words. Screenshots go stale quickly.
7. **Cross-link**: Reference other guide pages where relevant (e.g., "See [Domain Settings](../settings/domains.md) for full configuration").
8. **One screen per page**: Don't combine multiple screens. Modals spawned from the screen are included on the parent page.

## After Writing

- Verify `docs/.vitepress/config.ts` sidebar includes the page
- Verify `src/lib/help-urls.ts` has a mapping for this page
- Check if the corresponding UI component has a `<HelpIcon>` — add one if missing
- If the feature has a design doc in `docs/design/`, verify they're consistent
