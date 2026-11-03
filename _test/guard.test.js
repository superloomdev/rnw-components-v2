// Info: The guard's own contract (D43): a child past the per-process memory
// ceiling is SIGKILLed and reported 137, a child past the wall clock is
// reported 124, and a child's ordinary exit code passes through untouched.
// The runaway below allocates a bounded 320 MB and then idles: enough to
// trip --proc-mb 256, below the per-process ceiling of any outer guard
// this file is itself run under (GUARD_PROC_MB can be 512), and short of
// anything Jetsam cares about.

import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, test } from 'node:test';

const HERE = dirname(fileURLToPath(import.meta.url));
const GUARD = join(HERE, '..', 'scripts', 'guard.js');

const RUNAWAY = 'const a=[];for(let i=0;i<5;i++)a.push(Buffer.alloc(64*1024*1024,1));setTimeout(()=>{},30000)';
const SLEEPER = 'setTimeout(()=>{},10000)';
// The grandchild is detached, so once the child exits it is reparented
// and only the guard's seen set can still find it. The 384 MB cap stays
// under the 512 MB ceiling of any outer guard this file is itself run
// under, and the paced loop crosses the inner 256 MB ceiling only after
// the child is gone; the child idles 1.5 s so one sample catches the
// grandchild while it is still under the root.
const ORPHAN = 'const a=[];const t=setInterval(()=>{a.push(Buffer.alloc(64*1024*1024,1));if(a.length===6)clearInterval(t)},500);setTimeout(()=>{},30000)';
const SPAWNER = 'const g=require("child_process").spawn(process.execPath,["-e",' + JSON.stringify(ORPHAN) + '],{detached:true,stdio:"ignore"});g.unref();console.log("grandchild "+g.pid);setTimeout(()=>{},1500)';


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


describe('guard', function () {

  test('a child past the per-process memory ceiling is killed and reported 137', function () {

    const { result, elapsedMs } = run(['--proc-mb', '256', '--seconds', '30'], ['node', '-e', RUNAWAY], 20000);
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

  test('a child exit code passes through with no kill line', function () {

    const { result } = run([], ['node', '-e', 'process.exit(3)'], 15000);
    if (result.status !== 3) {
      throw new Error('expected exit 3, got status=' + result.status + ' signal=' + result.signal + ' stderr=' + result.stderr);
    }
    if (/GUARD: killed/.test(result.stderr)) {
      throw new Error('unexpected GUARD line in stderr: ' + result.stderr);
    }

  });

  test('the child output goes to the guard log and only its tail is printed', function () {

    const dir = mkdtempSync(join(tmpdir(), 'guard-log-'));
    const log = join(dir, 'run.log');
    const { result } = run(['--log', log], ['node', '-e', 'for(let i=0;i<200;i++)console.log("line "+i)'], 15000);
    if (result.status !== 0) {
      throw new Error('expected exit 0, got status=' + result.status + ' signal=' + result.signal + ' stderr=' + result.stderr);
    }
    const lines = readFileSync(log, 'utf8').trimEnd().split('\n');
    if (lines.length !== 200) {
      throw new Error('expected 200 log lines in ' + log + ', got ' + lines.length);
    }
    if (!/^GUARD: log /m.test(result.stderr)) {
      throw new Error('no GUARD: log line in stderr: ' + result.stderr);
    }
    if (!result.stderr.includes('line 199')) {
      throw new Error('tail missing the last line: ' + result.stderr);
    }
    if (result.stderr.includes('line 0\n')) {
      throw new Error('tail printed more than its last lines: ' + result.stderr);
    }

  });

  test('a reparented grandchild past the ceiling is still killed', function () {

    const dir = mkdtempSync(join(tmpdir(), 'guard-seen-'));
    const log = join(dir, 'run.log');
    const { result } = run(['--proc-mb', '256', '--seconds', '20', '--log', log], ['node', '-e', SPAWNER], 40000);
    if (result.status !== 137) {
      throw new Error('expected exit 137, got status=' + result.status + ' signal=' + result.signal + ' stderr=' + result.stderr);
    }
    if (!/^GUARD: killed memory /m.test(result.stderr)) {
      throw new Error('no GUARD: killed memory line in stderr: ' + result.stderr);
    }
    const match = /grandchild (\d+)/.exec(readFileSync(log, 'utf8'));
    if (match === null) {
      throw new Error('no grandchild pid in ' + log);
    }
    const grandchild = Number(match[1]);
    // A killed orphan is reaped by launchd, not by the guard: the pid can
    // answer kill(pid, 0) for a moment after the SIGKILL, so probe again
    let alive = true;
    for (let attempt = 0; attempt < 30 && alive; attempt += 1) {
      try {
        process.kill(grandchild, 0);
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100);
      } catch {
        alive = false;
      }
    }
    if (alive) {
      try {
        process.kill(grandchild, 'SIGKILL');
      } catch {
        // Best-effort cleanup
      }
      throw new Error('grandchild ' + grandchild + ' survived the guard');
    }

  });

});