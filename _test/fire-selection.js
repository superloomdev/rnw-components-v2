// Info: Pure selection for the mutation runner. Shards partition the full
// manifest by its stable row order; they never sample or change a proof.

export const FIRE_USAGE = 'usage: node fire.js [--only <id> | --shard <index>/<total>] [--help]\n';

export function getFireSelection (rows, args) {

  if (args.length === 0) {
    return { help: false, rows: rows };
  }
  if (args.length === 1 && args[0] === '--help') {
    return { help: true, rows: [] };
  }
  if (args.length !== 2) {
    throw new Error(FIRE_USAGE);
  }
  if (args[0] === '--only') {
    const selected = rows.filter(function (row) { return row.id === args[1]; });
    if (selected.length !== 1) {
      throw new Error('unknown or ambiguous fire row: ' + args[1] + '\n' + FIRE_USAGE);
    }
    return { help: false, rows: selected };
  }
  if (args[0] !== '--shard') {
    throw new Error(FIRE_USAGE);
  }
  const match = /^([1-9][0-9]*)\/([1-9][0-9]*)$/.exec(args[1]);
  if (!match) {
    throw new Error(FIRE_USAGE);
  }
  const index = Number(match[1]);
  const total = Number(match[2]);
  if (!Number.isSafeInteger(index) || !Number.isSafeInteger(total) || index > total) {
    throw new Error(FIRE_USAGE);
  }
  const selected = rows.filter(function (row, ordinal) {
    return ordinal % total === index - 1;
  });
  if (selected.length === 0) {
    throw new Error('empty fire shard: ' + args[1] + '\n' + FIRE_USAGE);
  }
  return { help: false, rows: selected };

}


/********************************************************************
A child's termination is a mutation proof only when the test suite ran
and failed normally: status 1 with a failing-test marker in its output.
A signal kill (SIGKILL on a dead runner, SIGTERM), a non-failure status
(heap tripwires exit 134/137), or output with no failing marker means
the harness died, not that the mutation tripped an assertion.

@param {Object} error - The execSync error: { status, signal, stdout, stderr }

@return {Boolean} - True when the child failed by a test assertion
*********************************************************************/
export function isMutationProof (error) {

  // A signal kill is never a proof
  if (error.signal !== null && error.signal !== undefined) {
    return false;
  }

  // node:test and playwright exit 1 on a failing test; anything else is the
  // harness dying (heap ceiling, runner kill, missing binary)
  if (error.status !== 1) {
    return false;
  }

  // Status 1 without a failing-test marker is a crash, not an assertion
  const detail = String(error.stdout || '') + String(error.stderr || error.message || '');
  return /✖|not ok|failed/.test(detail);

}
