// Info: Gate layer 1 - structural, per component, per template, in a real
// browser with the real frameworks. Zero console and page errors; every
// sample state renders a non-empty cell; no painted element overflows its
// cell; no clipped visible text (a line cut with an ellipsis is declared); no unit string in an inline style; interactive targets are
// at least 44 points; the accessibility tree is identical across the three
// templates.

import { expect, test } from '@playwright/test';

import { TEMPLATE_NAMES, openShowcase, readA11yTrees, readCells } from './harness/page.js';

const INTERACTIVE_ROLES = ['button', 'checkbox', 'combobox', 'link', 'menuitem', 'option', 'radio', 'slider', 'switch', 'tab', 'textbox'];
const UNIT = /:\s*-?[0-9.]+(rem|em|vw|vh)\b/;

for (const template of TEMPLATE_NAMES) {

  test.describe('structural: ' + template, function () {

    let opened;
    let cells;

    test.beforeAll(async function ({ browser }) {
      const page = await browser.newPage();
      opened = await openShowcase(page, template);
      cells = await readCells(page);
      await page.close();
    });

    test('the showcase renders every component with zero errors', function () {
      expect(opened.status.errors).toEqual([]);
      expect(opened.pageErrors).toEqual([]);
      expect(opened.consoleErrors).toEqual([]);
      expect(opened.status.components.length).toBeGreaterThanOrEqual(1);
      expect(cells.length).toBeGreaterThanOrEqual(opened.status.components.length);
      expect(cells.length).toBe(opened.status.cells);
    });

    test('every cell has rendered content within its bounds', function () {
      for (const cell of cells) {
        const id = cell.component + ' / ' + cell.state;
        expect(cell.children.length, id + ' rendered nothing').toBeGreaterThanOrEqual(1);
        expect(cell.rect.width, id + ' has no width').toBeGreaterThan(0);
        expect(cell.rect.height, id + ' has no height').toBeGreaterThan(0);
        for (const child of cell.children) {
          // Nothing painted cannot overflow: an empty box, a transparent state layer, a hidden sizer
          if ((child.rect.width === 0 && child.rect.height === 0) || child.undrawn) {
            continue;
          }
          expect(child.rect.x, id + ' <' + child.tag + '> overflows left').toBeGreaterThanOrEqual(cell.rect.x - 0.5);
          expect(child.rect.y, id + ' <' + child.tag + '> overflows top').toBeGreaterThanOrEqual(cell.rect.y - 0.5);
          expect(child.rect.x + child.rect.width, id + ' <' + child.tag + '> overflows right').toBeLessThanOrEqual(cell.rect.x + cell.rect.width + 0.5);
          expect(child.rect.y + child.rect.height, id + ' <' + child.tag + '> overflows bottom').toBeLessThanOrEqual(cell.rect.y + cell.rect.height + 0.5);
        }
      }
    });

    test('no clipped text and no unit string in an inline style', function () {
      for (const cell of cells) {
        const id = cell.component + ' / ' + cell.state;
        for (const child of cell.children) {
          // A line cut with an ellipsis is a declared truncation, not clipping
          if (child.text && child.overflow === 'hidden' && child.textOverflow !== 'ellipsis' && !child.undrawn) {
            expect(child.scrollWidth, id + ' clips text "' + child.text + '"').toBeLessThanOrEqual(child.clientWidth);
            expect(child.scrollHeight, id + ' clips text "' + child.text + '"').toBeLessThanOrEqual(child.clientHeight);
          }
          for (const declaration of child.units) {
            expect(UNIT.test(declaration), id + ' inline style carries a unit string: ' + declaration).toBe(false);
          }
        }
      }
    });

    test('interactive targets are at least 44 points', function () {
      for (const cell of cells) {
        for (const child of cell.children) {
          if (INTERACTIVE_ROLES.includes(child.role)) {
            expect(Math.max(child.rect.width, child.rect.height), cell.component + ' / ' + cell.state + ' ' + child.role + ' target').toBeGreaterThanOrEqual(44);
          }
        }
      }
    });

  });

}

test.describe('structural: cross-template', function () {

  test('the accessibility tree is identical under every template', async function ({ page }) {
    // Collected here, not by the per-template blocks: a failure elsewhere
    // restarts the worker and would empty any tree shared across tests
    const trees = {};
    for (const template of TEMPLATE_NAMES) {
      await openShowcase(page, template);
      trees[template] = await readA11yTrees(page);
    }
    const keys = Object.keys(trees[TEMPLATE_NAMES[0]]);
    expect(keys.length).toBeGreaterThanOrEqual(1);
    for (const template of TEMPLATE_NAMES.slice(1)) {
      expect(Object.keys(trees[template]).sort()).toEqual(keys.slice().sort());
      for (const key of keys) {
        expect(trees[template][key], key + ' differs between ' + TEMPLATE_NAMES[0] + ' and ' + template).toEqual(trees[TEMPLATE_NAMES[0]][key]);
      }
    }
  });

});
