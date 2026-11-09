// Info: The perceptual harness's own unit tests: unionBox, the box every
// sample-box crop is taken from (D39-3).

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { PNG } from 'pngjs';
import { settleLayout } from './harness/page.js';
import { cropRect, sampleWindow, unionBox, windowFor } from './harness/perceptual.js';

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

  test('sampleWindow crops around the roots and inside both bodies', function () {
    const ours = { x: 6, y: 6, width: 28, height: 18, rootX: 10, rootY: 10, bodyX: 0, bodyY: 0, bodyWidth: 40, bodyHeight: 20 };
    const upstream = { x: -4, y: -4, width: 28, height: 31, rootX: 0, rootY: 0, bodyX: 0, bodyY: 0, bodyWidth: 40, bodyHeight: 23 };
    assert.deepEqual(sampleWindow(ours, upstream), {
      ours: { x: 10, y: 10, width: 24, height: 10 },
      upstream: { x: 0, y: 0, width: 24, height: 10 }
    });
  });

});


describe('perceptual harness: cropRect', function () {

  test('cropRect pads a rectangle starting outside the source instead of shifting it', function () {
    // A 4 x 4 source, all opaque red, cropped at (-2, -1) size 5 x 4: the
    // copy lands offset by the negative origin and the pad is transparent
    const source = new PNG({ height: 4, width: 4 });
    for (let i = 0; i < source.data.length; i += 4) {
      source.data[i] = 255;
      source.data[i + 3] = 255;
    }
    const out = PNG.sync.read(cropRect(PNG.sync.write(source), -2, -1, 5, 4));
    assert.equal(out.width, 5);
    assert.equal(out.height, 4);
    const at = function (x, y) {
      const i = (y * out.width + x) * 4;
      return [out.data[i], out.data[i + 3]];
    };
    assert.deepEqual(at(0, 0), [0, 0], 'left-of-source padding is transparent');
    assert.deepEqual(at(1, 0), [0, 0], 'the second pad column is transparent');
    assert.deepEqual(at(2, 1), [255, 255], 'the source begins two pixels in');
    assert.deepEqual(at(2, 0), [0, 0], 'above-source padding is transparent');
    assert.deepEqual(at(4, 3), [255, 255], 'the last source pixel is at its offset');
  });

});

describe('page harness: settleLayout', function () {

  test('resolves only after an element still moving for frames has settled', async function () {
    let frames = 0;
    const child = {
      getBoundingClientRect: function () {
        return { x: 0, y: frames < 3 ? 100 : 140, width: 160, height: 40 };
      }
    };
    const body = {
      getBoundingClientRect: function () {
        return { x: 0, y: 0, width: 320, height: 200 };
      },
      querySelectorAll: function () {
        return [child];
      }
    };
    const page = {
      locator: function () {
        return {
          first: function () {
            return {
              count: function () { return Promise.resolve(1); },
              evaluate: function (fn) { return fn(body); }
            };
          }
        };
      }
    };
    const saved = globalThis.requestAnimationFrame;
    globalThis.requestAnimationFrame = function (callback) {
      return setImmediate(function () {
        frames = frames + 1;
        callback();
      });
    };
    const savedStyle = globalThis.getComputedStyle;
    globalThis.getComputedStyle = function (node) { return { position: node === child ? 'fixed' : 'static' }; };
    try {
      await settleLayout(page, 'Panel', 'open');
      assert.ok(frames >= 4, 'the wait outlasted the move: resolved at frame ' + frames);
      assert.equal(child.getBoundingClientRect().y, 140, 'the moved position is what the wait saw last');
    } finally {
      globalThis.requestAnimationFrame = saved;
      globalThis.getComputedStyle = savedStyle;
    }
  });

  test('resolves at once when the cell holds no fixed layer', async function () {
    let frames = 0;
    const child = {
      getBoundingClientRect: function () {
        return { x: 0, y: 0, width: 160, height: 40 };
      }
    };
    const body = {
      getBoundingClientRect: function () {
        return { x: 0, y: 0, width: 320, height: 200 };
      },
      querySelectorAll: function () {
        return [child];
      }
    };
    const page = {
      locator: function () {
        return {
          first: function () {
            return {
              count: function () { return Promise.resolve(1); },
              evaluate: function (fn) { return fn(body); }
            };
          }
        };
      }
    };
    const saved = globalThis.requestAnimationFrame;
    globalThis.requestAnimationFrame = function (callback) {
      return setImmediate(function () {
        frames = frames + 1;
        callback();
      });
    };
    const savedStyle = globalThis.getComputedStyle;
    globalThis.getComputedStyle = function () { return { position: 'static' }; };
    try {
      await settleLayout(page, 'Panel', 'open');
      assert.equal(frames, 0, 'a cell with no fixed layer does not wait: resolved at frame ' + frames);
    } finally {
      globalThis.requestAnimationFrame = saved;
      globalThis.getComputedStyle = savedStyle;
    }
  });

  test('is a no-op when the cell is absent', async function () {
    const page = {
      locator: function () {
        return {
          first: function () {
            return {
              count: function () { return Promise.resolve(0); },
              evaluate: function () { throw new Error('must not evaluate without a cell'); }
            };
          }
        };
      }
    };
    await settleLayout(page, 'Panel', 'open');
  });

});
