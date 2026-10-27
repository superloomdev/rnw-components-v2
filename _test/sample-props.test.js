// Info: The measured-page prop filter: a state the reference re-opens by
// click mounts without its seeded `open`, so the harness click opens the
// panel at the pinned scroll on both pages (batch 15 rework 1 I-5).

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { measuredProps } from './harness/sample-props.js';

const REOPEN = Object.freeze({ states: Object.freeze(['open', 'sm']), ours: 'button', upstream: 'button', when: Object.freeze({ ours: '[role="menu"]', upstream: '[role="menu"]' }) });

test('a reopen state drops the seeded open prop', function () {
  const out = measuredProps({ reopen: REOPEN }, 'open', { open: true, items: [] });
  assert.equal(out.open, undefined);
  assert.ok(Array.isArray(out.items));
});

test('a state the reference does not re-open keeps open', function () {
  const props = { open: true };
  assert.equal(measuredProps({ reopen: REOPEN }, 'default', props), props);
});

test('a reference without reopen keeps open', function () {
  const props = { open: true };
  assert.equal(measuredProps({}, 'open', props), props);
});
