// Info: Docs gate. The committed docs/components pages equal a fresh
// regeneration into a temp directory, byte for byte; every roster flag that
// demands an explanation on a built component is explained in notes.md.

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { REPO_ROOT, discoverComponents, getRoster } from '../scripts/lib/components.js';

const COMMITTED = join(REPO_ROOT, 'docs', 'components');
const EXPLAINED_FLAGS = ['deferred_gap', 'no_reference', 'superloom_decision', 'web_only', 'requires_parent'];


describe('docs: generated pages', function () {

  test('committed docs/components equals a fresh regeneration', function () {
    const temp = mkdtempSync(join(tmpdir(), 'rnw-docs-'));
    try {
      execFileSync('node', [join(REPO_ROOT, 'scripts', 'docs-generate.js'), temp], { stdio: 'pipe' });
      const fresh = readdirSync(temp).sort();
      assert.ok(fresh.length >= 1, 'the generator wrote nothing');
      assert.ok(existsSync(COMMITTED), 'docs/components is missing; run node scripts/docs-generate.js');
      assert.deepEqual(readdirSync(COMMITTED).sort(), fresh, 'the set of family pages differs');
      for (const file of fresh) {
        assert.equal(readFileSync(join(COMMITTED, file), 'utf8'), readFileSync(join(temp, file), 'utf8'),
          file + ' is stale; run node scripts/docs-generate.js and commit');
      }
    } finally {
      rmSync(temp, { recursive: true, force: true });
    }
  });

  test('every flag that demands an explanation is explained in notes.md', async function () {
    const components = await discoverComponents();
    const rows = {};
    for (const row of getRoster().rows) {
      rows[row.name] = row;
    }
    for (const component of components) {
      const flags = rows[component.name].flags.filter(function (flag) {
        return EXPLAINED_FLAGS.includes(flag);
      });
      if (flags.length === 0) {
        continue;
      }
      const notes = readFileSync(component.files.notes, 'utf8');
      for (const flag of flags) {
        assert.ok(notes.includes(flag), component.name + ': notes.md does not mention the flag `' + flag + '`');
      }
    }
  });

});
