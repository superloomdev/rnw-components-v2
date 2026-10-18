// Info: Coordinate and omission contracts for the fidelity pixel pipeline.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { PNG } from 'pngjs';

import { compareProfiles, cropTo, maskOmitted, profileOf, samplePaint } from './harness/fidelity.js';


function image (width, height) {
  const out = new PNG({ width: width, height: height });
  out.data.fill(255);
  return out;
}


function paint (png, x, y, color) {
  const offset = (y * png.width + x) * 4;
  png.data.set(color.concat(255), offset);
}


test('omitted pixels are copied only after the two frame origins align', function () {
  const ours = image(60, 68);
  const upstream = image(60, 68);
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const color = [x * 17, y * 19, 40];
      paint(upstream, 20 + x, 20 + y, color);
      paint(ours, 20 + x, 28 + y, color);
    }
  }
  paint(ours, 24, 30, [255, 0, 0]);
  const origin = { _bodyX: 0, _bodyY: 8, width: 10, height: 10, visible: true };
  const otherOrigin = { ...origin, _bodyY: 0 };
  const parts = {
    frame: origin,
    action: { _bodyX: 4, _bodyY: 10, width: 2, height: 2, visible: true }
  };
  const a = cropTo(PNG.sync.write(ours), origin);
  const b = cropTo(PNG.sync.write(upstream), otherOrigin);
  assert.notDeepEqual(PNG.sync.read(a).data, PNG.sync.read(b).data);
  const masked = maskOmitted(a, b, parts, ['action'], 'frame', origin, 0);
  assert.deepEqual(masked.lines, []);
  assert.deepEqual(PNG.sync.read(masked.shot).data, PNG.sync.read(b).data);
});


test('an omission cannot mask the entire compared anchor', function () {
  const ours = image(10, 10);
  const upstream = image(10, 10);
  paint(ours, 5, 5, [255, 0, 0]);
  const frame = { _bodyX: 0, _bodyY: 0, width: 10, height: 10, visible: true };
  const masked = maskOmitted(PNG.sync.write(ours), PNG.sync.write(upstream),
    { frame: frame, action: frame }, ['action'], 'frame', frame, 0);
  assert.deepEqual(masked.lines, ['mask action covers the anchor frame']);
  assert.notDeepEqual(PNG.sync.read(masked.shot).data, upstream.data);
});


test('a proven omission excludes its own profile pixels but not the focus ring', function () {
  const ours = image(120, 120);
  const upstream = image(120, 120);
  const face = { _bodyX: 30, _bodyY: 30, width: 40, height: 40, visible: true };
  const icon = { _bodyX: 19, _bodyY: 40, width: 1, height: 20, visible: true };
  paint(ours, 39, 70, [255, 0, 0]);
  paint(ours, 70, 51, [0, 0, 255]);
  const source = profileOf(face, PNG.sync.write(upstream));
  const before = compareProfiles(profileOf(face, PNG.sync.write(ours)), source);
  assert.ok(before.some(function (line) { return line.startsWith('left '); }));
  const after = compareProfiles(profileOf(face, PNG.sync.write(ours), [icon]), source);
  assert.equal(after.some(function (line) { return line.startsWith('left '); }), false);
  assert.ok(after.some(function (line) { return line.startsWith('inside '); }),
    'the real, unmasked focus-ring defect must remain visible');
  const hidden = compareProfiles(profileOf(face, PNG.sync.write(ours), [{ ...icon, visible: false }]), source);
  assert.ok(hidden.some(function (line) { return line.startsWith('left '); }));
});

test('a center-painted part samples its core rather than an inset focus gap', function () {
  const png = image(60, 60);
  paint(png, 27, 23, [240, 240, 240]);
  paint(png, 27, 27, [15, 98, 254]);
  const state = { thumb: { _bodyX: 0, _bodyY: 0, width: 14, height: 14, visible: true, _paintCenter: true } };
  samplePaint(state, PNG.sync.write(png));
  assert.equal(state.thumb.paint, 'rgb(15, 98, 254)');
});

test('a proven omitted surface does not become the underlying part paint', function () {
  const png = image(60, 60);
  paint(png, 27, 23, [230, 224, 233]);
  const state = { host: { _bodyX: 0, _bodyY: 0, width: 14, height: 14, visible: true } };
  const cover = { _bodyX: 0, _bodyY: 0, width: 14, height: 5, visible: true };
  samplePaint(state, PNG.sync.write(png), [cover]);
  assert.equal(state.host.paint, undefined);
  samplePaint(state, PNG.sync.write(png), [{ ...cover, visible: false }]);
  assert.equal(state.host.paint, 'rgb(230, 224, 233)');
});

test('a deeper focus profile still detects a wrong inner color', function () {
  const a = image(60, 60);
  const b = image(60, 60);
  paint(a, 27, 25, [255, 0, 0]);
  const face = { _bodyX: 0, _bodyY: 0, width: 14, height: 14, visible: true, _profileDepth: 5 };
  const ours = profileOf(face, PNG.sync.write(a));
  const upstream = profileOf(face, PNG.sync.write(b));
  assert.equal(ours.inside.length, 5);
  assert.ok(compareProfiles(ours, upstream).some(function (line) { return line.startsWith('inside 5px:'); }));
});
