// Info: the ContentSwitcher segment's press layer meets control.target_min
// while the painted face keeps the segment height cell - the press layer is
// an absolute sibling over the face, not the painted row.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(HERE, '..', 'component', 'molecule', 'content-switcher', 'switch.js'), 'utf8');

test('the segment press layer carries the target floor while the face keeps the segment height', function () {
  assert.equal(source.includes('style: ctx.pressTarget(faceSize)'), true,
    'the segment lost its press-target floor - the layer must cover the face and reach control.target_min');
  assert.equal(source.includes('onFaceLayout'), true,
    'the face lost its onLayout measurement');
});
