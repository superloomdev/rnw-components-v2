// Info: Gate layer 1 - structural, per component, per template, in a real
// browser with the real frameworks. Zero console and page errors; every
// sample state renders a non-empty cell; no painted element overflows its
// cell; no clipped visible text (a line cut with an ellipsis is declared);
// no unit string in an inline style; every interactive target meets the
// theme's `control.target_min` on both axes or clears the WCAG 2.5.8
// spacing rule; the accessibility tree is identical across the three
// templates. The suite runs at one showcase width per form class
// (375 compact, 768 medium, 1280 expanded), each with the theme built for
// that width's class, plus the textScale-2, adaptive-fixed and rtl passes
// the matrix asks for.

import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

import { discoverComponents } from '../scripts/lib/components.js';
import { TEMPLATE_NAMES, openShowcase, readA11yTrees, readCells, readControlPaint, readTextBoxes, readTextContrast } from './harness/page.js';

const INTERACTIVE_ROLES = ['button', 'checkbox', 'combobox', 'link', 'menuitem', 'option', 'radio', 'slider', 'switch', 'tab', 'textbox'];
const UNIT = /:\s*-?[0-9.]+(rem|em|vw|vh)\b/;
// One showcase width per form class: compact, medium, expanded
const WIDTHS = [375, 768, 1280];
// WCAG 1.4.3: 4.5:1 for text, 3:1 for large text (24px, or 18.66px bold)
const CONTRAST_MIN = 4.5;
const CONTRAST_MIN_LARGE = 3;
const EXCEPTIONS = JSON.parse(readFileSync(new URL('./fixtures/contrast-exceptions.json', import.meta.url), 'utf8')).exceptions;

// The cells whose sample state is declared disabled: a non-interactive
// component draws no aria marker for the gate to find, so the contrast
// exemption reads the props the cell was rendered with
const DISABLED_CELLS = (await discoverComponents()).flatMap(function (component) {
  return component.sample.filter(function (entry) {
    return entry.props !== undefined && entry.props.disabled === true;
  }).map(function (entry) {
    return component.name + ' / ' + entry.label;
  });
});


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


/********************************************************************
Collect the interactive targets of every cell, for the target-size rule.

@param {Array} cells - readCells result

@return {Array} - [{ id, role, rect }]
*********************************************************************/
function collectTargets (cells) {

  const targets = [];
  for (const cell of cells) {
    for (const child of cell.children) {
      // A hidden seat (a closed variant's control, a sizer) is no
      // target; a drawn-but-unpainted layer still is
      if (!child.hidden && INTERACTIVE_ROLES.includes(child.role)) {
        targets.push({
          id: cell.component + ' / ' + cell.state + ' ' + child.role,
          rect: child.rect
        });
      }
    }
  }

  return targets;

}


/********************************************************************
The shared clause bodies, so the width loop and the rtl pass assert the
same structural rules.
*********************************************************************/

