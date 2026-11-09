// Info: Process containment for test, bundle, Playwright and fire children
// (D43). A child that runs away on memory - five node processes were killed
// by macOS Jetsam at ~375 GB resident in about 90 s - cannot be stopped by
// a procedural rule, so the run itself gets a wrapper that watches the whole
// process tree once a second and kills it first.
//
// Usage: node scripts/guard.js [--seconds N] [--proc-mb N] [--tree-mb N] [--sample-ms N] [--log FILE] -- <command> [args...]
// Defaults: seconds 1800 (GUARD_SECONDS), proc-mb 6144 (GUARD_PROC_MB),
// tree-mb 12288 (GUARD_TREE_MB), log _test/test-results/last-run.log
// (GUARD_LOG). Kills exit 137 (memory) or 124 (time); the child's own exit
// code otherwise (1 on a signal). The child's stdout and stderr go to the
// log file and their last 60 lines are replayed to stderr when the run
// ends; stdin stays inherited so an interactive child still works. When
// `ps` is unavailable the guard logs once and keeps running the child -
// containment degrades, it never blocks a run.
//
// Every kill appends one line to _test/test-results/guard.log, resolved
// from this file's repo root rather than the caller's cwd. A pid once
// seen under the child stays watched after a reparent, so a detached
// grandchild that outlives its parent still counts against the ceilings
// and still dies; the run ends only when every seen pid is gone.

import { execFileSync, spawn } from 'node:child_process';
import { appendFileSync, closeSync, mkdirSync, openSync, writeSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { StringDecoder } from 'node:string_decoder';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = fileURLToPath(new URL('..', import.meta.url));
const LOG_FILE = join(REPO_ROOT, '_test', 'test-results', 'guard.log');
const TAIL_LINES = 60;


/********************************************************************
Parse one numeric option value; reject anything not a positive finite
number so a malformed invocation fails fast instead of silently running
with defaults.

@param {String} name  - Option name for the error message
@param {String} value - Raw value

@return {Number} - The parsed number
*********************************************************************/
function numberOption (name, value) {

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    process.stderr.write('guard: ' + name + ' expects a positive number, got "' + value + '"\n');
    process.exit(2);
  }
  return parsed;

}


const args = process.argv.slice(2);
const separator = args.indexOf('--');
if (separator === -1 || separator === args.length - 1) {
  process.stderr.write('usage: node scripts/guard.js [--seconds N] [--proc-mb N] [--tree-mb N] [--sample-ms N] [--log FILE] -- <command> [args...]\n');
  process.exit(2);
}

let seconds = numberOption('--seconds', process.env.GUARD_SECONDS || 1800);
let procMb = numberOption('--proc-mb', process.env.GUARD_PROC_MB || 6144);
let treeMb = numberOption('--tree-mb', process.env.GUARD_TREE_MB || 12288);
let sampleMs = numberOption('--sample-ms', process.env.GUARD_SAMPLE_MS || 1000);
let logFile = process.env.GUARD_LOG === undefined
  ? join(REPO_ROOT, '_test', 'test-results', 'last-run.log')
  : resolve(process.env.GUARD_LOG);
const options = args.slice(0, separator);
for (let index = 0; index < options.length; index += 1) {
  const option = options[index];
  const pair = option.split('=');
  const name = pair[0];
  const value = pair.length > 1 ? pair.slice(1).join('=') : options[index + 1];
  if (pair.length === 1) {
    index += 1;
  }
  if (name === '--seconds') {
    seconds = numberOption(name, value);
  } else if (name === '--proc-mb') {
    procMb = numberOption(name, value);
  } else if (name === '--tree-mb') {
    treeMb = numberOption(name, value);
  } else if (name === '--sample-ms') {
    sampleMs = numberOption(name, value);
  } else if (name === '--log') {
    if (value === undefined || value === '') {
      process.stderr.write('guard: --log expects a file path\n');
      process.exit(2);
    }
    logFile = resolve(value);
  } else {
    process.stderr.write('guard: unknown option ' + option + '\n');
    process.exit(2);
  }
}

const command = args[separator + 1];
const commandArgs = args.slice(separator + 2);

// The child gets a 4 GB old-space ceiling unless its environment already
// names one (verify's fire step pins 3072 and must keep it)
const env = { ...process.env };
if (!/max-old-space-size/.test(env.NODE_OPTIONS || '')) {
  env.NODE_OPTIONS = ((env.NODE_OPTIONS || '') + ' --max-old-space-size=4096').trim();
}

