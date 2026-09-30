// Info: Gate layer 3 - perceptual diff against the reference render, per
// state: our cell body under the template that shares the reference's
// values, and the reference page's cell body for the same sample state, are
// screenshotted, padded to one size, downscaled 0.5x and compared with
// pixelmatch at threshold 0.2; the mismatch ratio must be within the row's
// diff_budget. Rows without a reference are counted and skipped; the count
// is asserted against the roster. This spec also proves the screenshot and
// pixel pipeline itself: every cell against itself is 0, and every cell
// against a blank of its size is not 0, compared exactly, so a faint fill
// still counts as drawn. A cell listed in `fixtures/expected-gaps.json` for
// the check `perceptual-visible` must still be blank; once it draws, the
// entry is stale and the test says so.

import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

import { openReference, openShowcase } from './harness/page.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const roster = JSON.parse(readFileSync(join(HERE, '..', 'data', 'roster.json'), 'utf8'));
const GAPS = JSON.parse(readFileSync(join(HERE, 'fixtures', 'expected-gaps.json'), 'utf8')).gaps;
const withReference = roster.rows.filter(function (row) {
  return row.status !== 'pending' && row.status !== 'not_applicable' && row.reference.kind !== 'none';
});
const withoutReference = roster.rows.filter(function (row) {
  return row.status !== 'pending' && row.status !== 'not_applicable' && row.reference.kind === 'none';
});

// The template whose values the primary reference draws, and the page the pipeline proof uses
const REFERENCE_TEMPLATE = 'carbon';
const PROOF_TEMPLATE = 'default';


/********************************************************************
Pad an image to a size with white, from the top-left corner.

@param {Object} png    - Decoded PNG
@param {Number} width  - Target width
@param {Number} height - Target height

@return {Object} - Decoded PNG of the target size
*********************************************************************/
function pad (png, width, height) {

  const out = new PNG({ width: width, height: height });
  out.data.fill(255);
  PNG.bitblt(png, out, 0, 0, png.width, png.height, 0, 0);

  return out;

}


/********************************************************************
Downscale an image by half, averaging each 2x2 block.

@param {Object} png - Decoded PNG

@return {Object} - Decoded PNG at half size
*********************************************************************/
function halve (png) {

  const width = Math.max(1, Math.floor(png.width / 2));
  const height = Math.max(1, Math.floor(png.height / 2));
  const out = new PNG({ width: width, height: height });
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      for (let channel = 0; channel < 4; channel++) {
        let sum = 0;
        for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) {
          const sx = Math.min(png.width - 1, x * 2 + dx);
          const sy = Math.min(png.height - 1, y * 2 + dy);
          sum += png.data[(sy * png.width + sx) * 4 + channel];
        }
        out.data[(y * width + x) * 4 + channel] = Math.round(sum / 4);
      }
    }
  }

  return out;

}


/********************************************************************
Mismatch ratio between two PNG buffers of equal size.

@param {Buffer} a         - PNG
@param {Buffer} b         - PNG
@param {Number} threshold - pixelmatch threshold; 0 counts any difference

@return {Number} - Mismatched pixels / total
*********************************************************************/
function ratio (a, b, threshold) {

  const pa = PNG.sync.read(a);
  const pb = PNG.sync.read(b);
  expect(pa.width).toBe(pb.width);
  expect(pa.height).toBe(pb.height);
  const mismatched = pixelmatch(pa.data, pb.data, null, pa.width, pa.height, { threshold: threshold });

  return mismatched / (pa.width * pa.height);

}


/********************************************************************
Perceptual mismatch between two renders of possibly different sizes:
padded to one size, halved, compared at threshold 0.2.

@param {Buffer} a - PNG
@param {Buffer} b - PNG

@return {Number} - Mismatched pixels / total
*********************************************************************/
function perceptualRatio (a, b) {

  const pa = PNG.sync.read(a);
  const pb = PNG.sync.read(b);
  const width = Math.max(pa.width, pb.width);
  const height = Math.max(pa.height, pb.height);
  const ha = halve(pad(pa, width, height));
  const hb = halve(pad(pb, width, height));

  return ratio(PNG.sync.write(ha), PNG.sync.write(hb), 0.2);

}


/********************************************************************
Screenshot every cell body of one component on the open page.

@param {Object} page - Playwright page
@param {String} name - Component name

@return {Promise<Object>} - state label -> PNG buffer
*********************************************************************/
async function shootBodies (page, name) {

  const out = {};
  const cells = page.locator('.cell[data-component="' + name + '"]');
  const count = await cells.count();
  for (let i = 0; i < count; i++) {
    const cell = cells.nth(i);
    out[await cell.getAttribute('data-state')] = await cell.locator('[data-part="body"]').screenshot({ scale: 'css', animations: 'disabled' });
  }

  return out;

}


test.describe('perceptual', function () {

  test('the pixel pipeline discriminates: self is 0, blank is not', async function ({ page }) {
    const opened = await openShowcase(page, PROOF_TEMPLATE);
    expect(opened.status.cells).toBeGreaterThanOrEqual(1);
    const cells = page.locator('.cell');
    const count = await cells.count();
    expect(count).toBeGreaterThanOrEqual(1);
    const blank = [];
    const stale = [];
    for (let i = 0; i < count; i++) {
      const cell = cells.nth(i);
      const id = await cell.getAttribute('data-component') + ' / ' + await cell.getAttribute('data-state');
      const shot = await cell.locator('[data-part="body"]').screenshot({ scale: 'css' });
      expect(ratio(shot, shot, 0.2)).toBe(0);
      const png = PNG.sync.read(shot);
      const white = new PNG({ width: png.width, height: png.height });
      white.data.fill(255);
      const drawn = ratio(shot, PNG.sync.write(white), 0) > 0;
      const gap = GAPS.find(function (entry) {
        return entry.check === 'perceptual-visible' && entry.template === PROOF_TEMPLATE && entry.cell === id;
      });
      if (gap && drawn) {
        stale.push(id + ' now draws; remove its expected-gaps entry (' + gap.request + ')');
      }
      if (!gap && !drawn) {
        blank.push(id);
      }
    }
    expect(stale, 'expected gaps that no longer reproduce').toEqual([]);
    expect(blank, 'cells that rendered nothing visible').toEqual([]);
    test.info().annotations.push({ type: 'perceptual', description: 'with reference ' + withReference.length + ', without (skipped) ' + withoutReference.length });
  });

  for (const row of withReference) {
    test(row.name + ': mismatch within diff_budget ' + row.diff_budget + '%', async function ({ page }) {
      const reference = await openReference(page, row.name);
      expect(reference.cells, row.name + ': the reference page drew no state').toBeGreaterThanOrEqual(1);
      const upstream = await shootBodies(page, row.name);
      await openShowcase(page, REFERENCE_TEMPLATE, row.name, { measure: true });
      const ours = await shootBodies(page, row.name);
      const ratios = [];
      const over = [];
      for (const state of Object.keys(upstream)) {
        expect(ours[state], row.name + ' / ' + state + ' is drawn upstream but not here').toBeDefined();
        const percent = Math.round(perceptualRatio(ours[state], upstream[state]) * 10000) / 100;
        ratios.push(state + ' ' + percent + '%');
        if (percent > row.diff_budget) {
          over.push(state + ': ' + percent + '% > ' + row.diff_budget + '%');
        }
      }
      test.info().annotations.push({ type: 'perceptual', description: row.name + ': ' + ratios.join(', ') });
      expect(over, row.name + ' states over the diff budget').toEqual([]);
    });
  }

});
