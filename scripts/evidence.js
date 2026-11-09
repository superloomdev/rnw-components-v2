// Info: Writes the evidence numbers a batch or milestone reports, computed
// from the repository and the last test outputs, never typed: roster status
// counts, components exported, Node and browser test counts, gate count,
// fire rows, docs pages. Appends one dated block to the evidence file.
//
// Usage: node scripts/evidence.js --label "<text>" [--out <path>]

import { execSync } from 'node:child_process';
import { appendFileSync, existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
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

// The TEST MATRIX cells (plan ## TEST MATRIX) and whether this run's
// artifacts prove each ran. Detection reads the machine outputs only -
// the Playwright report's spec titles, the node TAP file, the fire log -
// never a hand-edited list.
const browserTitles = [];
if (existsSync(pw)) {
  const collect = function (suites) {
    for (const suite of suites) {
      for (const spec of suite.specs || []) {
        browserTitles.push(suite.title + ' > ' + spec.title);
      }
      collect(suite.suites || []);
    }
  };
  collect(JSON.parse(readFileSync(pw, 'utf8')).suites || []);
}
const nodeRan = existsSync(tap);
const fireLog = join(RESULTS, 'fire.txt');
const fireRan = existsSync(fireLog) && /fired and recovered/.test(readFileSync(fireLog, 'utf8'));
const specRan = function (fragment) {
  return browserTitles.some(function (title) {
    return title.indexOf(fragment) !== -1;
  });
};

const WIDTH_TO_CLASS = { '375': 'compact', '768': 'medium', '1280': 'expanded' };
const matrix = [];
for (const template of ['default', 'carbon']) {
  for (const width of ['375', '768', '1280']) {
    const form = WIDTH_TO_CLASS[width];
    matrix.push({
      cell: 'structural ' + template + ' light ' + form,
      ran: specRan('structural: ' + template + ' @ ' + width)
    });
    matrix.push({
      cell: 'structural ' + template + ' dark ' + form,
      ran: false,
      note: 'dark schemes run at the milestone sweep'
    });
  }
  matrix.push({
    cell: 'structural ' + template + ' light compact textScale=2',
    ran: specRan('a text scale of 2 clips and overflows no text at the compact width')
  });
  matrix.push({
    cell: 'structural ' + template + ' light compact adaptive=fixed',
    ran: specRan('adaptive fixed at a compact width builds the expanded token map')
  });
  matrix.push({
    cell: 'structural ' + template + ' light expanded rtl',
    ran: specRan('every structural clause holds under rtl at the expanded width')
  });
}
matrix.push({ cell: 'accessibility tree identity across the three templates', ran: specRan('the accessibility tree is identical under every template') });
matrix.push({ cell: 'measurement, fidelity and perceptual at expanded light', ran: specRan('measure:') || specRan('perceptual') || specRan('fidelity') });
matrix.push({ cell: 'measurement, fidelity and perceptual at expanded dark', ran: false, note: 'dark schemes run at the milestone sweep' });
matrix.push({ cell: 'node gates including the nine adaptive tests', ran: nodeRan });
matrix.push({ cell: 'fire rows fired and recovered', ran: fireRan, note: fireRan ? undefined : 'run node fire.js with output at ' + fireLog });
matrix.push({ cell: 'brand reach e2e across the sample brands', ran: false, note: 'demo e2e (batch A2)' });
matrix.push({ cell: 'accessibility identity across brands and form classes', ran: false, note: 'demo e2e (batch A2)' });
matrix.push({ cell: 'native gate: iPhone and Android phone at compact', ran: false, note: 'native gate at milestone close' });
matrix.push({ cell: 'native gate: iPad portrait/landscape and Android tablet', ran: false, note: 'native gate with tablets=true at M5 close' });
matrix.push({ cell: 'desktop hosts (Electron, macOS, Windows)', ran: false, note: 'declared untested - decision 31' });

const matrixText = [
  'TEST MATRIX - ' + LABEL + ' (' + new Date().toISOString() + ')',
  'commit ' + head,
  matrix.map(function (entry) {
    return (entry.ran ? 'run     ' : 'not-run ') + entry.cell + (entry.note ? '  (' + entry.note + ')' : '');
  }).join('\n'),
  ''
].join('\n');
// matrix.txt lives beside the evidence file the run was labelled into
writeFileSync(join(resolve(OUT, '..'), 'matrix.txt'), matrixText);

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
