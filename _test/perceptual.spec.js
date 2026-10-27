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

import { discoverComponents } from '../scripts/lib/components.js';
import { enterInteraction, leaveInteraction, openReference, openShowcase, pauseCellAnimations, readSampleBox, refocusPanel, reopenPanel, settleLayout } from './harness/page.js';
import { cropRect, perceptualRatio, ratio, sampleWindow } from './harness/perceptual.js';
import { restHiddenStates } from './harness/fidelity.js';
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

const components = await discoverComponents();
const pauseAnimations = function (name) {
  const component = components.find(function (entry) {
    return entry.name === name;
  });
  return component !== undefined && component.reference.pauseAnimations === true;
};


/********************************************************************
Screenshot every cell body's painted sample box on the open page: the
union of its painted elements (readSampleBox), so cell whitespace never
dilutes the ratio.

@param {Object} page    - Playwright page
@param {String} name    - Component name
@param {Boolean} frozen - Pause the cells' infinite animations first

@return {Promise<Object>} - state label -> PNG buffer
*********************************************************************/
async function shootBodies (page, name, frozen, reference, side) {

  const refocus = reference === undefined || reference === null ? undefined : reference.refocus;
  const reopen = reference === undefined || reference === null ? undefined : reference.reopen;
  const leave = reference === undefined || reference === null ? {}
    : { escape: reference.escapeOnLeave !== false, releaseBeforeMove: reference.releaseBeforeMove === true, clickOutside: reference.clickOutsideOnLeave === true };
  const out = {};
  const cells = page.locator('.cell[data-component="' + name + '"]');
  const count = await cells.count();
  for (let i = 0; i < count; i++) {
    const cell = cells.nth(i);
    if (frozen === true) {
      await pauseCellAnimations(cell.locator('[data-part="body"]'));
    }
    const state = await cell.getAttribute('data-state');
    // An opened state's panel must be open for its shot, as the fidelity
    // run re-opens it: an earlier cell's interaction can have closed it
    if (reopen !== undefined && reopen !== null && Array.isArray(reopen.states) && reopen.states.indexOf(state) !== -1) {
      await reopenPanel(page, name, state, reopen, side, leave);
      await page.mouse.move(0, 0);
    }
    // An open panel's ring follows focus, not mount order: focus the
    // measured cell's own item before its shot, as the fidelity run does
    await refocusPanel(page, name, state, refocus, side);
    await settleLayout(page, name, state);
    out[state] = { shot: await cell.locator('[data-part="body"]').screenshot({ scale: 'css', animations: 'disabled' }), sample: await readSampleBox(page, name, state) };
    if (reopen !== undefined && reopen !== null && Array.isArray(reopen.states) && reopen.states.indexOf(state) !== -1) {
      await leaveInteraction(page, leave);
    }
  }

  return out;

}


test.describe('perceptual', function () {

  // Every cell is still checked, but roster growth must not make all
  // screenshots share one test deadline or one page's overlay state.
  for (const component of components) {
    test(component.name + ': the pixel pipeline discriminates: self is 0, blank is not', async function ({ page }) {
      const opened = await openShowcase(page, PROOF_TEMPLATE, component.name);
      const expected = component.sample.filter(function (entry) { return entry.cell !== false; }).length;
      expect(expected).toBeGreaterThanOrEqual(1);
      expect(opened.status.cells).toBe(expected);
      const cells = page.locator('.cell');
      const count = await cells.count();
      expect(count).toBe(expected);
      const blank = [];
      const stale = [];
      for (let i = 0; i < count; i++) {
        const cell = cells.nth(i);
        const state = await cell.getAttribute('data-state');
        const id = await cell.getAttribute('data-component') + ' / ' + state;
        // A rest-hidden sample paints nothing at rest by definition: prove
        // it drawn under the reference's focus target instead
        const hidden = restHiddenStates(component)[state] === true;
        if (hidden) {
          await enterInteraction(page, component.name, state, component.reference.target.ours, 'focus');
        }
        const shot = await cell.locator('[data-part="body"]').screenshot({ scale: 'css' });
        if (hidden) {
          await leaveInteraction(page, { escape: component.reference.escapeOnLeave !== false });
        }
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
  }

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
    for (const set of ['primary']) {
      const reference = await openReference(page, 'TextArea', set, 'dark');
      expect(reference.cells, 'TextArea: the ' + set + ' reference page drew no state').toBeGreaterThanOrEqual(1);
      found.push(...await chrome(set));
    }
    expect(found, 'measurement cells painting their own chrome').toEqual([]);
  });

  for (const row of primaryReference) {
    test(row.name + ': mismatch within diff_budget ' + row.diff_budget + '%', async function ({ page }) {
      const component = components.find(function (entry) {
        return entry.name === row.name;
      });
      const componentReference = component !== undefined && component.reference !== null && component.reference !== undefined ? component.reference : undefined;
      const reference = await openReference(page, row.name);
      expect(reference.cells, row.name + ': the reference page drew no state').toBeGreaterThanOrEqual(1);
      const upstream = await shootBodies(page, row.name, pauseAnimations(row.name), componentReference, 'upstream');
      await openShowcase(page, REFERENCE_TEMPLATE, row.name, { measure: true, hosted: false });
      const ours = await shootBodies(page, row.name, pauseAnimations(row.name), componentReference, 'ours');
      const ratios = [];
      const over = [];
      const crops = [];
      // A rest-hidden state paints nothing at rest by definition; the
      // budget still compares its interaction frames
      const restHidden = component === undefined ? {} : restHiddenStates(component);
      for (const state of Object.keys(upstream)) {
        if (restHidden[state] === true) {
          continue;
        }
        expect(ours[state], row.name + ' / ' + state + ' is drawn upstream but not here').toBeDefined();
        let a = ours[state].shot;
        let b = upstream[state].shot;
        // D39-3: one common window aligned at each side's sample root
        if (ours[state].sample !== null && upstream[state].sample !== null) {
          const crop = sampleWindow(ours[state].sample, upstream[state].sample);
          if (crop !== null) {
            a = cropRect(ours[state].shot, crop.ours.x, crop.ours.y, crop.ours.width, crop.ours.height);
            b = cropRect(upstream[state].shot, crop.upstream.x, crop.upstream.y, crop.upstream.width, crop.upstream.height);
          }
        }
        const pngA = PNG.sync.read(a);
        const pngB = PNG.sync.read(b);
        crops.push(state + ': ours ' + pngA.width + 'x' + pngA.height + ' @' + ours[state].sample.rootX + ',' + ours[state].sample.rootY + ' upstream ' + pngB.width + 'x' + pngB.height + ' @' + upstream[state].sample.rootX + ',' + upstream[state].sample.rootY);
        const percent = Math.round(perceptualRatio(a, b) * 10000) / 100;
        ratios.push(state + ' ' + percent + '%');
        if (percent > row.diff_budget) {
          over.push(state + ': ' + percent + '% > ' + row.diff_budget + '%');
        }
      }
      test.info().annotations.push({ type: 'crop', description: row.name + ' crops: ' + crops.join('; ') });
      test.info().annotations.push({ type: 'perceptual', description: row.name + ': ' + ratios.join(', ') });
      expect(over, row.name + ' states over the diff budget').toEqual([]);
    });
  }

});
