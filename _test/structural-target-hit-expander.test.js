import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(HERE, 'harness', 'page.js'), 'utf8');
test('a target unions its hit expander', function () {
  assert.equal(source.includes("data-part=\"hit\""), true,
    'the target collector ignores the hit expander - the effective press area is under-measured');
  assert.equal(source.includes('hitEl === null'), true,
    'the plain rect is the fallback only when no hit expander exists - an inverted guard ignores the expander');
});
