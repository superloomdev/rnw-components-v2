// Source: _test/sheet.spec.js (Material parts, verbatim from 7f2bd93)

// --- _test/sheet.spec.js:2-6 ---
// with the family's cells under the three templates stacked, written to
// test-results/sheet/<Family>.png (light) and <Family>.dark.png (each
// template's dark scheme), plus an index of what was captured.
// Screenshots are evidence for a reviewer; this spec asserts only that
// every family and template produced one.

// --- _test/sheet.spec.js:14-14 ---
import { TEMPLATE_NAMES, hideOutsideLayers, openShowcase, restoreLayers } from './harness/page.js';

// --- _test/sheet.spec.js:61-61 ---
    for (const template of TEMPLATE_NAMES) {

// --- _test/sheet.spec.js:88-94 ---
      const templates = Object.keys(captured[family]);
      expect(templates.sort()).toEqual(TEMPLATE_NAMES.slice().sort());
      const file = family + (scheme === 'dark' ? '.dark' : '') + '.png';
      writeFileSync(join(OUT, file), stack(TEMPLATE_NAMES.map(function (template) {
        return captured[family][template];
      })));
      index.push({ family: family, scheme: scheme, file: file, templates: TEMPLATE_NAMES });

// --- _test/harness/page.js:8 (the name list the sheet iterates) ---
export const TEMPLATE_NAMES = ['default', 'carbon', 'material'];
