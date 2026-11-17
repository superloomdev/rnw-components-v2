// Info: The assertion guard of the test host (harness/assert-guard.js): a
// live object never reaches node:assert, so a failing assertion prints a
// few words, never a DOM graph. The failure text is measured here.
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import legacy from 'node:assert';

import { getLabel, isLive } from './harness/assert-guard.js';

const LIMIT = 600;


/********************************************************************
Run an assertion that must fail and return what its error would print.

@param {Function} run - Calls the failing assertion

@return {Object} - { text: message plus both operands as text, error }
*********************************************************************/
function failureOf (run) {

  // The assertion must throw
  let error = null;
  try {
    run();
  } catch (caught) {
    error = caught;
  }
  if (error === null) {
    return { text: null, error: null };
  }

  // What a reporter would print: the message and the two operands
  return { text: String(error.message) + ' ' + String(error.actual) + ' ' + String(error.expected), error: error };

}


describe('assert guard', function () {

  test('a DOM node, an event and a style object are live; data is not', function () {
    const node = document.createElement('div');
    assert.equal(isLive(node), true);
    assert.equal(isLive(document), true);
    assert.equal(isLive(new Event('click')), true);
    assert.equal(isLive(node.style), true);
    assert.equal(isLive(null), false);
    assert.equal(isLive('text'), false);
    assert.equal(isLive({ a: 1 }), false);
    assert.equal(isLive([1, 2]), false);
    assert.equal(isLive(new Date(0)), false);
  });

  test('a node is named by its tag and identifying attributes', function () {
    const node = document.createElement('div');
    node.setAttribute('role', 'menu');
    node.setAttribute('data-part', 'panel');
    assert.equal(getLabel(node), '<div role="menu" data-part="panel">');
  });

  test('a failing identity assertion over a node prints a bounded message and holds no node', function () {
    const node = document.createElement('div');
    node.setAttribute('role', 'menu');
    document.body.appendChild(node);
    const failure = failureOf(function () {
      assert.equal(node, null, 'the panel is closed');
    });
    document.body.removeChild(node);
    assert.equal(failure.text === null, false);
    assert.equal(failure.text.length < LIMIT, true);
    assert.equal(typeof failure.error.actual, 'string');
    assert.equal(failure.error.actual.indexOf('<div role="menu">') !== -1, true);
  });

  test('identity is kept: the same node passes, two nodes fail', function () {
    const one = document.createElement('span');
    const other = document.createElement('span');
    assert.equal(one, one);
    assert.notEqual(one, other);
    assert.equal(failureOf(function () { assert.equal(one, other); }).text === null, false);
    assert.equal(failureOf(function () { assert.notEqual(one, one); }).text === null, false);
    assert.equal(failureOf(function () { legacy.strictEqual(one, other); }).text.length < LIMIT, true);
  });

  test('a list of nodes compares by identity and prints bounded', function () {
    const one = document.createElement('li');
    const other = document.createElement('li');
    assert.deepEqual([one, other], [one, other]);
    const failure = failureOf(function () {
      assert.deepEqual([one, other], [other, one]);
    });
    assert.equal(failure.text === null, false);
    assert.equal(failure.text.length < LIMIT, true);
  });

  test('plain values are untouched', function () {
    assert.equal(1, 1);
    assert.deepEqual({ a: [1, 2] }, { a: [1, 2] });
    const failure = failureOf(function () { assert.equal('a', 'b'); });
    assert.equal(failure.error.actual, 'a');
    assert.equal(failure.error.expected, 'b');
  });

});
