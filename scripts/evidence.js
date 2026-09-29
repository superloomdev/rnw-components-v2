// Info: Writes the evidence numbers a batch or milestone reports, computed
// from the repository and the last test outputs, never typed: roster status
// counts, components exported, Node and browser test counts, gate count,
// fire rows, docs pages. Appends one dated block to the evidence file.
//
// Usage: node scripts/evidence.js --label "<text>" [--out <path>]

import { execSync } from 'node:child_process';
import { appendFileSync, existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { REPO_ROOT, getRoster } from './lib/components.js';

const arg = function (flag, fallback) {
  const index = process.argv.indexOf(flag);
  return index === -1 ? fallback : process.argv[index + 1];
};
const LABEL = arg('--label', 'evidence');
const OUT = resolve(arg('--out', join(REPO_ROOT, '..', '__dev__', 'evidence', '0160', 'batches.txt')));
const RESULTS = join(REPO_ROOT, '_test', 'test-results');

const roster = getRoster();
const status = {};
for (const row of roster.rows) {
  status[row.status] = (status[row.status] || 0) + 1;
}

const exported = Object.keys(await import(join(REPO_ROOT, 'all.js'))).length;

const census = execSync('node scripts/ci-census.js --json', { cwd: REPO_ROOT, encoding: 'utf8' });
const gates = JSON.parse(census).filter(function (step) {
  return /^G\d+/.test(step.name);
}).length;

const manifest = JSON.parse(readFileSync(join(REPO_ROOT, '_test', 'fixtures', 'assertion-integrity.json'), 'utf8'));

let node = '-';
const tap = join(RESULTS, 'node.tap');
if (existsSync(tap)) {
  const text = readFileSync(tap, 'utf8');
  node = 'tests ' + ((text.match(/^# tests (\d+)/m) || [])[1] || '?') + ' pass ' + ((text.match(/^# pass (\d+)/m) || [])[1] || '?') + ' fail ' + ((text.match(/^# fail (\d+)/m) || [])[1] || '?');
}

let browser = '-';
const pw = join(RESULTS, 'browser.json');
if (existsSync(pw)) {
  const report = JSON.parse(readFileSync(pw, 'utf8'));
  browser = 'expected ' + report.stats.expected + ' unexpected ' + report.stats.unexpected + ' skipped ' + report.stats.skipped;
}

const docsDir = join(REPO_ROOT, 'docs', 'components');
const pages = existsSync(docsDir) ? readdirSync(docsDir).length : 0;
const head = execSync('git log -1 --format=%h', { cwd: REPO_ROOT, encoding: 'utf8' }).trim();

const block = [
  LABEL + ' (' + new Date().toISOString() + ')',
  '  commit ' + head,
  '  roster ' + Object.keys(status).sort().map(function (key) {
    return key + ' ' + status[key];
  }).join(', ') + ' (' + roster.rows.length + ' rows)',
  '  all.js exports ' + exported,
  '  node tests: ' + node,
  '  browser tests: ' + browser,
  '  enforcement gates: ' + gates + '; fire rows: ' + manifest.rows.length,
  '  docs pages: ' + pages,
  ''
].join('\n');

appendFileSync(OUT, block + '\n');
process.stdout.write(block);
