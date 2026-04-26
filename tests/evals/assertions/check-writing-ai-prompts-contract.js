const { extractJsonObject } = require('./schema-helpers');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../../..');

function staticContractReason() {
  const content = fs.readFileSync(
    path.join(ROOT, 'skills/writing-ai-prompts/SKILL.md'),
    'utf8',
  );
  const required = [
    'name: writing-ai-prompts',
    'Use when the user wants to write or improve a prompt',
    'prompt-writing requests',
    'Functional specs',
    'Design specs',
    'Implementation plans',
    'user-guide documentation',
    'NEVER output a prompt without first confirming the target tool',
    'NEVER ask more than 3 clarifying questions',
    'A single copyable prompt block',
    'target tool + template type + token estimate',
    'strategy note',
    'Tool Routing',
    'NEVER add Chain of Thought instructions to reasoning-native models',
    'Mixture of Experts',
    'Tree of Thought',
    'Graph of Thought',
    'Universal Self-Consistency',
  ];
  for (const phrase of required) {
    if (!content.includes(phrase)) {
      return `skills/writing-ai-prompts/SKILL.md is missing required anchor: ${phrase}`;
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

  return { pass: true, score: 1, reason: 'writing-ai-prompts contract matched expected behavior' };
};
