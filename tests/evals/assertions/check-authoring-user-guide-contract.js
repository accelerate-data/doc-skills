const { extractJsonObject } = require('./schema-helpers');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../../..');

function staticContractReason() {
  const content = fs.readFileSync(
    path.join(ROOT, 'skills/authoring-user-guide/SKILL.md'),
    'utf8',
  );
  const required = [
    'name: authoring-user-guide',
    'Use when creating or updating end-user help pages',
    'docs/user-guide/',
    'Functional specs',
    'Design specs',
    'Implementation plans',
    'AI prompt-writing requests',
    'update if exists',
    'functional spec',
    'related design docs',
    'Inspect the relevant software source files',
    'Usage focus',
    'EXACT text from the source code',
    'No code',
    'sidebar or nav config',
    'route-to-help mapping',
    'help-link component',
    'Do not create a new help-link architecture',
  ];
  for (const phrase of required) {
    if (!content.includes(phrase)) {
      return `skills/authoring-user-guide/SKILL.md is missing required anchor: ${phrase}`;
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

  return { pass: true, score: 1, reason: 'authoring-user-guide contract matched expected behavior' };
};
