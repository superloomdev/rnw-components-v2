// Info: a hosted anchored layer follows a window scroll - the layer root's
// window origin is read live via context.getOrigin(), not the layout-time
// origin state, so a scroll that moves the root repositions hosted layers.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const overlay = readFileSync(join(HERE, '..', 'behaviors', 'overlay.js'), 'utf8');
const positioning = readFileSync(join(HERE, '..', 'behaviors', 'positioning.js'), 'utf8');

test('a hosted layer reads the layer root origin live through getOrigin', function () {
  assert.equal(overlay.includes('getOrigin: getOrigin'), true,
    'the host context lost getOrigin - a web scroll would leave hosted layers at the layout-time origin');
  assert.equal(positioning.includes("typeof current.getOrigin === 'function' ? current.getOrigin() : current.origin"), true,
    'the web anchored position reads the stale origin state - it must prefer the live getOrigin over current.origin');
});
