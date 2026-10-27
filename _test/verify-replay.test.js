import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

test('the gate replay fails a step when any line of its run block fails, the way Actions does', function () {
  // Actions executes run: text under bash --noprofile --norc -eo pipefail; a
  // two-line block whose first line fails must fail the step even though the
  // second line succeeds
  const twoLines = 'node -e "process.exit(1)"\nnode -e "process.exit(0)"';
  let failed = false;
  try {
    execFileSync('bash', ['--noprofile', '--norc', '-eo', 'pipefail', '-c', twoLines]);
  } catch {
    failed = true;
  }
  assert.equal(failed, true, 'a failing first line fails the block under -eo pipefail');
  const source = readFileSync('../scripts/verify.js', 'utf8');
  assert.equal(source.includes("['--noprofile', '--norc', '-eo', 'pipefail', '-c', cmd]"), true, 'verify.js replays every step under the Actions shell');
});
