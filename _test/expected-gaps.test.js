// Info: expected-gap consumption for the primary gates (FIDELITY RULES 5).
import test from 'node:test';
import assert from 'node:assert/strict';
import { explainDisagreements } from './harness/expected-gaps.js';

const gaps = [
  { check: 'measure', component: 'X', part: 'term', property: 'height', request: 'type.x', wave: 'w' },
  { check: 'measure', component: 'X', part: 'other', property: '*', request: 'type.y', wave: 'w' },
  { check: 'fidelity', component: 'X', part: 'term', property: 'height', request: 'type.z', wave: 'w' }
];

test('expected gaps: matching lines are set aside, non-matching stay', function () {
  const lines = ['default / term / height: 25 here, 21 upstream', 'default / other / x: 1 here, 2 upstream', 'default / third / y: 1 here, 2 upstream'];
  const out = explainDisagreements(lines, gaps, 'X', 'measure');
  assert.deepEqual(out.unexplained, ['default / third / y: 1 here, 2 upstream']);
  assert.equal(out.explained.length, 2);
});

test('expected gaps: a gap that no longer reproduces is stale', function () {
  const out = explainDisagreements(['default / term / height: 25 here, 21 upstream'], [gaps[0]], 'X', 'measure');
  assert.equal(out.stale.length, 0);
  const stale = explainDisagreements(['default / third / y: 1 here, 2 upstream'], [gaps[0]], 'X', 'measure');
  assert.equal(stale.stale.length, 1);
  // A non-matching check consumes nothing
  const none = explainDisagreements(['default / term / height: 25 here, 21 upstream'], gaps, 'X', 'perceptual-visible');
  assert.equal(none.explained.length, 0);
});