function expectCellBounds (cells) {
  const lines = [];
  for (const cell of cells) {
    const id = cell.component + ' / ' + cell.state;
    if (cell.children.length < 1 || cell.rect.width <= 0 || cell.rect.height <= 0) {
      lines.push(id + ' rendered nothing');
      continue;
    }
    for (const child of cell.children) {
      // Nothing painted cannot overflow: an empty box, a transparent state layer, a hidden sizer
      if ((child.rect.width === 0 && child.rect.height === 0) || child.undrawn) {
        continue;
      }
      // A fixed layer's containing block is the viewport, unless a
      // transformed ancestor inside the cell re-bounds it to the cell;
      // a layer that covers the viewport by design (a scrim) is
      // viewport-bounded either way. A viewport layer of a cell off
      // the screen has no meaningful bound at all
      const covers = child.layerCovers === true;
      const free = child.overlay && (!child.contained || covers);
      const offscreen = cell.rect.x + cell.rect.width <= cell.viewport.x ||
                        cell.rect.y + cell.rect.height <= cell.viewport.y ||
                        cell.rect.x >= cell.viewport.x + cell.viewport.width ||
                        cell.rect.y >= cell.viewport.y + cell.viewport.height;
      if (free && offscreen && !covers) {
        continue;
      }
      const bounds = free ? cell.viewport : cell.rect;
      let painted = free ? child.rect : child.painted;
      // The part of a viewport layer that lies on the screen is what
      // it paints; its overflow past the screen edge clips away
      if (free) {
        const x = Math.max(painted.x, cell.viewport.x);
        const y = Math.max(painted.y, cell.viewport.y);
        painted = {
          x: x, y: y,
          width: Math.max(0, Math.min(painted.x + painted.width, cell.viewport.x + cell.viewport.width) - x),
          height: Math.max(0, Math.min(painted.y + painted.height, cell.viewport.y + cell.viewport.height) - y)
        };
      }
      // Nothing painted after clipping cannot overflow
      if (painted.width === 0 || painted.height === 0) {
        continue;
      }
      if (painted.x < bounds.x - 0.5 || painted.y < bounds.y - 0.5 ||
          painted.x + painted.width > bounds.x + bounds.width + 0.5 ||
          painted.y + painted.height > bounds.y + bounds.height + 0.5) {
        const r1 = function (n) { return Math.round(n * 10) / 10; };
        const r = child.rect, p = child.painted;
        lines.push(id + ' <' + child.tag + '> overflows its cell [' + (child.ident || '') + '] rect=' +
          r1(r.x) + ',' + r1(r.y) + ',' + r1(r.width) + 'x' + r1(r.height) + ' painted=' +
          r1(p.x) + ',' + r1(p.y) + ',' + r1(p.width) + 'x' + r1(p.height));
      }
    }
  }
  return lines;
}

function expectTextInsideBox (texts) {
  const lines = [];
  for (const cell of texts) {
    const id = cell.component + ' / ' + cell.state;
    for (const run of cell.texts) {
      // Text with no painted ancestor has no box to overflow
      if (run.box === null) {
        continue;
      }
      if (run.rect.x < run.box.x - 0.5 || run.rect.y < run.box.y - 0.5 ||
          run.rect.x + run.rect.width > run.box.x + run.box.width + 0.5 ||
          run.rect.y + run.rect.height > run.box.y + run.box.height + 0.5) {
        lines.push(id + ' <' + run.tag + '> "' + run.text + '" overflows its <' + run.box.tag + '> box ' + JSON.stringify(run.box) + ' by ' + JSON.stringify(run.rect));
      }
    }
  }
  return lines;
}

function expectNoClippedText (cells) {
  const lines = [];
  for (const cell of cells) {
    const id = cell.component + ' / ' + cell.state;
    for (const child of cell.children) {
      // A line cut with an ellipsis is a declared truncation, not clipping
      if (child.text && child.overflow === 'hidden' && child.textOverflow !== 'ellipsis' && !child.undrawn &&
          (child.scrollWidth > child.clientWidth || child.scrollHeight > child.clientHeight)) {
        lines.push(id + ' clips text "' + child.text + '"');
      }
      for (const declaration of child.units) {
        if (UNIT.test(declaration)) {
          lines.push(id + ' inline style carries a unit string: ' + declaration);
        }
      }
    }
  }
  return lines;
}

function expectTargetMin (cells, min) {
  const targets = collectTargets(cells);
  const lines = [];
  // The diameter-min circle centred on each target; WCAG 2.5.8's spacing
  // exception clears an undersized target when no other target's circle
  // intersects it
  const circles = targets.map(function (target) {
    return {
      id: target.id,
      x: target.rect.x + target.rect.width / 2,
      y: target.rect.y + target.rect.height / 2
    };
  });
  for (let i = 0; i < targets.length; i++) {
    const target = targets[i];
    if (target.rect.width >= min && target.rect.height >= min) {
      continue;
    }
    let clear = true;
    for (let j = 0; j < circles.length; j++) {
      if (j === i) {
        continue;
      }
      const dx = circles[i].x - circles[j].x;
      const dy = circles[i].y - circles[j].y;
      if (Math.sqrt(dx * dx + dy * dy) < min - 0.001) {
        clear = false;
        break;
      }
    }
    if (!clear) {
      lines.push(target.id + ' target ' + JSON.stringify(target.rect) + ' below ' + min + ' and crowded by a neighbour');
    }
  }
  return lines;
}


