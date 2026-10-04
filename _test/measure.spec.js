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
// silent. Rows whose `reference.js` carries a `second` block are measured
// the same way against the second reference (the Material web components,
// themed from the material template) under the material template; a part
// may name the properties it compares (`compare`) where the two anatomies
// split one box across elements.

import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { discoverComponents } from '../scripts/lib/components.js';
import { openReference, openShowcase, readParts } from './harness/page.js';

const GAPS = JSON.parse(readFileSync(new URL('./fixtures/expected-gaps.json', import.meta.url), 'utf8')).gaps;

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

// The template whose values each reference draws
const REFERENCE_TEMPLATE = 'carbon';
const SECOND_TEMPLATE = 'material';
const TOLERANCE = 0.5;


/********************************************************************
Compare one measured value.

@param {String} property - Style property or geometry key
@param {*}      ours     - Our value
@param {*}      upstream - The upstream value
@param {Number} slack    - Extra tolerance for this comparison (default 0)

@return {Boolean} - True when they agree
*********************************************************************/
function agrees (property, ours, upstream, slack) {

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
    return Math.abs(parseFloat(a) - parseFloat(b)) <= TOLERANCE + (slack || 0);
  }

  // Colors, families and keywords agree exactly
  return String(a) === String(b);

}


/********************************************************************
Every disagreement between our measurements and the upstream's.

@param {Object} ours     - state -> part -> measurement
@param {Object} upstream - state -> part -> measurement
@param {Object} parts    - The part definitions (for `compare` subsets)

@return {Array} - One line per disagreement
*********************************************************************/
function findDisagreements (ours, upstream, parts) {

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
      // An `optional` part is one the upstream draws only in some states on an element of its
      // own, while ours is always one element: it is compared where the upstream draws it
      if (!uDrawn && parts[part].optional === true) {
        continue;
      }
      if (uDrawn !== oDrawn) {
        lines.push(state + ' / ' + part + ': ' + (oDrawn ? 'drawn here, not upstream' : 'drawn upstream, not here'));
        continue;
      }
      const compared = (parts[part].compare || Object.keys(u)).filter(function (property) {
        return property !== 'visible' && property !== 'characters';
      });
      // A text's width is compared net of a tracking difference, which is reported on its own:
      // a reference that draws no tracking still has to place and size the text where we do.
      // A box that grows with a text part (`grows`) takes that text's slack
      const trackingOf = function (textPart) {
        const ot = ours[state][textPart];
        const ut = upstream[state][textPart];
        return ot && ut && ut.characters !== undefined
          ? Math.abs(parseFloat(ot.letterSpacing === 'normal' ? 0 : ot.letterSpacing) - parseFloat(ut.letterSpacing === 'normal' ? 0 : ut.letterSpacing)) * ut.characters
          : 0;
      };
      const tracking = u.characters !== undefined ? trackingOf(part) : parts[part].grows ? trackingOf(parts[part].grows) : 0;
      for (const property of compared) {
        // A border color is compared only where a border is drawn
        const undrawn = property === 'borderBottomColor' && parseFloat(o.borderBottomWidth) === 0 && parseFloat(u.borderBottomWidth) === 0;
        const slack = property === 'width' && tracking > 0 ? tracking : 0;
        if (!undrawn && !agrees(property, o[property], u[property], slack)) {
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
      expect(findDisagreements(ours, upstream, parts), name + ' differs from the rendered upstream').toEqual([]);
    });
  }

});


test.describe('measure: second reference', function () {

  const withSecond = components.filter(function (component) {
    return component.reference !== null && component.reference.second !== undefined;
  });

  test('every row with a second twin carries a second reference block', function () {
    const twinned = built.filter(function (row) {
      return row.material_twin !== 'none' && row.reference.kind === 'render-web';
    }).map(function (row) {
      return row.name;
    });
    expect(withSecond.map(function (component) {
      return component.name;
    }).sort()).toEqual(twinned.sort());
  });

  for (const component of withSecond) {
    test(component.name + ': parts match the second reference', async function ({ page }) {
      const parts = component.reference.second.parts;
      const reference = await openReference(page, component.name, 'second');
      expect(reference.errors).toEqual([]);
      expect(reference.cells, component.name + ': the second reference page drew no state').toBeGreaterThanOrEqual(1);
      const upstream = await readParts(page, component.name, parts, 'upstream', component.reference.second.origin);
      const opened = await openShowcase(page, SECOND_TEMPLATE, component.name, { measure: true });
      expect(opened.status.errors).toEqual([]);
      const ours = await readParts(page, component.name, parts, 'ours', component.reference.second.origin);
      const undrawn = Object.keys(parts).filter(function (part) {
        return !Object.keys(upstream).some(function (state) {
          return upstream[state][part] !== null && upstream[state][part].visible === true;
        });
      });
      expect(undrawn, component.name + ': parts the second reference never draws').toEqual([]);
      test.info().annotations.push({ type: 'measure', description: component.name + ' (second): ' + Object.keys(upstream).length + ' states measured; unmeasured ' + JSON.stringify(reference.unmeasured) });

      // A disagreement an expected gap explains (a queued contract request or template
      // finding) is set aside; a gap that no longer reproduces is stale and fails
      const gaps = GAPS.filter(function (gap) {
        return gap.check === 'measure-second' && gap.component === component.name;
      });
      const lines = findDisagreements(ours, upstream, parts);
      const explained = function (line) {
        return gaps.find(function (gap) {
          const inState = !gap.states || gap.states.some(function (state) {
            return line.indexOf(state + ' / ') === 0;
          });
          return inState && (line.indexOf(' / ' + gap.part + ' / ' + gap.property + ':') !== -1 || (gap.property === '*' && line.indexOf(' / ' + gap.part + ' / ') !== -1) || (gap.property === '*' && line.indexOf(' / ' + gap.part + ': ') !== -1));
        });
      };
      const stale = gaps.filter(function (gap) {
        return !lines.some(function (line) {
          return explained(line) === gap;
        });
      });
      expect(stale.map(function (gap) {
        return gap.part + ' / ' + gap.property + ' (' + gap.request + ')';
      }), component.name + ': expected gaps that no longer reproduce; remove them').toEqual([]);
      test.info().annotations.push({ type: 'measure', description: component.name + ' (second): ' + lines.filter(explained).length + ' disagreement(s) explained by ' + gaps.length + ' expected gap(s)' });
      expect(lines.filter(function (line) {
        return !explained(line);
      }), component.name + ' differs from the second reference').toEqual([]);
    });
  }

});
