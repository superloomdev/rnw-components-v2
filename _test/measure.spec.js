// Info: Gate layer 2 - measurement against the rendered upstream. For every
// built row with a reference, the showcase (under the template that shares
// the reference's values) and the reference page render the same sample
// states with the same fonts and the same cell layout; the parts that
// `reference.js` names are measured on both and compared: position and size
// within the cell, border widths, corner radius, fill, border color (where a
// border is drawn) and any drawn outline for box parts; position, size, family and text style for text parts; text
// style for type parts. Numbers must agree within half a pixel, colors and
// families exactly. `render-web` rows mount the upstream web component under
// its stylesheet; `parse-rn` rows mount the upstream React Native component
// through react-native-web, so its published style objects are what is drawn.
// `none` rows are counted and skipped, so a skipped row is visible, never
// silent. The second reference is not wired yet; its rows are listed as
// fixme until the contract carries per-component geometry.

import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { discoverComponents } from '../scripts/lib/components.js';
import { openReference, openShowcase, readParts } from './harness/page.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const roster = JSON.parse(readFileSync(join(HERE, '..', 'data', 'roster.json'), 'utf8'));
const components = await discoverComponents();
const built = roster.rows.filter(function (row) {
  return row.status !== 'pending' && row.status !== 'not_applicable';
});
const byKind = { 'render-web': [], 'parse-rn': [], none: [] };
for (const row of built) {
  byKind[row.reference.kind].push(row.name);
}

// The template whose values the primary reference draws
const REFERENCE_TEMPLATE = 'carbon';
const TOLERANCE = 0.5;


/********************************************************************
Compare one measured value.

@param {String} property - Style property or geometry key
@param {*}      ours     - Our value
@param {*}      upstream - The upstream value

@return {Boolean} - True when they agree
*********************************************************************/
function agrees (property, ours, upstream) {

  // Letter spacing 'normal' is zero tracking
  const normal = function (value) {
    return property === 'letterSpacing' && value === 'normal' ? '0px' : value;
  };
  const a = normal(ours);
  const b = normal(upstream);

  // Numbers and pixel lengths agree within the tolerance
  const isLength = function (value) {
    return typeof value === 'number' || /^-?[0-9.]+(px)?$/.test(String(value));
  };
  if (isLength(a) && isLength(b)) {
    return Math.abs(parseFloat(a) - parseFloat(b)) <= TOLERANCE;
  }

  // Colors, families and keywords agree exactly
  return String(a) === String(b);

}


/********************************************************************
Every disagreement between our measurements and the upstream's.

@param {Object} ours     - state -> part -> measurement
@param {Object} upstream - state -> part -> measurement

@return {Array} - One line per disagreement
*********************************************************************/
function findDisagreements (ours, upstream) {

  const lines = [];
  for (const state of Object.keys(upstream)) {
    if (ours[state] === undefined) {
      lines.push(state + ': rendered upstream but not here');
      continue;
    }
    for (const part of Object.keys(upstream[state])) {
      const u = upstream[state][part];
      const o = ours[state][part];
      const uDrawn = u !== null && u.visible === true;
      const oDrawn = o !== null && o !== undefined && o.visible === true;
      if (!uDrawn && !oDrawn) {
        continue;
      }
      if (uDrawn !== oDrawn) {
        lines.push(state + ' / ' + part + ': ' + (oDrawn ? 'drawn here, not upstream' : 'drawn upstream, not here'));
        continue;
      }
      for (const property of Object.keys(u)) {
        // A border color is compared only where a border is drawn
        const undrawn = property === 'borderBottomColor' && parseFloat(o.borderBottomWidth) === 0 && parseFloat(u.borderBottomWidth) === 0;
        if (property !== 'visible' && !undrawn && !agrees(property, o[property], u[property])) {
          lines.push(state + ' / ' + part + ' / ' + property + ': ' + o[property] + ' here, ' + u[property] + ' upstream');
        }
      }
    }
  }

  return lines;

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

});


test.describe('measure: primary reference', function () {

  for (const name of byKind['render-web'].concat(byKind['parse-rn'])) {
    test(name + ': parts match the rendered upstream', async function ({ page }) {
      const component = components.find(function (entry) {
        return entry.name === name;
      });
      expect(component.reference, name + ' has a reference in the roster but no reference.js').not.toBeNull();
      const parts = component.reference.parts;

      // Upstream first: the states it can draw are the states compared
      const reference = await openReference(page, name);
      expect(reference.errors).toEqual([]);
      expect(reference.cells, name + ': the reference page drew no state').toBeGreaterThanOrEqual(1);
      const upstream = await readParts(page, name, parts, 'upstream');

      // Ours under the template that shares the reference's values
      const opened = await openShowcase(page, REFERENCE_TEMPLATE, name, { measure: true });
      expect(opened.status.errors).toEqual([]);
      const ours = await readParts(page, name, parts, 'ours');

      // Every named part is drawn upstream in some state, so no selector compares nothing
      const undrawn = Object.keys(parts).filter(function (part) {
        return !Object.keys(upstream).some(function (state) {
          return upstream[state][part] !== null && upstream[state][part].visible === true;
        });
      });
      expect(undrawn, name + ': parts the upstream never draws (a selector matches nothing)').toEqual([]);

      test.info().annotations.push({ type: 'measure', description: name + ': ' + Object.keys(upstream).length + ' states measured; unmeasured ' + JSON.stringify(reference.unmeasured) });
      expect(findDisagreements(ours, upstream), name + ' differs from the rendered upstream').toEqual([]);
    });
  }

});


test.describe('measure: second reference', function () {

  for (const row of built.filter(function (entry) {
    return entry.material_twin !== 'none' && entry.reference.kind === 'render-web';
  })) {
    test.fixme(row.name + ': parts match the second reference (' + row.material_twin + ')', function () {
      // Wired with the per-component geometry tokens queued in
      // CONTRACT-REQUESTS.md; until then the row carries deferred_gap
    });
  }

});
