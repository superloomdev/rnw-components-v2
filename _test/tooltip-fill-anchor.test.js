// Info: a Tooltip's anchor hugs its trigger (alignSelf: flex-start) unless
// `fill` is set - a trigger laid out against a fixed box (the collapsed
// Search's 40x40 field) fills its parent instead.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const tooltip = readFileSync(join(HERE, '..', 'component', 'molecule', 'tooltip', 'tooltip.js'), 'utf8');
const search = readFileSync(join(HERE, '..', 'component', 'molecule', 'search', 'search.js'), 'utf8');

test('a Tooltip without fill hugs its trigger; the collapsed Search fills its field', function () {
  assert.equal(tooltip.includes("props.fill === true ? undefined : { alignSelf: 'flex-start' }"), true,
    'the anchor lost its hug-by-default flex-start - a button trigger would centre on the cell, not the trigger');
  assert.equal(search.includes('fill: true'), true,
    'the collapsed Search Tooltip does not pass fill - its 40x40 action would overflow the field');
});
