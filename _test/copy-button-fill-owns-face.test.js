// Info: under a composition fill (fillLeaf etc.) the kind's border does not
// draw over the owned face - upstream's .cds--copy-btn is border: none.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(HERE, '..', 'component', 'molecule', 'button', 'icon-button.js'), 'utf8');

test('a composition fill draws the face without the kind border', function () {
  assert.equal(source.includes("borderWidth: fillMap !== null ? 0 : borderWidth"), true,
    'the composition-fill border suppression is gone - the copy button would draw a border upstream has none');
});
