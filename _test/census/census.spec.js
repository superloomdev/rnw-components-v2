// Info: The fidelity census. For every built row with a reference, against
// each reference it has (the primary under the carbon template, the second
// under the material template) and under each template's light and dark
// scheme: every sample state, and every enabled state again while hovered,
// keyboard-focused and pressed, is measured on both pages with the extended
// reading (shadow, ink of text and paths with every opacity above them, the
// paint sampled from the pixels of each box part), compared with the gate's
// own comparison, and screenshotted for a perceptual ratio. No expected gap
// is set aside and nothing is asserted: each run writes its findings to
// test-results/census/<row>-<set>-<scheme>.json for scripts/census.js.

import { test } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { discoverComponents } from '../../scripts/lib/components.js';
import { findDisagreements } from '../harness/compare.js';
import { enterInteraction, leaveInteraction, openReference, openShowcase, readParts, shootCell } from '../harness/page.js';
import { perceptualRatio } from '../harness/perceptual.js';
import { decode } from '../harness/pixels.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, 'test-results', 'census');
const INTERACTIONS = ['hover', 'focus', 'pressed'];
const SCHEMES = ['light', 'dark'];
const MARGIN = 8;
// How far above a part's top edge the census samples the paint, to see a focus ring drawn outside it
const RING_OFFSETS = [1, 2, 3, 4, 5, 6];
// The part a focus ring is drawn around, per component
const RING_ANCHOR = { Button: 'root', Checkbox: 'box', TextInput: 'frame', Select: 'frame' };
const TEMPLATE = { primary: 'carbon', second: 'material' };

const components = (await discoverComponents()).filter(function (component) {
  return component.reference !== null;
});


/********************************************************************
Sample the paint of every box part from a cell screenshot: the pixel a
little inside the part's top edge, at its horizontal centre (below any
border, above any centred text).

@param {Object} state - part name -> measurement
@param {Buffer} shot  - The cell screenshot (body plus MARGIN)

@return {void}
*********************************************************************/
function samplePaint (state, shot) {

  if (!shot) {
    return;
  }
  const image = decode(shot);
  for (const name of Object.keys(state)) {
    const part = state[name];
    if (part === null || part.visible !== true || part.ink !== undefined || part._bodyX === undefined || part.width < 6 || part.height < 6) {
      continue;
    }
    const inset = Math.min(part.height / 2, Math.max(3, (parseFloat(part.borderTopWidth) || 0) + 2));
    const pixel = image.at(MARGIN + part._bodyX + part.width / 2, MARGIN + part._bodyY + inset);
    if (pixel !== null) {
      part.paint = 'rgb(' + pixel.r + ', ' + pixel.g + ', ' + pixel.b + ')';
    }
  }

}


/********************************************************************
The paint just outside a part's top edge, at its centre: one colour per
pixel row above it. Equal profiles mean an equal ring (or none).

@param {Object} part - The anchor part's measurement
@param {Buffer} shot - The cell screenshot

@return {Array|null} - [[r, g, b], ...] from the edge outward
*********************************************************************/
function ringProfile (part, shot) {

  if (!shot || !part || part._bodyX === undefined) {
    return null;
  }
  const image = decode(shot);

  return RING_OFFSETS.map(function (offset) {
    const pixel = image.at(MARGIN + part._bodyX + part.width / 2, MARGIN + part._bodyY - offset);
    return pixel === null ? null : [pixel.r, pixel.g, pixel.b];
  });

}


/********************************************************************
Compare two ring profiles row by row, three levels per channel.

@param {Array} ours     - Our profile
@param {Array} upstream - The upstream profile

@return {String|null} - A description of the first difference, or null
*********************************************************************/
function compareRing (ours, upstream) {

  if (!ours || !upstream) {
    return null;
  }
  for (let i = 0; i < RING_OFFSETS.length; i++) {
    const a = ours[i];
    const b = upstream[i];
    if (a === null || b === null) {
      continue;
    }
    if (a.some(function (value, index) {
      return Math.abs(value - b[index]) > 3;
    })) {
      return RING_OFFSETS[i] + 'px outside: rgb(' + a.join(', ') + ') here, rgb(' + b.join(', ') + ') upstream';
    }
  }

  return null;

}


