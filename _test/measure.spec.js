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
// silent.

import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';

import { discoverComponents } from '../scripts/lib/components.js';
import { findDisagreements } from './harness/compare.js';
import { targetInteractions } from './harness/fidelity.js';
import { enterInteraction, leaveInteraction, openReference, openShowcase, readParts, reopenPanel } from './harness/page.js';
import { explainDisagreements } from './harness/expected-gaps.js';

const GAPS = JSON.parse(readFileSync(new URL('./fixtures/expected-gaps.json', import.meta.url), 'utf8')).gaps;

const HERE = dirname(fileURLToPath(import.meta.url));
const roster = JSON.parse(readFileSync(join(HERE, '..', 'data', 'roster.json'), 'utf8'));
const components = await discoverComponents();
const built = roster.rows.filter(function (row) {
  return row.status !== 'pending';
});
const byKind = { 'render-web': [], 'parse-rn': [], none: [] };
for (const row of built) {
  byKind[row.reference.kind].push(row.name);
}
// A built row with no primary-system twin draws no primary reference: its
// primary mount must answer null for every sample state, so the skip cannot
// hide a primary that exists
const noPrimaryTwin = new Set(built.filter(function (row) {
  return row.carbon_twin === 'none' && row.reference.kind !== 'none';
}).map(function (row) {
  return row.name;
}));

// The template whose values each reference draws
const REFERENCE_TEMPLATE = 'carbon';
// The second reference paints some colors as a role at an element opacity, where a template
// states the same color as rgba: the CSS of a shadow is the fidelity gate's pixels, and a text
// color is compared as its ink (the color at the opacity it is painted at)
const AS_PAINTED = function (state, part, property, ours, upstream) {
  return property === 'boxShadow' || (property === 'color' && ours.ink !== undefined && upstream.ink !== undefined);
};


/********************************************************************
The parts drawn anywhere in the measured states, exercising the
interactions the reference declares until each has drawn once - a
selector gated behind one (the open list) is not a dead selector, and the
first open cell covers the parts the rest read left hidden.

@param {Object} page      - Playwright page
@param {Object} component - Discovered component
@param {Object} reference - The reference block (primary or second)
@param {String} side      - 'upstream' | 'ours'
@param {Boolean} extended - Read ink, shadows and body-relative boxes too
@param {Object} states    - The resting read: state label -> part -> measurement

@return {Promise<Object>} - { drawn }: the names of the parts drawn in some
  state; { failures }: the declared targets missing on an enabled, mounted
  state (a main or additional target that resolves to nothing is reported,
  never silently skipped, as the fidelity gate reports them)
*********************************************************************/
// A `reopen.states` label reads on its own right after reopening that
// state: an opened upstream panel focuses its option, closing every
// sibling's, so each is measured while its own panel is open
async function rereadReopened (page, component, reference, side, extended, states) {
  if (reference.reopen === undefined || !Array.isArray(reference.reopen.states)) {
    return;
  }
  for (const label of reference.reopen.states) {
    if (states[label] === undefined) {
      continue;
    }
    await reopenPanel(page, component.name, label, reference.reopen, side, {
        escape: reference.escapeOnLeave !== false,
        releaseBeforeMove: reference.releaseBeforeMove === true,
        clickOutside: reference.clickOutsideOnLeave === true
      });
    await page.mouse.move(0, 0);
    const reread = await readParts(page, component.name, reference.parts, side, reference.origin, { extended: extended, only: label, pauseAnimations: reference.pauseAnimations === true });
    if (reread[label] !== undefined) {
      states[label] = reread[label];
    }
    await leaveInteraction(page, {
      escape: reference.escapeOnLeave !== false,
      releaseBeforeMove: reference.releaseBeforeMove === true,
      clickOutside: reference.clickOutsideOnLeave === true
    });
  }
}

