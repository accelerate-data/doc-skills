const { extractJsonObject } = require('./schema-helpers');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../../..');

function staticContractReason() {
  const content = fs.readFileSync(
    path.join(ROOT, 'skills/writing-clearly-and-concisely/SKILL.md'),
    'utf8',
  );
  const reference = fs.readFileSync(
    path.join(ROOT, 'skills/writing-clearly-and-concisely/references/elements-of-style.md'),
    'utf8',
  );
  const required = [
    'name: writing-clearly-and-concisely',
    'Use when writing or tightening prose for functional specs, design documents, user guides, or implementation plans',
    'Functional specs',
    'Design documents',
    'User guides',
    'Implementation plans',
    'This is a supporting style skill',
    'Functional specs: `doc-skills:authoring-functional-spec`',
    'Design documents: `doc-skills:authoring-design-spec`',
    'User guides: `doc-skills:authoring-user-guide`',
    'Implementation plans: `superpowers:writing-plans`',
    'Preserve meaning, scope, requirements, and document structure',
    'This is a style pass, not a routing replacement',
    'Do not use this for AI prompt-writing requests; use `writing-ai-prompts`',
    'Do not use this for code comments, commit messages, release notes, emails, or',
    'Do not use it to invent missing requirements',
    'https://github.com/obra/the-elements-of-style/tree/main/skills/writing-clearly-and-concisely',
    "William Strunk Jr.'s 1918 public-domain",
  ];
  for (const phrase of required) {
    if (!content.includes(phrase)) {
      return `skills/writing-clearly-and-concisely/SKILL.md is missing required anchor: ${phrase}`;
    }
  }
  const referenceRequired = [
    'Clear and Concise Documentation Style',
    "William Strunk Jr.'s 1918 public-domain",
    'Use Active Voice',
    'Omit Needless Words',
    'Preserve Document Shape',
  ];
  for (const phrase of referenceRequired) {
    if (!reference.includes(phrase)) {
      return `references/elements-of-style.md is missing required anchor: ${phrase}`;
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

  return { pass: true, score: 1, reason: 'writing-clearly-and-concisely contract matched expected behavior' };
};
