// Info: the control paint signature carries each drawn svg child's fill or
// stroke - an icon-only control (IconTab) changes only its ink for disabled.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(HERE, 'harness', 'page.js'), 'utf8');

test('the paint signature includes svg fill and stroke', function () {
  assert.equal(source.includes("svg path, svg circle, svg rect"), true,
    'the paint signature dropped svg ink - an icon-only control reads as unchanged when only its ink differs');
});