async function drawnParts (page, component, reference, side, extended, states) {

  const parts = reference.parts;
  const drawn = new Set();
  const failures = [];
  const collect = function (map) {
    for (const state of Object.keys(map)) {
      for (const part of Object.keys(map[state] || {})) {
        if (map[state][part] !== null && map[state][part] !== undefined && map[state][part].visible === true) {
          drawn.add(part);
        }
      }
    }
  };
  collect(states);

  const target = reference.target;
  const interactions = Array.isArray(reference.interactions) ? reference.interactions : [];
  const additional = Array.isArray(reference.additionalTargets) ? reference.additionalTargets : [];
  if ((!target && additional.length === 0) || interactions.length === 0) {
    return { drawn: drawn, failures: failures };
  }
  const enabled = component.sample.filter(function (entry) {
    return !(entry.props && entry.props.disabled === true) && states[entry.label] !== undefined;
  });
  // A reference where Escape is the component's own action skips only that
  // key on leave; pointer release, blur and the settle wait stay
  const leave = function () {
    return leaveInteraction(page, {
      escape: reference.escapeOnLeave !== false,
      releaseBeforeMove: reference.releaseBeforeMove === true,
      clickOutside: reference.clickOutsideOnLeave === true
    });
  };
  const read = async function (label) {
    collect(await readParts(page, component.name, parts, side, reference.origin, { extended: extended, only: label, pauseAnimations: reference.pauseAnimations === true }));
  };
  if (target) {
    for (const entry of enabled) {
      for (const interaction of interactions) {
        if (drawn.size === Object.keys(parts).length) {
          return { drawn: drawn, failures: failures };
        }
        const selector = interaction === 'focus' && target[side + 'Focus'] ? target[side + 'Focus'] : target[side];
        await reopenPanel(page, component.name, entry.label, reference.reopen, side, {
          escape: reference.escapeOnLeave !== false,
          releaseBeforeMove: reference.releaseBeforeMove === true,
          clickOutside: reference.clickOutsideOnLeave === true
        });
        if (!await enterInteraction(page, component.name, entry.label, selector, interaction, { point: target.point === true })) {
          failures.push(entry.label + ' @' + interaction + ': target not found on ' + side);
          continue;
        }
        await read(entry.label);
        await leave();
      }
    }
  }
  // The main target never exercises an action button, so every declared
  // additional target is driven over the enabled states its own list keeps
  for (const extra of additional) {
    const list = Array.isArray(extra.states)
      ? enabled.filter(function (entry) {
        return extra.states.indexOf(entry.label) !== -1;
      })
      : enabled;
    for (const entry of list) {
      for (const interaction of targetInteractions(extra, interactions)) {
        if (drawn.size === Object.keys(parts).length) {
          return { drawn: drawn, failures: failures };
        }
        const selector = interaction === 'focus' && extra[side + 'Focus'] ? extra[side + 'Focus'] : extra[side];
        await reopenPanel(page, component.name, entry.label, reference.reopen, side, {
          escape: reference.escapeOnLeave !== false,
          releaseBeforeMove: reference.releaseBeforeMove === true,
          clickOutside: reference.clickOutsideOnLeave === true
        });
        if (!await enterInteraction(page, component.name, entry.label, selector, interaction, { point: extra.point === true })) {
          failures.push(entry.label + ' @' + extra.name + ' ' + interaction + ': additional target "' + extra.name + '" not found on ' + side);
          continue;
        }
        await read(entry.label);
        await leave();
      }
    }
  }

  return { drawn: drawn, failures: failures };

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
    // A row with no primary-system twin must mount nothing for every sample
    // state; an upstream stub proves the mount never reaches for one
    for (const name of noPrimaryTwin) {
      const component = components.find(function (entry) {
        return entry.name === name;
      });
      for (const state of component.sample) {
        // A `none` reference mounts nothing by construction
        if (component.reference.kind === 'none') {
          continue;
        }
        expect(component.reference.mount(React, {}, state.props), name + ' / ' + state.label + ': no primary twin but the primary mount drew something').toBeNull();
      }
    }
    test.info().annotations.push({ type: 'measure', description: 'render-web ' + byKind['render-web'].length + ', parse-rn ' + byKind['parse-rn'].length + ', none (skipped) ' + byKind.none.length + ', no primary twin (skipped) ' + noPrimaryTwin.size });
  });

});


test.describe('measure: primary reference', function () {

  for (const name of byKind['render-web'].concat(byKind['parse-rn']).filter(function (name) {
    return !noPrimaryTwin.has(name);
  })) {
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
      const upstream = await readParts(page, name, parts, 'upstream', undefined, { pauseAnimations: component.reference.pauseAnimations === true });
      await rereadReopened(page, component, component.reference, 'upstream', false, upstream);
      const upstreamDrawn = await drawnParts(page, component, component.reference, 'upstream', false, upstream);
      expect(upstreamDrawn.failures, name + ': declared targets missing upstream').toEqual([]);

      // Ours under the template that shares the reference's values,
      // unhosted as the upstream is
      const opened = await openShowcase(page, REFERENCE_TEMPLATE, name, { measure: true, hosted: false });
      expect(opened.status.errors).toEqual([]);
      const ours = await readParts(page, name, parts, 'ours', undefined, { pauseAnimations: component.reference.pauseAnimations === true });
      await rereadReopened(page, component, component.reference, 'ours', false, ours);

      // Every named part is drawn upstream in some state, so no selector compares nothing
      const undrawn = Object.keys(parts).filter(function (part) {
        return !upstreamDrawn.drawn.has(part);
      });
      expect(undrawn, name + ': parts the upstream never draws (a selector matches nothing)').toEqual([]);

      test.info().annotations.push({ type: 'measure', description: name + ': ' + Object.keys(upstream).length + ' states measured; unmeasured ' + JSON.stringify(reference.unmeasured) });
      const lines = findDisagreements(ours, upstream, parts);
      // A disagreement an expected gap explains is set aside; a gap that no
      // longer reproduces is stale and fails (FIDELITY RULES 5)
      const gate = explainDisagreements(lines, GAPS, name, 'measure');
      if (gate.explained.length > 0) {
        test.info().annotations.push({ type: 'measure', description: name + ': ' + gate.explained.length + ' disagreement(s) covered by expected gaps' });
      }
      expect(gate.stale.map(function (gap) { return gap.part + ' / ' + gap.property + ' (' + gap.request + ')'; }), name + ': expected gaps no longer reproduce; remove them').toEqual([]);
      expect(gate.unexplained, name + ' differs from the rendered upstream').toEqual([]);
    });
  }

});


