// Info: Static integrity of the fire manifest. The fire runner proves each
// row's test fails when its production edit is applied, but it runs only at
// `verify`; a source change that rewrites a row's planted line leaves the row
// unable to plant anything, and that surfaced only after a full clean
// install. This checks every row in seconds: its file exists, its search
// string is present, and the test file it names exists.

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { REPO_ROOT } from '../scripts/lib/components.js';

const MANIFEST = JSON.parse(readFileSync(join(REPO_ROOT, '_test', 'fixtures', 'assertion-integrity.json'), 'utf8'));


describe('fire manifest', function () {

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