// stdout and stderr are piped, never inherited: every chunk goes to the
// log file (truncated each run) and to a bounded tail replayed at the
// end; stdin stays inherited so an interactive child still works
let logFd;
try {
  mkdirSync(dirname(logFile), { recursive: true });
  logFd = openSync(logFile, 'w');
} catch (error) {
  process.stderr.write('guard: cannot open ' + logFile + ' for writing: ' + error.message + '\n');
  process.exit(2);
}

const child = spawn(command, commandArgs, { stdio: ['inherit', 'pipe', 'pipe'], detached: true, env: env });
const started = Date.now();
let settled = false;
let psWarned = false;
let lastOrder = [child.pid];
let childDone = false;
let childCode = null;
let childSignal = null;
const seen = new Set();
const tail = [];
const decoder = new StringDecoder('utf8');
let pending = '';


/********************************************************************
Append one chunk of child output to the log file and to the bounded
tail. The log gets every byte; the tail keeps the last TAIL_LINES
complete lines, so the guard holds no unbounded buffer.

@param {Buffer} chunk - Child output
*********************************************************************/
function record (chunk) {

  writeSync(logFd, chunk);
  pending += decoder.write(chunk);
  const lines = pending.split('\n');
  pending = lines.pop();
  for (const line of lines) {
    tail.push(line);
    if (tail.length > TAIL_LINES) {
      tail.shift();
    }
  }

}


/********************************************************************
Flush the partial line, then write the tail to stderr and stdout behind
one GUARD: log line naming the file, and close the log. Called on every
exit path that let the child produce output. Stdout carries it too so a
caller that only collects stdout (the fire runner's zero-match check)
still sees the child's last lines.
*********************************************************************/
function replayTail () {

  pending += decoder.end();
  if (pending !== '') {
    tail.push(pending);
    if (tail.length > TAIL_LINES) {
      tail.shift();
    }
    pending = '';
  }
  const banner = 'GUARD: log ' + logFile + ' (' + tail.length + ' lines)\n';
  writeSync(2, banner);
  writeSync(1, banner);
  for (const line of tail) {
    writeSync(2, line + '\n');
    writeSync(1, line + '\n');
  }
  try {
    closeSync(logFd);
  } catch {
    // Already closed
  }

}


/********************************************************************
Snapshot the process table and reduce it to the child's tree plus every
pid ever seen under it that is still alive (a reparented descendant).

@param {Number} rootPid - The child's pid

@return {Object} - { order: pids deepest-first with the child last,
  maxPid/maxRssMb: the largest resident process, treeMb: total }
*********************************************************************/
function sampleTree (rootPid) {

  const table = execFileSync('ps', ['-axo', 'pid=,ppid=,rss='], { encoding: 'utf8' });
  const children = new Map();
  const rssKb = new Map();
  for (const line of table.split('\n')) {
    const fields = line.trim().split(/\s+/);
    if (fields.length < 3) {
      continue;
    }
    const pid = Number(fields[0]);
    const ppid = Number(fields[1]);
    const rss = Number(fields[2]);
    if (!Number.isFinite(pid) || !Number.isFinite(ppid) || !Number.isFinite(rss)) {
      continue;
    }
    rssKb.set(pid, rss);
    if (!children.has(ppid)) {
      children.set(ppid, []);
    }
    children.get(ppid).push(pid);
  }

  // Post-order walk: descendants deepest first, the root last
  const order = [];
  const walk = function (pid) {
    for (const descendant of children.get(pid) || []) {
      walk(descendant);
    }
    order.push(pid);
  };
  walk(rootPid);

  // A pid once under the root stays watched after a reparent: a detached
  // grandchild that outlives its parent still counts and still dies
  const walked = new Set(order);
  for (const pid of walked) {
    seen.add(pid);
  }
  for (const pid of seen) {
    if (!rssKb.has(pid)) {
      seen.delete(pid);
    } else if (!walked.has(pid)) {
      order.unshift(pid);
    }
  }

  let maxPid = rootPid;
  let maxRssMb = 0;
  let treeRssKb = 0;
  for (const pid of order) {
    const rss = rssKb.get(pid) || 0;
    treeRssKb += rss;
    if (rss > maxRssMb * 1024) {
      maxRssMb = rss / 1024;
      maxPid = pid;
    }
  }

  return { order: order, maxPid: maxPid, maxRssMb: maxRssMb, treeMb: treeRssKb / 1024 };

}


