// Info: Static integrity of the fire manifest. The fire runner proves each
// row's test fails when its production edit is applied, but it runs only at
// `verify`; a source change that rewrites a row's planted line leaves the row
// unable to plant anything, and that surfaced only after a full clean
// install. This checks every row in seconds: its file exists, its search
// string is present, and the test file it names exists.

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { REPO_ROOT } from '../scripts/lib/components.js';

const MANIFEST = JSON.parse(readFileSync(join(REPO_ROOT, '_test', 'fixtures', 'assertion-integrity.json'), 'utf8'));


describe('fire manifest', function () {

  test('help and invalid arguments never start mutation rows', function () {
    const sandbox = mkdtempSync(join(tmpdir(), 'rnw-fire-cli-'));
    try {
      copyFileSync(join(REPO_ROOT, '_test', 'fire.js'), join(sandbox, 'fire.mjs'));
      mkdirSync(join(sandbox, 'fixtures'));
      writeFileSync(join(sandbox, 'fixtures', 'assertion-integrity.json'), JSON.stringify({ rows: [] }));
      // Even a regressed parser can only see this empty sandbox manifest.
      for (const [args, status] of [[['--help'], 0], [['--invalid'], 2], [['--only'], 2], [['--only', 'not-a-real-row'], 2]]) {
        const run = spawnSync(process.execPath, ['fire.mjs'].concat(args), {
          cwd: sandbox,
          encoding: 'utf8',
          timeout: 2000
        });
        assert.equal(run.status, status, JSON.stringify(args) + ': ' + run.stderr);
        if (args[0] === '--help') {
          assert.match(run.stdout, /^usage: node fire\.js/);
        }
        assert.doesNotMatch(run.stdout, /FIRED|NOT-FIRED|BROKEN/);
      }
    } finally {
      rmSync(sandbox, { recursive: true, force: true });
    }
  });

  test('ids are unique', function () {
    const ids = MANIFEST.rows.map(function (row) {
      return row.id;
    });
    assert.deepEqual(ids.filter(function (id, index) {
      return ids.indexOf(id) !== index;
    }), []);
  });

  for (const row of MANIFEST.rows) {
    test(row.id + ': the planted line is present in ' + row.file + ' and the named test file exists', function () {
      const file = join(REPO_ROOT, row.file);
      assert.ok(existsSync(file), row.file + ' does not exist');
      assert.ok(readFileSync(file, 'utf8').includes(row.find), 'search string not found: ' + JSON.stringify(row.find));
      assert.notEqual(row.find, row.replace, 'the edit changes nothing');
      assert.ok(existsSync(join(REPO_ROOT, '_test', row.test)), row.test + ' does not exist');
    });
  }

});
