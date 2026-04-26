const { extractJsonObject } = require('./schema-helpers');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../../..');

function staticContractReason() {
  const content = fs.readFileSync(
    path.join(ROOT, 'skills/authoring-design-spec/SKILL.md'),
    'utf8',
  );
  const required = [
    'name: authoring-design-spec',
    'One canonical user flow maps to exactly one functional spec',
    'One functional spec may be supported by many design docs',
    'The functional spec and all design docs for that flow must live in the primary',
    'secondary helper code',
    'Existing functional spec at `docs/functional/<canonical-id>/README.md`',
    'handoff for `authoring-functional-spec`',
    'Ask the user to switch back to `authoring-functional-spec`',
    'Fetch the User-Flows-Details Sheet row',
    'Verify the current repo from Phase 0 matches the Sheet repo',
    'ask for explicit confirmation before editing it',
    'modify the existing canonical functional spec in place',
    'do not create a second functional spec',
    'search `docs/functional/**/*.md` for frontmatter',
    'functional spec first with `authoring-functional-spec`',
    'AI prompt-writing requests',
    'named production artifacts cited by the functional spec',
    'sibling canonical IDs referenced in the functional spec',
    'Read only related design specs',
    'If code does not exist',
    '**covered**',
    '**partial**',
    '**missing**',
    '**conflicting**',
    'superpowers:brainstorming',
    'superpowers:writing-plans',
  ];
  for (const phrase of required) {
    if (!content.includes(phrase)) {
      return `skills/authoring-design-spec/SKILL.md is missing required anchor: ${phrase}`;
    }
  }
  return null;
}

function parseExpectedBoolean(value) {
  if (value === undefined) return null;
  return String(value).trim().toLowerCase() === 'true';
}

module.exports = (output, context) => {
  const staticFailure = staticContractReason();
  if (staticFailure) {
    return { pass: false, score: 0, reason: staticFailure };
  }

  let payload;
  try {
    payload = extractJsonObject(output);
  } catch (error) {
    return { pass: false, score: 0, reason: `Failed to parse JSON output: ${error.message}` };
  }

  for (const [varName, varValue] of Object.entries(context.vars || {})) {
    if (!varName.startsWith('expect_')) continue;
    const field = varName.slice('expect_'.length);
    const expected = parseExpectedBoolean(varValue);
    if (expected === null) continue;
    if (payload[field] !== expected) {
      return { pass: false, score: 0, reason: `Expected ${field}=${expected}, got ${payload[field]}` };
    }
  }

  return { pass: true, score: 1, reason: 'authoring-design-spec contract matched expected behavior' };
};
