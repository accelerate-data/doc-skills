const { extractJsonObject } = require('./schema-helpers');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../../..');

function requireFileContains(relativePath, phrases) {
  const absolutePath = path.join(ROOT, relativePath);
  const content = fs.readFileSync(absolutePath, 'utf8');
  for (const phrase of phrases) {
    if (!content.includes(phrase)) {
      return `${relativePath} is missing required anchor: ${phrase}`;
    }
  }
  return null;
}

function staticContractReason() {
  const checks = [
    requireFileContains('skills/authoring-functional-spec/SKILL.md', [
      'name: authoring-functional-spec',
      'docs/functional/<canonical-id>/README.md',
      'gws auth status',
      'superpowers:brainstorming',
      'superpowers:verification-before-completion',
      'Do NOT read column H',
      'Do not write to the Sheet',
      'list candidate IDs for the current repo',
      'cite code only to ground behavioral claims',
      'production artifacts and sibling flow IDs',
      'references/functional-spec-template.md',
      '`git push`',
    ]),
    requireFileContains('skills/authoring-functional-spec/references/sheet-interop.md', [
      'Never write to any Sheet cell from this skill',
      'gws auth status',
    ]),
  ];
  return checks.find(Boolean) || null;
}

function parseExpectedBoolean(value) {
  if (value === undefined) return null;
  return String(value).trim().toLowerCase() === 'true';
}

function expectedFieldName(varName) {
  if (!varName.startsWith('expect_')) return null;
  return varName.slice('expect_'.length);
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
    const field = expectedFieldName(varName);
    if (!field) continue;
    const expected = parseExpectedBoolean(varValue);
    if (expected === null) continue;
    if (payload[field] !== expected) {
      return {
        pass: false,
        score: 0,
        reason: `Expected ${field}=${expected}, got ${payload[field]}`,
      };
    }
  }

  return { pass: true, score: 1, reason: 'authoring-functional-spec contract matched expected behavior' };
};
