// Info: CopyButton's tooltip centres under the button on 'bottom' - the
// anchor View hugs the trigger (alignSelf: flex-start) so the -50% shift
// lands the bubble's centre on the button's centre. The rect is the cell's
// centre otherwise, which anchors the bubble to the wrong point.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(HERE, '..', 'component', 'molecule', 'tooltip', 'tooltip.js'), 'utf8');

test("CopyButton's bubble centres on the button", function () {
  assert.equal(source.includes("props.fill === true ? undefined : { alignSelf: 'flex-start' }"), true,
    'the anchor View lost alignSelf: flex-start - it stretches to the cell and the bubble centres on the cell, not the button');
});
