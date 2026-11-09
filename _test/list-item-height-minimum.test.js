import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(HERE, '..', 'component/context.js'), 'utf8');
describe('ListItem: the height floor comes from its metric', function () {

  test('list-item-height-minimum', function () {
    assert.equal(source.includes('minHeight: options.itemHeight'), true, 'the face height floor regressed to a fixed height - a taller text run must grow it');
  });

});
