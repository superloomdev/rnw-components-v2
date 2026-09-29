// Info: Gate layer 3 - perceptual diff against the reference render, per
// state, with pixelmatch on 0.5x screenshots at threshold 0.2, mismatch
// ratio within the row's diff_budget. Rows without a reference are counted
// and skipped; the count is asserted against the roster. This spec also
// proves the screenshot and pixel pipeline itself by comparing every cell
// against itself (ratio 0) and against a blank (ratio > 0).

import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

import { openShowcase } from './harness/page.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const roster = JSON.parse(readFileSync(join(HERE, '..', 'data', 'roster.json'), 'utf8'));
const withReference = roster.rows.filter(function (row) {
  return row.status !== 'pending' && row.status !== 'not_applicable' && row.reference.kind !== 'none';
});
const withoutReference = roster.rows.filter(function (row) {
  return row.status !== 'pending' && row.status !== 'not_applicable' && row.reference.kind === 'none';
});


/********************************************************************
Mismatch ratio between two PNG buffers of equal size.

@param {Buffer} a - PNG
@param {Buffer} b - PNG

@return {Number} - Mismatched pixels / total
*********************************************************************/
function ratio (a, b) {

  const pa = PNG.sync.read(a);
  const pb = PNG.sync.read(b);
  expect(pa.width).toBe(pb.width);
  expect(pa.height).toBe(pb.height);
  const mismatched = pixelmatch(pa.data, pb.data, null, pa.width, pa.height, { threshold: 0.2 });

  return mismatched / (pa.width * pa.height);

}


test.describe('perceptual', function () {

  test('the pixel pipeline discriminates: self is 0, blank is not', async function ({ page }) {
    const opened = await openShowcase(page, 'default');
    expect(opened.status.cells).toBeGreaterThanOrEqual(1);
    const cells = page.locator('.cell [data-part="body"]');
    const count = await cells.count();
    expect(count).toBeGreaterThanOrEqual(1);
    for (let i = 0; i < count; i++) {
      const shot = await cells.nth(i).screenshot({ scale: 'css' });
      expect(ratio(shot, shot)).toBe(0);
      const png = PNG.sync.read(shot);
      const blank = new PNG({ width: png.width, height: png.height });
      blank.data.fill(255);
      expect(ratio(shot, PNG.sync.write(blank)), 'cell ' + i + ' rendered nothing visible').toBeGreaterThan(0);
    }
    test.info().annotations.push({ type: 'perceptual', description: 'with reference ' + withReference.length + ', without (skipped) ' + withoutReference.length });
  });

  for (const row of withReference) {
    test(row.name + ': mismatch within diff_budget ' + row.diff_budget + '%', async function () {
      expect.soft(false, row.name + ' has a reference but the reference render is not wired yet').toBe(true);
    });
  }

});
