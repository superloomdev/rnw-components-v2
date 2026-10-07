// Info: The fidelity census: the fidelity gate's own comparison
// (`harness/fidelity.js`) over every built row with a reference, against
// each reference it has and under each template's light and dark scheme,
// with nothing asserted. Each run writes its findings and screenshots to
// test-results/census/ for scripts/census.js, so one report lists every
// difference at once.

import { test } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { discoverComponents, getRoster } from '../../scripts/lib/components.js';
import { SCHEMES, TEMPLATE, runFidelity } from '../harness/fidelity.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, 'test-results', 'census');

const components = (await discoverComponents()).filter(function (component) {
  return component.reference !== null;
});
// Row name -> perceptual budget
const BUDGET = Object.fromEntries(getRoster().rows.map(function (row) {
  return [row.name, row.diff_budget];
}));


test.describe('fidelity census', function () {

  mkdirSync(OUT, { recursive: true });

  for (const component of components) {
    const sets = component.reference.second ? ['primary', 'second'] : ['primary'];
    for (const set of sets) {
      for (const scheme of SCHEMES) {
        test(component.name + ' / ' + set + ' / ' + scheme, async function ({ page }) {
          const run = await runFidelity(page, component, set, scheme);
          const shotDir = join(OUT, component.name + '-' + set + '-' + scheme);
          mkdirSync(shotDir, { recursive: true });
          for (const key of Object.keys(run.shots)) {
            const name = key.replace(/[^a-z0-9@]+/gi, '_');
            writeFileSync(join(shotDir, name + '.ours.png'), run.shots[key].ours);
            writeFileSync(join(shotDir, name + '.upstream.png'), run.shots[key].upstream);
          }
          writeFileSync(join(OUT, component.name + '-' + set + '-' + scheme + '.json'), JSON.stringify({
            component: component.name,
            set: set,
            scheme: scheme,
            template: TEMPLATE[set],
            budget: BUDGET[component.name],
            states: run.states,
            unmeasured: run.unmeasured,
            errors: run.errors,
            lines: run.lines,
            perceptual: run.perceptual,
            upstream: run.upstream,
            ours: run.ours
          }, null, 1));
        });
      }
    }
  }

});