for (const template of TEMPLATE_NAMES) {

  for (const width of WIDTHS) {

    test.describe('structural: ' + template + ' @ ' + width, function () {

      let opened;
      let cells;
      let texts;
      let runs;
      let paints;

      test.beforeAll(async function ({ browser }) {
        const page = await browser.newPage();
        await page.setViewportSize({ height: 720, width: width });
        opened = await openShowcase(page, template);
        cells = await readCells(page);
        texts = await readTextBoxes(page);
        runs = await readTextContrast(page, DISABLED_CELLS);
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
        expect(expectCellBounds(cells)).toEqual([]);
      });

      test('no text overflows the box that paints behind it', function () {
        expect(expectTextInsideBox(texts)).toEqual([]);
      });

      test('no clipped text and no unit string in an inline style', function () {
        expect(expectNoClippedText(cells)).toEqual([]);
      });

      test('every interactive target meets its form-class minimum on both axes or clears it by spacing', function () {
        const min = opened.theme['control.target_min'];
        expect(min, 'control.target_min is in the built theme').toBeGreaterThan(0);
        expect(expectTargetMin(cells, min)).toEqual([]);
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
          const detail = ' rect=' + Math.round(run.rect.x * 10) / 10 + ',' + Math.round(run.rect.y * 10) / 10 + ' @' + run.point.x + ',' + run.point.y + ' stack=[' + (run.stack || []).join(' | ') + ']';
          expect(run.ratio, id + ' contrast ' + run.ratio + ':1 (' + run.color + ') below ' + minimum + ':1' + detail).toBeGreaterThanOrEqual(minimum);
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
            expect(cell.paint, cell.component + ' / ' + cell.state + ' paints exactly like disabled state "' + other.state + '" - enabled [' + cell.paint + '] vs disabled [' + other.paint + ']').not.toBe(other.paint);
          }
        }
      });

    });

  }

}

test.describe('structural: adaptive passes', function () {

  test('a text scale of 2 clips and overflows no text at the compact width', async function ({ browser }) {
    const page = await browser.newPage();
    await page.setViewportSize({ height: 720, width: 375 });
    for (const template of TEMPLATE_NAMES) {
      const opened = await openShowcase(page, template, undefined, { textScale: 2 });
      expect(opened.status.errors, template + ' errors').toEqual([]);
      expect(opened.pageErrors, template + ' page errors').toEqual([]);
      const cells = await readCells(page);
      const texts = await readTextBoxes(page);
      expect(expectNoClippedText(cells), template).toEqual([]);
      expect(expectTextInsideBox(texts), template).toEqual([]);
    }
    await page.close();
  });

  test('adaptive fixed at a compact width builds the expanded token map', async function ({ browser }) {
    const page = await browser.newPage();
    for (const template of TEMPLATE_NAMES) {
      await page.setViewportSize({ height: 720, width: 375 });
      const fixed = await openShowcase(page, template, undefined, { adaptive: 'fixed' });
      const auto = await openShowcase(page, template);
      await page.setViewportSize({ height: 720, width: 1280 });
      const expanded = await openShowcase(page, template);
      expect(fixed.theme, template + ': adaptive fixed ignores the width form class').toEqual(expanded.theme);
      // The counterpart: at the compact width the auto build must differ
      // where the template carries form variants - otherwise the harness is
      // not applying the class at all
      expect(auto.theme, template + ': the compact build moves tokens off the expanded map').not.toEqual(expanded.theme);
    }
    await page.close();
  });

  test('every structural clause holds under rtl at the expanded width', async function ({ browser }) {
    const page = await browser.newPage();
    await page.setViewportSize({ height: 720, width: 1280 });
    for (const template of TEMPLATE_NAMES) {
      const opened = await openShowcase(page, template, undefined, { dir: 'rtl' });
      expect(opened.status.errors, template + ' errors').toEqual([]);
      expect(opened.pageErrors, template + ' page errors').toEqual([]);
      expect(opened.consoleErrors, template + ' console errors').toEqual([]);
      const cells = await readCells(page);
      const texts = await readTextBoxes(page);
      expect(expectCellBounds(cells), template + ' bounds').toEqual([]);
      expect(expectTextInsideBox(texts), template + ' text overflow').toEqual([]);
      expect(expectNoClippedText(cells), template + ' clipped text').toEqual([]);
      expect(expectTargetMin(cells, opened.theme['control.target_min']), template + ' targets').toEqual([]);
    }
    await page.close();
  });

});

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
