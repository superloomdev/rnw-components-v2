// Info: The fire runner's proof classifier. A mutation counts as firing
// only when the child ran the suite and failed by assertion; a child that
// dies (signal kill, heap tripwire, harness error) says nothing about the
// planted edit and must never mark a row FIRED.
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { isMutationProof } from './fire-selection.js';

test('status 1 with a failing-test marker is a mutation proof', function () {
  assert.equal(isMutationProof({ status: 1, signal: null, stdout: '  ✖ failing tests:\n✖ t (1ms)\n', stderr: '' }), true);
  assert.equal(isMutationProof({ status: 1, signal: null, stdout: '  3 failed (2.1s)\n', stderr: '' }), true);
  assert.equal(isMutationProof({ status: 1, signal: null, stdout: 'not ok 1 - x\n', stderr: '' }), true);
});

test('a signal-killed child is not a mutation proof', function () {
  assert.equal(isMutationProof({ status: null, signal: 'SIGKILL', stdout: 'partial output', stderr: '' }), false);
  assert.equal(isMutationProof({ status: null, signal: 'SIGTERM', stdout: '', stderr: 'terminated' }), false);
});

test('a non-failure status is not a mutation proof', function () {
  assert.equal(isMutationProof({ status: 137, signal: null, stdout: '', stderr: '' }), false);
  assert.equal(isMutationProof({ status: 134, signal: null, stdout: 'FATAL ERROR: heap', stderr: '' }), false);
  assert.equal(isMutationProof({ status: 2, signal: null, stdout: '✖ something', stderr: '' }), false);
});
