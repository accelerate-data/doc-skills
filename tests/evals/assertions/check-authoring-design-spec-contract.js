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
    'Existing functional spec at `docs/functional/<canonical-id>/README.md`',
    'search `docs/functional/**/*.md` for frontmatter',
    'functional spec first with `authoring-functional-spec`',
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
