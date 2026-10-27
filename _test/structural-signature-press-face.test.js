// Info: a control that is a transparent press layer (MenuItem, Tab, Switch,
// AccordionItem, IconSwitch) reads its paint from the face sibling, not the
// layer's own transparent box.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(HERE, 'harness', 'page.js'), 'utf8');

test('a press-layer control reads its painted face sibling', function () {
  assert.equal(source.includes('face.previousElementSibling !== null && painted(face.previousElementSibling)'), true,
    'readControlPaint lost the press-layer -> face sibling rule - a transparent layer reads identical paint for every state');
});
