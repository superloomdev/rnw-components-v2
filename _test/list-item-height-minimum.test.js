import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(HERE, '..', 'component/context.js'), 'utf8');
test('list-item-height-minimum', function () {
  assert.equal(source.includes('minHeight: options.itemHeight'), true, 'the face height floor regressed to a fixed height - a taller text run must grow it');
});
