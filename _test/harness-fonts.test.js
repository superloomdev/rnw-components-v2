// Info: The reference and showcase opens never measure text before the
// declared fonts finish loading: an unloaded face paints the system
// fallback and every upstream reading shifts.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(HERE, 'harness', 'page.js'), 'utf8');

test('the page opens await the declared fonts and fail when the reference sans is missing', function () {
  assert.equal(source.includes("document.fonts.check('400 14px \"IBM Plex Sans\"')"), true, 'openReference loses the loaded-face gate');
  assert.equal(source.includes('document.fonts.ready'), true, 'the wait on document.fonts.ready is gone');
});
