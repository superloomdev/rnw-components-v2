// Info: Fire runner. For each manifest row: apply one production edit, run
// the named test, assert it FAILS, restore the file byte-for-byte (verified
// by hash), and assert the test passes again. A test that cannot be made to
// fail is not asserting anything; a gate is trusted only after it has been
// seen to fire.
//
// Usage: node fire.js [--only <id>]
// Exit 1 on any row that did not fire, did not recover, or was not restored.

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, '..');
const manifest = JSON.parse(readFileSync(join(HERE, 'fixtures', 'assertion-integrity.json'), 'utf8'));
const onlyIndex = process.argv.indexOf('--only');
const only = onlyIndex === -1 ? null : process.argv[onlyIndex + 1];


/********************************************************************
Hash bytes.

@param {Buffer} bytes - Content

@return {String} - sha256 hex
*********************************************************************/
function sha256 (bytes) {

  return createHash('sha256').update(bytes).digest('hex');

}


/********************************************************************
Run the row's test; report pass or fail without throwing.

@param {Object} row - Manifest row

@return {Boolean} - True when the test passed
*********************************************************************/
function runTest (row) {

  const cmd = row.runner === 'pw'
    ? 'npm run bundle --silent && npx playwright test ' + row.test + ' -g ' + JSON.stringify(row.testName)
    : 'node --import ./harness/register.js --test --test-name-pattern=' + JSON.stringify(row.testName) + ' ' + row.test;
  let output;
  try {
    output = execSync(cmd, { cwd: HERE, stdio: 'pipe', encoding: 'utf8' });
  } catch {
    return false;
  }

  // A pattern that matched no test is not a pass: the row names nothing
  if (/tests 0\b/.test(output) || /No tests found/.test(output)) {
    throw new Error(row.id + ': the test pattern "' + row.testName + '" matched no test in ' + row.test);
  }

  return true;

}


const rows = manifest.rows.filter(function (row) {
  return only === null || row.id === only;
});
const broken = [];

for (const row of rows) {

  const target = join(REPO, row.file);
  const original = readFileSync(target);
  const originalHash = sha256(original);
  const text = original.toString('utf8');

  if (!text.includes(row.find)) {
    broken.push(row.id + ': manifest search string not found in ' + row.file);
    process.stdout.write('BROKEN  ' + row.id + '  (search string missing)\n');
    continue;
  }

  // Plant the edit, run, restore, verify the restore
  writeFileSync(target, text.replaceAll(row.find, row.replace));
  const failedUnderMutation = !runTest(row);
  writeFileSync(target, original);
  const restored = sha256(readFileSync(target)) === originalHash;

  if (!restored) {
    broken.push(row.id + ': FILE NOT RESTORED - ' + row.file);
    process.stdout.write('BROKEN  ' + row.id + '  (not restored)\n');
    continue;
  }

  const recovered = runTest(row);
  let mark = 'FIRED  ';
  if (!failedUnderMutation) {
    broken.push(row.id + ': DID NOT FIRE - the planted edit did not fail "' + row.testName + '"');
    mark = 'NOT FAILED';
  } else if (!recovered) {
    broken.push(row.id + ': DID NOT RECOVER - clean run still fails "' + row.testName + '"');
    mark = 'NO RECOVERY';
  }
  process.stdout.write(mark + '  ' + row.id + '  disabled -> ' + (failedUnderMutation ? 'failed' : 'PASSED') + ' -> restored' + (recovered ? '' : ' (still failing)') + '  (' + row.test + ')\n');

}

process.stdout.write('\nfire: ' + (rows.length - broken.length) + ' of ' + rows.length + ' rows fired and recovered\n');
if (broken.length > 0) {
  for (const line of broken) {
    process.stdout.write('  ' + line + '\n');
  }
  process.exit(1);
}
