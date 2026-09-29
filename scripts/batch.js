// Info: Batch-speed verification, run by LOW every 8-12 components: every
// Node gate, the browser gates against the fresh bundle, docs regeneration,
// then the defects list and the evidence block from the machine output.
// Does not reinstall; `npm run verify` does that before a push to main.

import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

import { REPO_ROOT } from './lib/components.js';

const TEST = join(REPO_ROOT, '_test');
const failed = [];


/********************************************************************
Run one step, recording failure without stopping the batch.

@param {String} label - Step label
@param {String} cmd   - Command
@param {Array}  args  - Arguments
@param {String} cwd   - Working directory
*********************************************************************/
function step (label, cmd, args, cwd) {

  process.stdout.write('\n=== ' + label + ' ===\n');
  const result = spawnSync(cmd, args, { cwd: cwd, stdio: 'inherit' });
  if (result.status !== 0) {
    failed.push(label);
  }

}


step('docs regenerate', 'node', ['scripts/docs-generate.js'], REPO_ROOT);
step('eslint', 'npx', ['eslint', '.'], REPO_ROOT);
step('node gates', 'npm', ['test'], TEST);
step('browser gates', 'npm', ['run', 'test:browser'], TEST);

// Defects and evidence are written from the outputs above whatever they were
spawnSync('node', ['scripts/defects.js'], { cwd: REPO_ROOT, stdio: 'inherit' });
spawnSync('node', ['scripts/evidence.js', '--label', 'batch'], { cwd: REPO_ROOT, stdio: 'inherit' });

process.stdout.write('\n' + (failed.length === 0 ? 'batch: passed' : 'batch: FAILED: ' + failed.join(', ')) + '\n');
process.exit(failed.length === 0 ? 0 : 1);
