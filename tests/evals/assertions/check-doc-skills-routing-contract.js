const { extractJsonObject } = require('./schema-helpers');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../../..');

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function staticContractReason() {
  const combined = [
    read('README.md'),
    read('CLAUDE.md'),
    read('repo-map.json'),
    read('skills/authoring-functional-spec/SKILL.md'),
    read('skills/authoring-design-spec/SKILL.md'),
    read('skills/write-user-guide/SKILL.md'),
    read('skills/writing-ai-prompts/SKILL.md'),
  ].join('\n');
  const required = [
    'authoring-functional-spec',
    'authoring-design-spec',
    'write-user-guide',
    'writing-ai-prompts',
    'superpowers:writing-plans',
    'existing canonical functional spec',
  ];
  for (const phrase of required) {
    if (!combined.includes(phrase)) {
      return `routing surfaces are missing required anchor: ${phrase}`;
    }
  }
  if (combined.includes('skills/authoring-flow-spec/SKILL.md')) {
    return 'routing surfaces still reference skills/authoring-flow-spec/SKILL.md';
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

  return { pass: true, score: 1, reason: 'doc-skills routing contract matched expected behavior' };
};
