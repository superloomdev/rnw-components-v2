// Info: The perceptual harness's own unit tests: unionBox, the box every
// sample-box crop is taken from (D39-3).

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { unionBox, windowFor } from './harness/perceptual.js';

describe('perceptual harness: unionBox', function () {

  test('unionBox holds two disjoint boxes', function () {
    assert.deepEqual(unionBox([{ x: 0, y: 0, width: 10, height: 10 }, { x: 20, y: 30, width: 5, height: 5 }]),
      { x: 0, y: 0, width: 25, height: 35 });
    assert.deepEqual(unionBox([{ x: 20, y: 30, width: 5, height: 5 }, { x: 0, y: 0, width: 10, height: 10 }]),
      { x: 0, y: 0, width: 25, height: 35 });
  });

  test('unionBox ignores zero-size boxes', function () {
    assert.deepEqual(unionBox([{ x: 0, y: 0, width: 0, height: 0 }, { x: 5, y: 5, width: 10, height: 10 }]),
      { x: 5, y: 5, width: 10, height: 10 });
    assert.deepEqual(unionBox([{ x: 1, y: 2, width: 0, height: 3 }]), null);
  });

  test('unionBox of an empty list is null', function () {
    assert.equal(unionBox([]), null);
    assert.equal(unionBox([null, undefined]), null);
  });

});

describe('perceptual harness: windowFor', function () {

  test('windowFor is one window relative to either root', function () {
    // ours: root (10,10), union (-2..18, 12..22) relative; upstream: root (0,0), union (0..10, 0..30)
    const window = windowFor({ x: 10, y: 10 }, { x: 8, y: 12, width: 20, height: 10 }, { x: 0, y: 0 }, { x: 0, y: 0, width: 10, height: 30 });
    assert.deepEqual(window, { x: -2, y: 0, width: 20, height: 30 });
  });

});
