const { extractJsonObject } = require('./schema-helpers');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../../..');

function staticContractReason() {
  const content = fs.readFileSync(
    path.join(ROOT, 'skills/writing-ai-prompts/SKILL.md'),
    'utf8',
  );
  const templates = fs.readFileSync(
    path.join(ROOT, 'skills/writing-ai-prompts/references/templates.md'),
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
    'Unknown tool - ask up to 3 questions',
    'A single copyable prompt block',
    'target tool + template type + token estimate',
    'strategy note',
    'Tool Routing',
    'NEVER add Chain of Thought instructions to reasoning-native models',
    'concise rationale',
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
  const templateRequired = [
    'Template E - Reasoning Summary',
    'Never ask the model to reveal hidden chain-of-thought',
    'Brief rationale: 3-5 bullets',
  ];
  for (const phrase of templateRequired) {
    if (!templates.includes(phrase)) {
      return `skills/writing-ai-prompts/references/templates.md is missing required anchor: ${phrase}`;
    }
  }
  return null;
}

function staticContradictionReason() {
  const content = fs.readFileSync(
    path.join(ROOT, 'skills/writing-ai-prompts/SKILL.md'),
    'utf8',
  );
  const templates = fs.readFileSync(
    path.join(ROOT, 'skills/writing-ai-prompts/references/templates.md'),
    'utf8',
  );
  if (content.includes('ask these 4 questions')) {
    return 'Unknown-tool guidance asks 4 questions, contradicting the max-3 hard rule';
  }
  if (content.includes('**Chain of Thought**')) {
    return 'Safe techniques must not recommend explicit Chain-of-Thought prompting';
  }
  const forbiddenTemplatePhrases = [
    'Template E — Chain of Thought',
    'Template E - Chain of Thought',
    '<thinking>',
    'Give your final answer in <answer> tags only',
  ];
  for (const phrase of forbiddenTemplatePhrases) {
    if (templates.includes(phrase)) {
      return `Template reference still recommends explicit chain-of-thought prompting: ${phrase}`;
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
  const contradictionFailure = staticContradictionReason();
  if (contradictionFailure) {
    return { pass: false, score: 0, reason: contradictionFailure };
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
