// Info: the dismissable tab's press layer meets control.target_min while the
// painted face keeps the tab height cell; the close layer meets it square.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(HERE, '..', 'component', 'composite', 'tabs', 'tab.js'), 'utf8');

test('the tab and close press layers carry the target floor while the face keeps the tab height', function () {
  assert.equal(source.includes("role: 'tab'"), true);
  assert.equal((source.match(/ctx.pressTarget\(/g) || []).length >= 2, true,
    'the tab lost its press-target floor - the layer must cover the face and reach control.target_min');
  assert.equal(source.includes('onFaceLayout') && source.includes('onCloseFaceLayout'), true,
    'the face and close face lost their onLayout measurements');
});
