// Info: CopyButton's tooltip takes the upstream align default ('bottom'
// from upstream's CopyButton.js) when the host passes no align, so its
// bubble sits below the button like upstream's.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(HERE, '..', 'component', 'molecule', 'copy', 'copy-button.js'), 'utf8');

test("CopyButton's tooltip reads the upstream align default", function () {
  assert.equal(source.includes("props.align === undefined ? 'bottom' : props.align"), true, "the bottom align fallback is gone - the tooltip would sit above the button like Tooltip's own default");
});
