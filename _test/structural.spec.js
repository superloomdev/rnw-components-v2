// Info: Gate layer 1 - structural, per component, per template, in a real
// browser with the real frameworks. Zero console and page errors; every
// sample state renders a non-empty cell; no painted element overflows its
// cell; no clipped visible text (a line cut with an ellipsis is declared); no unit string in an inline style; interactive targets are
// at least 44 points; the accessibility tree is identical across the three
// templates.

import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

import { TEMPLATE_NAMES, openShowcase, readA11yTrees, readCells, readControlPaint, readTextContrast } from './harness/page.js';

const INTERACTIVE_ROLES = ['button', 'checkbox', 'combobox', 'link', 'menuitem', 'option', 'radio', 'slider', 'switch', 'tab', 'textbox'];
const UNIT = /:\s*-?[0-9.]+(rem|em|vw|vh)\b/;
// WCAG 1.4.3: 4.5:1 for text, 3:1 for large text (24px, or 18.66px bold)
const CONTRAST_MIN = 4.5;
const CONTRAST_MIN_LARGE = 3;
const EXCEPTIONS = JSON.parse(readFileSync(new URL('./fixtures/contrast-exceptions.json', import.meta.url), 'utf8')).exceptions;


/********************************************************************
Normalize a CSS or token color to "r,g,b,a" so a computed color can be
matched against a template value written as hex or rgba().

@param {String} value - "#rrggbb", "#rgb", "rgb(...)" or "rgba(...)"

@return {String|null}
*********************************************************************/
function colorKey (value) {

  if (typeof value !== 'string') {
    return null;
  }
  const hex = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex !== null) {
    const digits = hex[1].length === 3 ? hex[1].split('').map(function (d) {
      return d + d;
    }).join('') : hex[1];
    return [0, 2, 4].map(function (i) {
      return parseInt(digits.slice(i, i + 2), 16);
    }).concat(1).join(',');
  }
  const rgb = value.match(/rgba?\(([^)]+)\)/);
  if (rgb === null) {
    return null;
  }
  const parts = rgb[1].split(',').map(parseFloat);

  return parts.concat(parts.length > 3 ? [] : [1]).join(',');

}

for (const template of TEMPLATE_NAMES) {

  test.describe('structural: ' + template, function () {

    let opened;
    let cells;
    let runs;
    let paints;

    test.beforeAll(async function ({ browser }) {
      const page = await browser.newPage();
      opened = await openShowcase(page, template);
      cells = await readCells(page);
      runs = await readTextContrast(page);
      paints = await readControlPaint(page);
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

    test('every drawn text run meets the contrast minimum against its backdrop', function () {
      expect(runs.length).toBeGreaterThanOrEqual(1);
      // The exceptions of this template, as the color keys of their tokens
      const exempt = EXCEPTIONS.filter(function (entry) {
        return entry.template === template;
      }).map(function (entry) {
        const key = colorKey(opened.theme[entry.token]);
        expect(key, entry.token + ' resolves to a color in ' + template).not.toBeNull();
        return { token: entry.token, key: key, seen: false };
      });
      for (const run of runs) {
        // Disabled text is inactive and exempt
        if (run.disabled) {
          continue;
        }
        const id = run.component + ' / ' + run.state + ' ' + run.kind + ' "' + run.text + '"';
        const large = run.fontSize >= 24 || (run.fontSize >= 18.66 && run.fontWeight >= 700);
        const minimum = large ? CONTRAST_MIN_LARGE : CONTRAST_MIN;
        const exception = exempt.find(function (entry) {
          return entry.key === colorKey(run.color);
        });
        if (exception !== undefined) {
          exception.seen = exception.seen || run.ratio < minimum;
          continue;
        }
        expect(run.ratio, id + ' contrast ' + run.ratio + ':1 (' + run.color + ') below ' + minimum + ':1').toBeGreaterThanOrEqual(minimum);
      }
      // A listed exception that no longer reproduces is stale
      for (const entry of exempt) {
        expect(entry.seen, 'exception ' + entry.token + ' no longer reproduces under ' + template + '; remove it').toBe(true);
      }
    });

    test('every enabled control state paints differently from every disabled state of its component', function () {
      const disabled = paints.filter(function (cell) {
        return cell.disabled;
      });
      expect(disabled.length).toBeGreaterThanOrEqual(1);
      for (const cell of paints) {
        if (cell.disabled) {
          continue;
        }
        for (const other of disabled) {
          if (other.component !== cell.component) {
            continue;
          }
          expect(cell.paint, cell.component + ' / ' + cell.state + ' paints exactly like disabled state "' + other.state + '"').not.toBe(other.paint);
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
