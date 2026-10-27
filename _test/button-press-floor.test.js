import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(HERE, '..', 'component', 'molecule', 'button', 'button.js'), 'utf8');
test('a pressFloor button renders a transparent hit expander at the target floor', function () {
  assert.equal(source.includes("dataSet: { part: 'hit' }, style: ctx.pressTarget(faceSize)"), true,
    'the pressFloor hit expander is gone - a compact button no longer meets control.target_min');
});
