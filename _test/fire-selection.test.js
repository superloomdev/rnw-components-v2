import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getFireSelection } from './fire-selection.js';

const fixture = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(function (id) { return { id }; });
const ids = function (selection) { return selection.rows.map(function (row) { return row.id; }); };

describe('getFireSelection', function () {

  test('keeps the default manifest and exact single-row selection', function () {
    assert.deepEqual(ids(getFireSelection(fixture, [])), ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']);
    assert.deepEqual(ids(getFireSelection(fixture, ['--only', 'd'])), ['d']);
    assert.deepEqual(getFireSelection(fixture, ['--help']), { help: true, rows: [] });
  });

  test('partitions known rows into exact disjoint shards', function () {
    assert.deepEqual(ids(getFireSelection(fixture, ['--shard', '1/4'])), ['a', 'e']);
    assert.deepEqual(ids(getFireSelection(fixture, ['--shard', '2/4'])), ['b', 'f']);
    assert.deepEqual(ids(getFireSelection(fixture, ['--shard', '3/4'])), ['c', 'g']);
    assert.deepEqual(ids(getFireSelection(fixture, ['--shard', '4/4'])), ['d', 'h']);
  });

  test('covers the real manifest exactly once across the four CI shards', function () {
    const rows = JSON.parse(readFileSync(new URL('./fixtures/assertion-integrity.json', import.meta.url))).rows;
    const expected = rows.map(function (row) { return row.id; }).sort();
    const actual = [1, 2, 3, 4].flatMap(function (index) {
      return ids(getFireSelection(rows, ['--shard', index + '/4']));
    }).sort();
    assert.deepEqual(actual, expected);
    assert.equal(new Set(actual).size, expected.length);
  });

  test('rejects malformed, empty and conflicting selections before mutation', function () {
    for (const args of [
      ['--help', 'extra'], ['--only'], ['--only', 'missing'],
      ['--shard', '0/4'], ['--shard', '1/0'], ['--shard', '5/4'],
      ['--shard', '1.5/4'], ['--shard', '01/4'], ['--shard', '1/4junk'],
      ['--shard', '1/9007199254740992'], ['--shard', '9/9'],
      ['--shard', '1/4', '--only', 'a'], ['--unknown', '1/4']
    ]) {
      assert.throws(function () { getFireSelection(fixture, args); }, Error, JSON.stringify(args));
    }
  });

});
