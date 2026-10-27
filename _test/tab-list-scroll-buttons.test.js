// Info: the overflow scroll buttons draw only when they can move the list:
// previous when scrollLeft > 0, next while scrollLeft + box < content
// (upstream Tabs.js:221,224). At scroll start the previous button hides.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(HERE, '..', 'component', 'composite', 'tabs', 'tab-list.js'), 'utf8');

test('the previous scroll button hides at scroll start and the next at the end', function () {
  assert.equal(source.includes('scrollLeft > 0'), true,
    'the previous button lost its scrollLeft > 0 gate - it should hide while the scroller is at its start');
  assert.equal(source.includes('scrollLeft + boxWidth + 1 < contentWidth'), true,
    'the next button lost its scroll-end gate - it should hide while the scroller is at its end');
});
