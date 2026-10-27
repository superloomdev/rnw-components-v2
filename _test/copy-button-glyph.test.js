// Info: CopyButton's glyph reaches IconButton's icon prop - upstream's
// copy icon, not a wrong or missing token.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(HERE, '..', 'component', 'molecule', 'copy', 'copy-button.js'), 'utf8');

test('CopyButton: the glyph renders through IconButton', function () {
  assert.equal(source.includes("icon: 'copy'"), true, 'the copy glyph token is gone - the button would draw no or the wrong glyph');
});
