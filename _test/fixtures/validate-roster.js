// Validates data/roster.candidate.json for Plan 0160 Step 0.5.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const roster = JSON.parse(fs.readFileSync(path.join(repoRoot, 'data', 'roster.candidate.json'), 'utf8'));

const EXPECTED_KEYS = [
  'name', 'family', 'tier', 'source', 'description', 'platform', 'enums',
  'behaviors', 'parent', 'reference', 'carbon_twin', 'material_twin',
  'diff_budget', 'flags', 'status',
];
const NULL_KEYS = EXPECTED_KEYS.filter((k) => k !== 'name' && k !== 'source');

let failures = 0;
const assert = (cond, msg) => { if (!cond) { failures++; console.error(`FAIL: ${msg}`); } };

assert(roster.schema === 1, 'schema !== 1');
const c = roster.counts;
assert(c.carbonReactExports >= 200, `carbonReactExports ${c.carbonReactExports} < 200`);
assert(c.carbonReactNativeExports >= 25, `carbonReactNativeExports ${c.carbonReactNativeExports} < 25`);
assert(c.ibmProductFamilies === 13, 'ibmProductFamilies !== 13');
assert(c.additions === 4, 'additions !== 4');
assert(c.additionRows === 3, 'additionRows !== 3');
assert(c.total === roster.rows.length, `total ${c.total} !== rows length ${roster.rows.length}`);

const names = roster.rows.map((r) => r.name);
assert(new Set(names).size === names.length, 'duplicate row names');
const sorted = [...names].sort((a, b) => a.localeCompare(b));
assert(JSON.stringify(names) === JSON.stringify(sorted), 'rows not sorted by name');

for (const row of roster.rows) {
  assert(JSON.stringify(Object.keys(row)) === JSON.stringify(EXPECTED_KEYS),
    `row '${row.name}' key set/order mismatch: ${Object.keys(row)}`);
  assert(typeof row.name === 'string' && row.name.length > 0, `row missing name`);
  for (const k of NULL_KEYS) assert(row[k] === null, `row '${row.name}'.${k} !== null`);
  assert(row.source && typeof row.source.package === 'string' && row.source.package.length > 0
    && typeof row.source.version === 'string' && row.source.version.length > 0
    && typeof row.source.export === 'string' && row.source.export.length > 0,
    `row '${row.name}' source fields empty`);
}

assert(!/"generatedAt"|"timestamp"|"date"/i.test(fs.readFileSync(path.join(repoRoot, 'data', 'roster.candidate.json'), 'utf8')), 'timestamp-like key present');

console.log(`raw counts: web=${c.carbonReactExports} rn=${c.carbonReactNativeExports} rnUnique=${c.carbonReactNativeUnique} products=${c.ibmProductFamilies} additions=${c.additions} additionRows=${c.additionRows} total=${c.total}`);
if (failures) { console.error(`${failures} validation failure(s)`); process.exit(1); }
console.log('validation: all assertions passed');
