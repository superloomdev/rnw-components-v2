// Info: a menu item's press layer meets control.target_min while its face
// keeps the item's height cell - the ToggletipButton pressTarget pattern on
// the menu row. The role stays on the press layer so the collection's
// focus-by-role keeps working.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(HERE, '..', 'component', 'composite', 'menu', 'menu-item.js'), 'utf8');

test('a menu item press layer meets the target floor; the face keeps the row height', function () {
  assert.equal(source.includes('style: ctx.pressTarget(faceSize)'), true,
    'the item press layer lost ctx.pressTarget - the row would sit at its item height, under the target floor');
  assert.equal(source.includes("role: role,"), true,
    'the role left the press layer - the menu collection could not focus items by [role="menuitem"]');
  assert.equal(source.includes("const [faceSize, onLayout] = ctx.useFaceSize();"), true,
    'the face-size read is gone - the press layer cannot size to the face');
});