/********************************************************************
SIGKILL every pid in the order `sampleTree` returned (deepest first, the
child last), then the child's whole process group - the child was
spawned detached, so anything the pid list missed still dies. Pids and
groups already gone are ignored.

@param {Array}  order   - Pids deepest-first
@param {Number} rootPid - The child's pid, also its process group id
*********************************************************************/
function killTree (order, rootPid) {

  for (const pid of order) {
    try {
      process.kill(pid, 'SIGKILL');
    } catch {
      // Already gone
    }
  }
  try {
    process.kill(-rootPid, 'SIGKILL');
  } catch {
    // Group already gone
  }

}


/********************************************************************
Send a signal to the last known tree; fall back to the child alone when
`ps` is unavailable.

@param {String} signal - Signal name
*********************************************************************/
function signalTree (signal) {

  let order = lastOrder;
  try {
    order = sampleTree(child.pid).order;
  } catch {
    // Keep the previous snapshot
  }
  for (const pid of order) {
    try {
      process.kill(pid, signal);
    } catch {
      // Already gone
    }
  }

}


/********************************************************************
End the run with the child's own exit code: the GUARD: log line, the
tail, then the documented code.
*********************************************************************/
function finish () {

  settled = true;
  clearInterval(timer);
  replayTail();
  process.exit(childSignal ? 1 : (childCode === null ? 1 : childCode));

}


/********************************************************************
Report a kill and finish: one GUARD: line to stderr and the log file,
the tail, then the documented exit code.

@param {String} reason - 'memory' or 'time'
@param {Object} sample - Last sampleTree result
*********************************************************************/
function terminate (reason, sample) {

  settled = true;
  clearInterval(timer);
  killTree(sample.order, child.pid);
  const line = 'GUARD: killed ' + reason +
    ' pid=' + sample.maxPid +
    ' rss=' + Math.round(sample.maxRssMb) +
    ' tree=' + Math.round(sample.treeMb) +
    ' after ' + Math.round((Date.now() - started) / 1000) + 's: ' +
    [command].concat(commandArgs).join(' ');
  writeSync(2, line + '\n');
  try {
    mkdirSync(join(REPO_ROOT, '_test', 'test-results'), { recursive: true });
    appendFileSync(LOG_FILE, line + '\n');
  } catch {
    // The log is best-effort; the kill already happened
  }
  replayTail();
  process.exit(reason === 'memory' ? 137 : 124);

}


const timer = setInterval(function () {

  if (settled) {
    return;
  }
  let sample;
  try {
    sample = sampleTree(child.pid);
  } catch (error) {
    if (!psWarned) {
      psWarned = true;
      process.stderr.write('GUARD: ps failed (' + error.message + '); memory containment off, the wall clock still applies\n');
    }
    if (childDone) {
      finish();
    }
    return;
  }
  lastOrder = sample.order;

  // The child is gone; the run ends when every pid it ever had is gone
  if (childDone && seen.size === 0) {
    finish();
    return;
  }

  // The per-process ceiling names the fattest descendant; the tree ceiling
  // catches many small processes that are one runaway in aggregate
  const memoryExceeded = sample.maxRssMb > procMb || sample.treeMb > treeMb;
  if (memoryExceeded) {
    terminate('memory', sample);
    return;
  }
  if (Date.now() - started > seconds * 1000) {
    terminate('time', sample);
  }

}, sampleMs);

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, function () {
    signalTree(signal);
    process.exit(1);
  });
}

child.on('error', function (error) {
  settled = true;
  clearInterval(timer);
  process.stderr.write('guard: cannot spawn ' + command + ': ' + error.message + '\n');
  process.exit(127);
});

// 'close' waits for the piped streams to drain, so the last bytes of a
// dying child still reach the log before the exit decision
child.on('close', function (code, signal) {
  if (settled) {
    return;
  }
  childDone = true;
  childCode = code;
  childSignal = signal;

  // A detached descendant can outlive the child; one last sample tells
  // whether the run ends now or keeps watching the orphans until they go
  try {
    sampleTree(child.pid);
  } catch {
    seen.clear();
  }
  if (seen.size === 0) {
    finish();
  }
});

child.stdout.on('data', record);
child.stderr.on('data', record);
