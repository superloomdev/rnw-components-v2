import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(HERE, '..', 'component/composite/tabs/tab.js'), 'utf8');
test('tab-height-minimum', function () {
  assert.equal(source.includes('minHeight: props.tall === true'), true, 'the face height floor regressed to a fixed height - a taller text run must grow it');
});
