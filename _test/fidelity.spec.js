// Info: The fidelity gate. Every built row with a reference, against each
// reference it has (the primary under the carbon template, the second under
// the material template) and under each template's light and dark scheme:
// every sample state and every enabled state while hovered, keyboard focused
// and pressed must match the reference part for part (`harness/fidelity.js`:
// geometry, type, colours with their opacity, sampled paint, and the ring
// and shadow pixels at the anchor part), and stay within the row's
// diff_budget perceptually. No expected gap is set aside: a difference is a
// template, component or harness defect.

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


test.describe('fidelity', function () {

  for (const component of components) {
    const sets = component.reference.second ? ['primary', 'second'] : ['primary'];
    for (const set of sets) {
      for (const scheme of SCHEMES) {
        test(component.name + ' / ' + set + ' / ' + scheme + ': matches the reference in every state', async function ({ page }) {
          test.setTimeout(300000);
          const run = await runFidelity(page, component, set, scheme);
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
