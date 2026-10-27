// Info: an inline (ghost) kind's trailing icon self-centers on the row the
// way upstream's static ghost icon does; a primary kind's icon stays
// absolutely positioned by its computed top.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(HERE, '..', 'component', 'molecule', 'button', 'button.js'), 'utf8');

test('the ghost kind centres its icon on the row; a primary kind does not', function () {
  assert.equal(source.includes("? { alignSelf: 'center', marginStart: ctx.metric('Button', 'iconGap') }"), true,
    'the inline icon branch lost alignSelf: center - the ghost icon would sit at the row top like upstream does not');
  assert.equal(source.includes("position: 'absolute', top: labelTop + (labelStyle.lineHeight - iconSize) / 2"), true,
    'the absolute icon branch moved - the primary kinds still anchor by their computed top');
});
