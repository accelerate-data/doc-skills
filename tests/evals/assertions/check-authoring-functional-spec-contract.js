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

function requireFileNotContains(relativePath, phrases) {
  const absolutePath = path.join(ROOT, relativePath);
  const content = fs.readFileSync(absolutePath, 'utf8');
  for (const phrase of phrases) {
    if (content.includes(phrase)) {
      return `${relativePath} contains forbidden anchor: ${phrase}`;
    }
  }
  return null;
}

function staticContractReason() {
  const checks = [
    requireFileContains('skills/authoring-functional-spec/SKILL.md', [
      'name: authoring-functional-spec',
      'One canonical user flow maps to exactly one functional spec',
      'One functional spec may be supported by many design docs',
      'The functional spec must live in that primary repo',
      'Code grounding is expected to come from the primary repo',
      'secondary helper code',
      'docs/functional/<canonical-id>/README.md',
      'End-user help pages',
      'AI prompt-writing requests',
      'update that file in place',
      'do not create',
      'alternate',
      'gws auth status',
      'superpowers:verification-before-completion',
      'superpowers:writing-plans',
      'hand over the canonical flow ID',
      'Sheet column C',
      'never use a hardcoded repo allowlist',
      'Do NOT read column H',
      'Do not write to the Sheet',
      'list candidate IDs for the current repo',
      'Cite code only to ground behavioral claims',
      'production artifacts and sibling flow IDs',
      'shape:',
      'journey | surface | service | skill | install | utility',
      'DRE | FSA | CDO | CloudOps',
      'Do not add date, review-date, version, or SHA frontmatter',
      'git commits, tags, and SHAs',
      'references/shape-lenses.md',
      'Do not hand off to `superpowers:brainstorming`',
      'references/functional-spec-template.md',
      '`git push`',
    ]),
    requireFileContains('skills/authoring-functional-spec/references/sheet-interop.md', [
      'Resolve allowed target repos from Sheet column C',
      'Never write to any Sheet cell from this skill',
      'gws auth status',
    ]),
    requireFileContains('skills/authoring-functional-spec/references/functional-spec-template.md', [
      'shape: <journey | surface | service | skill | install | utility>',
      'persona: <DRE | FSA | CDO | CloudOps>',
      'Functional spec provenance comes from git history',
      'Do not emit `N/A`, `TBD`, or `[describe ...]` placeholders',
      'Shape Menus',
    ]),
    requireFileNotContains('skills/authoring-functional-spec/SKILL.md', [
      'last-reviewed',
    ]),
    requireFileNotContains('skills/authoring-functional-spec/references/functional-spec-template.md', [
      'last-reviewed',
    ]),
    requireFileContains('skills/authoring-functional-spec/references/shape-lenses.md', [
      '## Journey',
      '## Surface',
      '## Service',
      '## Skill',
      '## Install',
      '## Utility',
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
