import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(HERE, '..', 'component', 'composite', 'tabs', 'content-switcher.js'), 'utf8');
test('content-switcher-height-minimum', function () {
  assert.equal(source.includes("minHeight: ctx.metric('ContentSwitcher', heightKey)"), true, 'the container height floor regressed to a fixed height');
});
