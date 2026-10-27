// Info: the Accordion heading's press layer meets control.target_min at the
// compact form class while its face keeps the heading's height cell - the
// ToggletipButton pressTarget pattern on a row control.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(HERE, '..', 'component', 'composite', 'accordion', 'accordion-item.js'), 'utf8');

test('the heading press layer meets the target floor; the face keeps the row height', function () {
  assert.equal(source.includes('style: ctx.pressTarget(faceSize)'), true,
    'the heading press layer lost ctx.pressTarget - the row would sit at its 40px theme height, under the 48px target floor');
  assert.equal(source.includes('const [faceSize, onLayout] = ctx.useFaceSize();'), true,
    'the face-size read is gone - the press layer cannot size to the face');
});
