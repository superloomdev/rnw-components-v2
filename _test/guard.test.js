// Info: The guard's own contract (D43): a child past the per-process memory
// ceiling is SIGKILLed and reported 137, a child past the wall clock is
// reported 124, and a child's ordinary exit code passes through untouched.
// The runaway below allocates a bounded 640 MB and then idles: enough to
// trip --proc-mb 512, below the ceilings of any outer guard this file is
// itself run under, and short of anything Jetsam cares about.

import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const HERE = dirname(fileURLToPath(import.meta.url));
const GUARD = join(HERE, '..', 'scripts', 'guard.js');

const RUNAWAY = 'const a=[];for(let i=0;i<10;i++)a.push(Buffer.alloc(64*1024*1024,1));setTimeout(()=>{},30000)';
const SLEEPER = 'setTimeout(()=>{},10000)';


/********************************************************************
Run the guard over a child command and return the spawnSync result plus
the elapsed wall time.

@param {Array}  guardArgs - Guard options
@param {Array}  childArgs - The command after `--`
@param {Number} timeout   - spawnSync timeout in ms

@return {Object} - { result, elapsedMs }
*********************************************************************/
function run (guardArgs, childArgs, timeout) {

  const started = Date.now();
  const result = spawnSync('node', [GUARD].concat(guardArgs, ['--'], childArgs), {
    encoding: 'utf8', timeout: timeout
  });
  return { result: result, elapsedMs: Date.now() - started };

}


test('a child past the per-process memory ceiling is killed and reported 137', function () {

  const { result, elapsedMs } = run(['--proc-mb', '512', '--seconds', '30'], ['node', '-e', RUNAWAY], 20000);
  if (result.status !== 137) {
    throw new Error('expected exit 137, got status=' + result.status + ' signal=' + result.signal + ' stderr=' + result.stderr);
  }
  if (elapsedMs >= 5000) {
    throw new Error('kill took ' + elapsedMs + ' ms');
  }
  if (!/^GUARD: killed memory /m.test(result.stderr)) {
    throw new Error('no GUARD: killed memory line in stderr: ' + result.stderr);
  }

});

test('a child past the wall clock is killed and reported 124', function () {

  const { result, elapsedMs } = run(['--seconds', '2'], ['node', '-e', SLEEPER], 15000);
  if (result.status !== 124) {
    throw new Error('expected exit 124, got status=' + result.status + ' signal=' + result.signal + ' stderr=' + result.stderr);
  }
  if (elapsedMs >= 4000) {
    throw new Error('kill took ' + elapsedMs + ' ms');
  }

});

test('a child exit code passes through with no GUARD line', function () {

  const { result } = run([], ['node', '-e', 'process.exit(3)'], 15000);
  if (result.status !== 3) {
    throw new Error('expected exit 3, got status=' + result.status + ' signal=' + result.signal + ' stderr=' + result.stderr);
  }
  if (/GUARD:/.test(result.stderr)) {
    throw new Error('unexpected GUARD line in stderr: ' + result.stderr);
  }

});
