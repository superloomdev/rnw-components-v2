// Info: The names gate (G18, `scripts/names-check.js`) as a Node test, so the
// fire manifest can plant a name that starts with an underscore and watch
// this fail. A name we declare never starts with an underscore; the
// allowlist and the definition of text live in the script.

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { checkRepository, runSelftest } from '../scripts/names-check.js';


describe('names: no name starts with an underscore', function () {

  test('the reader finds every planted name and reads no text as one', function () {
    assert.equal(runSelftest(), true);
  });

  test('no tracked file declares a name that starts with an underscore', function () {
    assert.deepEqual(checkRepository(), []);
  });

});