/********************************************************************
Measure one page: every rest state, then every enabled state in each
interaction.

@param {Object} page      - Playwright page
@param {Object} component - Discovered component
@param {Object} reference - The reference block (primary or second)
@param {String} side      - 'upstream' | 'ours'

@return {Promise<Object>} - { states: label -> parts, shots: label -> PNG }
*********************************************************************/
async function collect (page, component, reference, side) {

  const parts = reference.parts;
  const origin = reference.origin;
  const rest = await readParts(page, component.name, parts, side, origin, { extended: true });
  const states = {};
  const shots = {};
  for (const label of Object.keys(rest)) {
    states[label] = rest[label];
    shots[label] = await shootCell(page, component.name, label, MARGIN);
    samplePaint(states[label], shots[label]);
  }
  const target = reference.target;
  if (!target) {
    return { states: states, shots: shots };
  }
  const enabled = component.sample.filter(function (entry) {
    return !(entry.props && entry.props.disabled === true) && rest[entry.label] !== undefined;
  });
  for (const entry of enabled) {
    for (const interaction of INTERACTIONS) {
      const selector = interaction === 'focus' && target[side + 'Focus'] ? target[side + 'Focus'] : target[side];
      if (!await enterInteraction(page, component.name, entry.label, selector, interaction)) {
        continue;
      }
      const key = entry.label + ' @' + interaction;
      const read = await readParts(page, component.name, parts, side, origin, { extended: true, only: entry.label });
      states[key] = read[entry.label];
      shots[key] = await shootCell(page, component.name, entry.label, MARGIN);
      samplePaint(states[key], shots[key]);
      await leaveInteraction(page);
    }
  }

  return { states: states, shots: shots };

}


test.describe('fidelity census', function () {

  mkdirSync(OUT, { recursive: true });

  for (const component of components) {
    const sets = component.reference.second ? ['primary', 'second'] : ['primary'];
    for (const set of sets) {
      for (const scheme of SCHEMES) {
        test(component.name + ' / ' + set + ' / ' + scheme, async function ({ page }) {
          const reference = set === 'second' ? component.reference.second : component.reference;
          const status = await openReference(page, component.name, set, scheme);
          const upstream = await collect(page, component, reference, 'upstream');
          const opened = await openShowcase(page, TEMPLATE[set], component.name, { measure: true, scheme: scheme });
          const ours = await collect(page, component, reference, 'ours');
          const lines = findDisagreements(ours.states, upstream.states, reference.parts, ['paint', 'ink', 'boxShadow']);
          const perceptual = {};
          const anchor = RING_ANCHOR[component.name];
          const shotDir = join(OUT, component.name + '-' + set + '-' + scheme);
          mkdirSync(shotDir, { recursive: true });
          for (const key of Object.keys(upstream.shots)) {
            if (!(upstream.shots[key] && ours.shots[key])) {
              continue;
            }
            perceptual[key] = Math.round(perceptualRatio(ours.shots[key], upstream.shots[key]) * 10000) / 100;
            writeFileSync(join(shotDir, key.replace(/[^a-z0-9@]+/gi, '_') + '.ours.png'), ours.shots[key]);
            writeFileSync(join(shotDir, key.replace(/[^a-z0-9@]+/gi, '_') + '.upstream.png'), upstream.shots[key]);
            if (anchor && ours.states[key] && upstream.states[key]) {
              const ring = compareRing(ringProfile(ours.states[key][anchor], ours.shots[key]), ringProfile(upstream.states[key][anchor], upstream.shots[key]));
              if (ring !== null) {
                lines.push(key + ' / ring (' + anchor + '): ' + ring);
              }
            }
          }
          writeFileSync(join(OUT, component.name + '-' + set + '-' + scheme + '.json'), JSON.stringify({
            component: component.name,
            set: set,
            scheme: scheme,
            template: TEMPLATE[set],
            budget: null,
            states: Object.keys(upstream.states).length,
            unmeasured: status.unmeasured,
            errors: status.errors.concat(opened.status.errors),
            lines: lines,
            perceptual: perceptual,
            upstream: upstream.states,
            ours: ours.states
          }, null, 1));
        });
      }
    }
  }

});
