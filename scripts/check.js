// Info: Inner-loop check for one component: `npm run check -- <Name>`.
// Lints the files changed in the working tree, runs the purity scan, this
// component's own test file when it has one, and its accessibility-identity
// rows. Fast by design; `npm run batch` and `npm run verify` run everything.

import { execSync, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { REPO_ROOT, discoverComponents, toFileStem } from './lib/components.js';

const name = process.argv[2];
if (!name) {
  process.stdout.write('usage: npm run check -- <ComponentName>\n');
  process.exit(2);
}

const components = await discoverComponents();
const component = components.find(function (entry) {
  return entry.name === name;
});
if (!component) {
  process.stdout.write('check: no component folder for "' + name + '" (' + components.map(function (entry) {
    return entry.name;
  }).join(', ') + ')\n');
  process.exit(2);
}

const failed = [];


/********************************************************************
Run one named step, recording failure without stopping.

@param {String} label - Step label
@param {String} cmd   - Command
@param {Array}  args  - Arguments
@param {String} cwd   - Working directory
*********************************************************************/
function step (label, cmd, args, cwd) {

  process.stdout.write('\n=== ' + label + ' ===\n');
  const result = spawnSync(cmd, args, { cwd: cwd || REPO_ROOT, stdio: 'inherit' });
  if (result.status !== 0) {
    failed.push(label);
  }

}


// Lint the changed files (tracked changes and untracked additions)
const changed = execSync('git diff --name-only HEAD; git ls-files --others --exclude-standard', { cwd: REPO_ROOT, encoding: 'utf8' })
  .split('\n').filter(function (file) {
    return file.endsWith('.js') && !file.startsWith('_test/') && existsSync(join(REPO_ROOT, file));
  });
if (changed.length > 0) {
  step('eslint on ' + changed.length + ' changed file(s)', 'npx', ['eslint'].concat(changed));
} else {
  process.stdout.write('eslint: no changed source files\n');
}

// Purity over the shipped source
step('purity', 'node', ['--import', './harness/register.js', '--test', 'purity.test.js'], join(REPO_ROOT, '_test'));

// The component's own tests, when it has a file
const own = join(REPO_ROOT, '_test', toFileStem(name) + '.test.js');
if (existsSync(own)) {
  step(name + ' tests', 'node', ['--import', './harness/register.js', '--test', toFileStem(name) + '.test.js'], join(REPO_ROOT, '_test'));
} else {
  process.stdout.write(name + ': no _test/' + toFileStem(name) + '.test.js yet\n');
}

// Its accessibility-identity rows
step(name + ' a11y identity', 'node', ['--import', './harness/register.js', '--test', '--test-name-pattern=^' + name + ' /', 'a11y-identity.test.js'], join(REPO_ROOT, '_test'));

process.stdout.write('\n' + (failed.length === 0 ? 'check: ' + name + ' passed' : 'check: ' + name + ' FAILED: ' + failed.join(', ')) + '\n');
process.exit(failed.length === 0 ? 0 : 1);
