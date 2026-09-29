// Info: Gate layer 2 - measurement against the rendered upstream. Rows with
// `reference.kind = render-web` mount the upstream component beside ours
// with the same sample props and compare the named parts; `parse-rn` rows
// compare against numbers parsed from the upstream's published style
// objects; `none` rows are counted and skipped. The count of each kind is
// asserted against the roster so a skipped row is visible, never silent.

import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { openShowcase } from './harness/page.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const roster = JSON.parse(readFileSync(join(HERE, '..', 'data', 'roster.json'), 'utf8'));
const built = roster.rows.filter(function (row) {
  return row.status !== 'pending' && row.status !== 'not_applicable';
});
const byKind = { 'render-web': [], 'parse-rn': [], none: [] };
for (const row of built) {
  byKind[row.reference.kind].push(row.name);
}

test.describe('measure: reference coverage', function () {

  test('every built row is classified and the showcase exposes it', async function ({ page }) {
    const opened = await openShowcase(page, 'default');
    expect(built.length).toBeGreaterThanOrEqual(1);
    expect(byKind['render-web'].length + byKind['parse-rn'].length + byKind.none.length).toBe(built.length);
    for (const name of built.map(function (row) {
      return row.name;
    })) {
      expect(opened.status.components, name + ' is built in the roster but not in all.js').toContain(name);
    }
    test.info().annotations.push({ type: 'measure', description: 'render-web ' + byKind['render-web'].length + ', parse-rn ' + byKind['parse-rn'].length + ', none (skipped) ' + byKind.none.length });
  });

  for (const name of byKind['render-web']) {
    test(name + ': parts match the rendered upstream', async function () {
      // Wired when the first render-web row is built (Part 5): mount
      // reference.js beside ours and compare getBoundingClientRect and
      // getComputedStyle for each named part.
      expect.soft(false, name + ' has a render-web reference but the measurement harness is not wired yet').toBe(true);
    });
  }

  for (const name of byKind['parse-rn']) {
    test(name + ': geometry matches the parsed upstream styles', async function () {
      expect.soft(false, name + ' has a parse-rn reference but the parser is not wired yet').toBe(true);
    });
  }

});
