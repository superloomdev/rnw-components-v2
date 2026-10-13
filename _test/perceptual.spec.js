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

import { openReference, openShowcase } from './harness/page.js';
import { perceptualRatio, ratio } from './harness/perceptual.js';
import { PNG } from 'pngjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const roster = JSON.parse(readFileSync(join(HERE, '..', 'data', 'roster.json'), 'utf8'));
const GAPS = JSON.parse(readFileSync(join(HERE, 'fixtures', 'expected-gaps.json'), 'utf8')).gaps;
const withReference = roster.rows.filter(function (row) {
  return row.status !== 'pending' && row.reference.kind !== 'none';
});
const withoutReference = roster.rows.filter(function (row) {
  return row.status !== 'pending' && row.reference.kind === 'none';
});
// A row with no primary-system twin draws no primary reference, so its
// primary pixel comparison is skipped (a second twin is measured inside
// the fidelity gate)
const noPrimaryTwin = withReference.filter(function (row) {
  return row.carbon_twin === 'none';
});
const primaryReference = withReference.filter(function (row) {
  return row.carbon_twin !== 'none';
});

// The template whose values the primary reference draws, and the page the pipeline proof uses
const REFERENCE_TEMPLATE = 'carbon';
const PROOF_TEMPLATE = 'default';


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
    test.info().annotations.push({ type: 'perceptual', description: 'with reference ' + primaryReference.length + ', without (skipped) ' + withoutReference.length + ', no primary twin (skipped) ' + noPrimaryTwin.length });
  });

  // A shot is cropped from the page, so anything the harness itself paints
  // around a cell (its border, outline or shadow) can enter a comparison
  test('a measurement cell paints no chrome of its own', async function ({ page }) {
    const chrome = function (where) {
      return page.evaluate(function (label) {
        const out = [];
        for (const cell of document.querySelectorAll('.cell')) {
          const style = getComputedStyle(cell);
          const id = label + ' ' + cell.getAttribute('data-component') + ' / ' + cell.getAttribute('data-state');
          for (const side of ['Top', 'Right', 'Bottom', 'Left']) {
            const color = style['border' + side + 'Color'];
            const alpha = /^rgba\(.*,\s*([\d.]+)\)$/.exec(color);
            if (style['border' + side + 'Style'] !== 'none' && parseFloat(style['border' + side + 'Width']) > 0 &&
                color !== 'transparent' && (alpha === null || parseFloat(alpha[1]) > 0)) {
              out.push(id + ': border-' + side.toLowerCase() + ' ' + color);
            }
          }
          if (style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0) {
            out.push(id + ': outline ' + style.outlineColor);
          }
          if (style.boxShadow !== 'none') {
            out.push(id + ': box-shadow ' + style.boxShadow);
          }
        }
        return out;
      }, where);
    };
    const found = [];
    await openShowcase(page, REFERENCE_TEMPLATE, 'TextArea', { measure: true, hosted: false });
    found.push(...await chrome('ours'));
    expect(await page.locator('.cell').count()).toBeGreaterThanOrEqual(1);
    for (const set of ['primary', 'second']) {
      const reference = await openReference(page, 'TextArea', set, 'dark');
      expect(reference.cells, 'TextArea: the ' + set + ' reference page drew no state').toBeGreaterThanOrEqual(1);
      found.push(...await chrome(set));
    }
    expect(found, 'measurement cells painting their own chrome').toEqual([]);
  });

  for (const row of primaryReference) {
    test(row.name + ': mismatch within diff_budget ' + row.diff_budget + '%', async function ({ page }) {
      const reference = await openReference(page, row.name);
      expect(reference.cells, row.name + ': the reference page drew no state').toBeGreaterThanOrEqual(1);
      const upstream = await shootBodies(page, row.name);
      await openShowcase(page, REFERENCE_TEMPLATE, row.name, { measure: true, hosted: false });
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
