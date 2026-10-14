import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const candidate = JSON.parse(fs.readFileSync(path.join(repoRoot, 'data', 'roster.candidate.json'), 'utf8'));
const roster = JSON.parse(fs.readFileSync(path.join(repoRoot, 'data', 'roster.json'), 'utf8'));

const tiers = new Set(['atom', 'molecule', 'composite', 'provider']);
const supports = new Set(['both', 'touch_degraded', 'adapter', 'web', 'native', 'split']);
const references = new Set(['render-web', 'parse-rn', 'none']);
const statuses = new Set(['pending', 'built', 'measured', 'frozen']);
const flagNames = new Set([
  'deferred_gap', 'no_reference', 'web_only', 'requires_parent',
  'superloom_decision'
]);
const requiredKeys = [
  'name', 'family', 'tier', 'source', 'description', 'platform', 'enums',
  'behaviors', 'parent', 'reference', 'carbon_twin', 'material_twin',
  'diff_budget', 'flags', 'status'
];

const failures = [];
const fail = (message) => failures.push(message);
const nonEmpty = (value) => typeof value === 'string' && value.length > 0;

if (roster.schema !== 2 || !Array.isArray(roster.rows)
    || !Array.isArray(roster.excluded)
    || typeof roster.rules !== 'object' || roster.rules === null) {
  fail('invalid roster envelope');
}
if (roster.rows.length + roster.excluded.length !== candidate.rows.length + 3) {
  fail(`row count ${roster.rows.length} + excluded ${roster.excluded.length} != candidate ${candidate.rows.length} + 3 substrate rows`);
}

const rosterNames = new Set();
const sources = new Map();
for (const row of roster.rows) {
  if (JSON.stringify(Object.keys(row)) !== JSON.stringify(requiredKeys)) {
    fail(`${row.name ?? '<unnamed>'}: wrong keys or key order`);
    continue;
  }
  if (rosterNames.has(row.name)) {
    fail(`${row.name}: duplicate name`);
  }
  rosterNames.add(row.name);
  if (!nonEmpty(row.name) || !nonEmpty(row.family) || !tiers.has(row.tier)) {
    fail(`${row.name}: empty name/family or invalid tier`);
  }
  if (!row.source || !nonEmpty(row.source.package)
      || !nonEmpty(row.source.version) || !nonEmpty(row.source.export)) {
    fail(`${row.name}: invalid source`);
  } else {
    const key = `${row.source.package}\u001f${row.source.export}`;
    if (sources.has(key)) {
      fail(`${row.name}: duplicate source also used by ${sources.get(key)}`);
    }
    sources.set(key, row.name);
  }
  if (!nonEmpty(row.description) || !/[.!?]$/.test(row.description)) {
    fail(`${row.name}: description is not one sentence`);
  }
  if (row.status !== 'pending' && /^\S+ is a component in the \S+ family[.;]/.test(row.description)) {
    fail(`${row.name}: built row still carries a placeholder description`);
  }
  if (!row.platform || !supports.has(row.platform.support) || !nonEmpty(row.platform.fallback)) {
    fail(`${row.name}: invalid platform`);
  }
  if (!Array.isArray(row.enums) || !Array.isArray(row.behaviors)
      || !Array.isArray(row.flags) || row.flags.some((flag) => !flagNames.has(flag))) {
    fail(`${row.name}: invalid enum/behavior/flag list`);
  }
  if (row.parent !== null && !nonEmpty(row.parent)) {
    fail(`${row.name}: invalid parent`);
  }
  if (!row.reference || !references.has(row.reference.kind)
      || !nonEmpty(row.reference.package)) {
    fail(`${row.name}: invalid reference`);
  }
  if (!nonEmpty(row.carbon_twin) || !nonEmpty(row.material_twin)
      || row.diff_budget !== 2 || !statuses.has(row.status)) {
    fail(`${row.name}: invalid twin, diff budget, or status`);
  }
  if (row.flags.length > 0 && row.description.length === 0) {
    fail(`${row.name}: flags without note`);
  }
  const noteTerms = {
    deferred_gap: 'deferred',
    no_reference: 'no upstream visual reference',
    web_only: 'web-only',
    requires_parent: 'must be composed inside',
    superloom_decision: 'Superloom decision'
  };
  for (const flag of row.flags) {
    if (!row.description.includes(noteTerms[flag])) {
      fail(`${row.name}: flag '${flag}' is not explained by its description`);
    }
  }
}

// Every excluded entry names a candidate source under a declared rule
const excludedSources = new Map();
for (const entry of roster.excluded) {
  if (JSON.stringify(Object.keys(entry).sort())
      !== JSON.stringify(['export', 'name', 'package', 'rule'])) {
    fail(`${entry.name ?? '<unnamed>'}: wrong excluded keys`);
    continue;
  }
  if (!nonEmpty(entry.name) || !nonEmpty(entry.package) || !nonEmpty(entry.export)
      || !nonEmpty(entry.rule)) {
    fail(`${entry.name ?? '<unnamed>'}: empty excluded field`);
    continue;
  }
  if (!Object.prototype.hasOwnProperty.call(roster.rules, entry.rule)) {
    fail(`${entry.name}: rule '${entry.rule}' is not a declared rule`);
  }
  const key = `${entry.package}\u001f${entry.export}`;
  excludedSources.set(key, entry.name);
}

// Every candidate source is a row source or an excluded source, never both
for (const row of candidate.rows) {
  const key = `${row.source.package}\u001f${row.source.export}`;
  const inRows = sources.has(key);
  const inExcluded = excludedSources.has(key);
  if (inRows && inExcluded) {
    fail(`candidate source in both rows and excluded: ${key}`);
  } else if (!inRows && !inExcluded) {
    fail(`candidate source missing: ${key}`);
  }
}
for (const key of excludedSources.keys()) {
  if (!candidate.rows.some((row) => `${row.source.package}\u001f${row.source.export}` === key)) {
    fail(`excluded source is not a candidate source: ${key}`);
  }
}
for (const name of ['Icon', 'View', 'OverlayHost']) {
  const row = roster.rows.find((item) => item.name === name);
  if (!row || row.source.package !== 'local') {
    fail(`substrate row missing: ${name}`);
  }
}
const expectedFirst = [
  'Icon', 'Text', 'View', 'Button', 'Checkbox', 'TextInput', 'Select',
  'IconButton', 'TextArea', 'Dropdown', 'RadioButton', 'Toggle', 'Tag', 'Tabs',
  'Menu', 'Modal', 'ToastNotification', 'ProgressBar', 'Tooltip'
];
if (JSON.stringify(roster.rows.slice(0, expectedFirst.length).map((row) => row.name))
    !== JSON.stringify(expectedFirst)) {
  fail('exemplars and anchors are not first in build order');
}

if (failures.length > 0) {
  failures.forEach((message) => process.stderr.write(`FAIL ${message}\n`));
  process.exit(1);
}

process.stdout.write(`OK ${roster.rows.length} rows, ${roster.excluded.length} excluded, 0 empty fields, 0 flags without note\n`);
