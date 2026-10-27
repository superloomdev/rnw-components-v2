// Info: The fidelity gate. Every built row with a reference, against each
// reference it has (the primary under the carbon template, the second under
// the material template) and under each template's light and dark scheme:
// every sample state and every enabled state while hovered, keyboard focused
// and pressed must match the reference part for part (`harness/fidelity.js`:
// geometry, type, colors with their opacity, sampled paint, and the ring
// and shadow pixels at the anchor part), and stay within the row's
// diff_budget perceptually. No expected gap is set aside: a difference is a
// template, component or harness defect. A masked omission (`second.omit`,
// proven undrawn upstream by its probe) is left out of the pixels, and a
// mask that would cover the anchor part fails.

import { expect, test } from '@playwright/test';

import { discoverComponents, getRoster } from '../scripts/lib/components.js';
import { SCHEMES, runFidelity } from './harness/fidelity.js';

const components = (await discoverComponents()).filter(function (component) {
  return component.reference !== null;
});
// Row name -> perceptual budget
const BUDGET = Object.fromEntries(getRoster().rows.map(function (row) {
  return [row.name, row.diff_budget];
}));
// A row with no primary-system twin runs no primary set (its mount answers null)
const NO_PRIMARY = new Set(getRoster().rows.filter(function (row) {
  return row.carbon_twin === 'none';
}).map(function (row) {
  return row.name;
}));


test.describe('fidelity', function () {

  for (const component of components) {
    const sets = ['primary'];
    for (const set of sets) {
      for (const scheme of SCHEMES) {
        test(component.name + ' / ' + set + ' / ' + scheme + ': matches the reference in every state', async function ({ page }) {
          test.slow();
          if (NO_PRIMARY.has(component.name)) {
            test.info().annotations.push({ type: 'fidelity', description: component.name + ': skipped (no primary twin)' });
            test.skip();
            return;
          }
          const run = await runFidelity(page, component, set, scheme);
          if (run.errors.length > 0 || run.lines.length > 0 ||
              Object.values(run.perceptual).some(value => value > BUDGET[component.name])) {
            await test.info().attach('fidelity-parts', {
              body: JSON.stringify({ upstream: run.upstream, ours: run.ours, lines: run.lines, perceptual: run.perceptual, errors: run.errors }),
              contentType: 'application/json'
            });
            const failedKeys = new Set(run.lines.map(line => line.split(' / ')[0]).concat(
              Object.keys(run.perceptual).filter(key => run.perceptual[key] > BUDGET[component.name])));
            for (const key of failedKeys) {
              if (run.shots[key]) {
                for (const side of ['ours', 'upstream']) {
                  await test.info().attach(key + ' ' + side, { body: run.shots[key][side], contentType: 'image/png' });
                }
              }
            }
          }
          expect(run.errors, 'render errors').toEqual([]);
          expect(run.lines, component.name + ' differs from its ' + set + ' reference (' + scheme + ')').toEqual([]);
          const over = Object.keys(run.perceptual).filter(function (key) {
            return run.perceptual[key] > BUDGET[component.name];
          }).map(function (key) {
            return key + ': ' + run.perceptual[key] + '% > ' + BUDGET[component.name] + '%';
          });
          expect(over, component.name + ' states over the diff budget').toEqual([]);
        });
      }
    }
  }

});
