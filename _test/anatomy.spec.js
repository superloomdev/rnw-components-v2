// Info: Gate layer 3 - anatomy proofs that only a browser can give. Under
// the template that floats its label over an outline frame, the raised
// label must open a notch in the top border: pixels along the border are
// the surface color where the label sits and the border color beside it.
// Under the template that draws press feedback as a ripple state layer, a
// held press must change the pixels of a button and releasing it must
// change them back. Both are read from screenshots, not from styles, so a
// style that is set but not painted cannot pass.

import { expect, test } from '@playwright/test';
import { PNG } from 'pngjs';

import { discoverComponents } from '../scripts/lib/components.js';
import { runFidelity } from './harness/fidelity.js';
import { enterInteraction, leaveInteraction, openShowcase, readParts } from './harness/page.js';

// The template whose field floats its label over an outline, and whose press is a ripple
const FLOATING_OUTLINE_TEMPLATE = 'material';
const RIPPLE_TEMPLATE = 'material';


/********************************************************************
Read one pixel of a decoded PNG as an `rgb(r, g, b)` string.

@param {Object} png - Decoded PNG
@param {Number} x   - Column
@param {Number} y   - Row

@return {String} - CSS color
*********************************************************************/
function pixel (png, x, y) {

  const i = (Math.floor(y) * png.width + Math.floor(x)) * 4;

  return 'rgb(' + png.data[i] + ', ' + png.data[i + 1] + ', ' + png.data[i + 2] + ')';

}


/********************************************************************
Count the pixels that differ between two PNG buffers of one size.

@param {Buffer} a - PNG
@param {Buffer} b - PNG

@return {Number} - Differing pixels
*********************************************************************/
function differing (a, b) {

  const pa = PNG.sync.read(a);
  const pb = PNG.sync.read(b);
  expect(pa.width).toBe(pb.width);
  expect(pa.height).toBe(pb.height);
  let count = 0;
  for (let i = 0; i < pa.data.length; i += 4) {
    if (pa.data[i] !== pb.data[i] || pa.data[i + 1] !== pb.data[i + 1] || pa.data[i + 2] !== pb.data[i + 2]) {
      count++;
    }
  }

  return count;

}


test.describe('anatomy: floating label notch', function () {

  test('the raised label opens a notch in the outline: surface color under the label, border color beside it', async function ({ page }) {
    const opened = await openShowcase(page, FLOATING_OUTLINE_TEMPLATE, 'TextInput', { measure: true });
    expect(opened.status.errors).toEqual([]);
    expect(opened.theme['anatomy.label']).toBe('floating');
    expect(opened.theme['feedback.field']).toBe('outline');

    // The filled state keeps its label raised without focus
    const body = page.locator('.cell[data-component="TextInput"][data-state="filled"] [data-part="body"]');
    const geometry = await body.evaluate(function (element) {
      const origin = element.getBoundingClientRect();
      const label = element.querySelector(':scope > div > [dir="auto"]:first-child').getBoundingClientRect();
      const frame = element.querySelector('div:has(> input)').getBoundingClientRect();
      return {
        label: { x: label.x - origin.x, width: label.width },
        frame: { x: frame.x - origin.x, y: frame.y - origin.y, width: frame.width }
      };
    });
    const png = PNG.sync.read(await body.screenshot({ scale: 'css', animations: 'disabled' }));

    // Expected colors: the surface the label occludes with, and the frame's border
    const surface = opened.theme['color.background'];
    const border = opened.theme['color.field_outline'];
    const toRgb = function (hex) {
      return 'rgb(' + parseInt(hex.slice(1, 3), 16) + ', ' + parseInt(hex.slice(3, 5), 16) + ', ' + parseInt(hex.slice(5, 7), 16) + ')';
    };

    // Sample the top border row: inside the label's own inline padding (no glyph there),
    // and well beside the label on both sides
    const row = geometry.frame.y + 0.5;
    const underLabel = pixel(png, geometry.label.x + 2, row);
    const besideStart = pixel(png, geometry.frame.x + 6, row);
    const besideEnd = pixel(png, geometry.frame.x + geometry.frame.width - 6, row);
    expect(underLabel, 'the border shows through the raised label').toBe(toRgb(surface));
    expect(besideStart, 'no border before the label').toBe(toRgb(border));
    expect(besideEnd, 'no border after the label').toBe(toRgb(border));
  });

});


test.describe('anatomy: ripple state layer', function () {

  test('a held press paints the state layer over a button and releasing it clears it', async function ({ page }) {
    const opened = await openShowcase(page, RIPPLE_TEMPLATE, 'Button', { measure: true });
    expect(opened.status.errors).toEqual([]);
    expect(opened.theme['feedback.press']).toBe('ripple');

    const body = page.locator('.cell[data-component="Button"][data-state="default"] [data-part="body"]');
    const button = body.locator('[role="button"]');
    const rest = await body.screenshot({ scale: 'css', animations: 'disabled' });

    // Hold the press in the middle of the button, past the state layer's transition
    const box = await button.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.waitForTimeout(400);
    const pressed = await body.screenshot({ scale: 'css', animations: 'disabled' });
    await page.mouse.up();
    await page.mouse.move(0, 0);
    // Releasing leaves focus on the button; the proof is about the press, so focus is dropped too
    await page.evaluate(function () {
      document.activeElement.blur();
    });
    await page.waitForTimeout(400);
    const released = await body.screenshot({ scale: 'css', animations: 'disabled' });

    const changed = differing(rest, pressed);
    expect(changed, 'the pressed state layer painted nothing').toBeGreaterThan(box.width * box.height * 0.5);
    expect(differing(rest, released), 'the state layer did not clear on release').toBeLessThan(changed / 10);
    test.info().annotations.push({ type: 'anatomy', description: 'ripple: ' + changed + ' pixels changed under press' });
  });

});


test.describe('anatomy: declared field-action phases', function () {

  test('the fidelity driver exercises every declared field-action phase', async function ({ page }) {
    test.slow();
    const source = (await discoverComponents()).find(function (entry) {
      return entry.name === 'PasswordInput';
    });
    expect(source).toBeTruthy();
    const component = Object.assign({}, source, {
      sample: source.sample.filter(function (entry) {
        return entry.label === 'default';
      })
    });
    const run = await runFidelity(page, component, 'primary', 'light');
    expect(run.errors).toEqual([]);
    // A fixed contract, not the descriptor's own additionalTargets list: a
    // driver that drops that list must fail this test rather than shrink it
    for (const side of ['ours', 'upstream']) {
      for (const phase of ['hover', 'focus', 'pressed']) {
        expect(run[side]['default @toggle ' + phase], side + ' is missing default @toggle ' + phase).toBeTruthy();
      }
    }
    // The toggle's tooltip opens beside the field-high action slot, never
    // across the face: on either side the painted face and the bubble share
    // not one pixel
    for (const side of ['ours', 'upstream']) {
      const parts = run[side]['default @toggle hover'];
      const face = parts.toggleFace;
      const bubble = parts.bubble;
      expect(face !== null && face.visible === true, side + ' toggleFace is not visible at default @toggle hover').toBe(true);
      expect(bubble !== null && bubble !== undefined && bubble.visible === true, side + ' bubble is not visible at default @toggle hover').toBe(true);
      const overlapX = Math.max(0, Math.min(face.x + face.width, bubble.x + bubble.width) - Math.max(face.x, bubble.x));
      const overlapY = Math.max(0, Math.min(face.y + face.height, bubble.y + bubble.height) - Math.max(face.y, bubble.y));
      expect(overlapX * overlapY, side + ' toggleFace and bubble overlap').toBe(0);
    }
  });

});


test.describe('anatomy: declared shadow-target phases', function () {

  test('the fidelity driver exercises declared shadow-target phases', async function ({ page }) {
    test.slow();
    const source = (await discoverComponents()).find(function (entry) {
      return entry.name === 'OperationalTag';
    });
    expect(source).toBeTruthy();
    const component = Object.assign({}, source, {
      sample: source.sample.filter(function (entry) {
        return entry.label === 'default';
      })
    });
    // The second system's chip button lives inside a shadow root: a driver
    // that resolves it to nothing must fail, never silently skip
    const run = await runFidelity(page, component, 'second', 'light');
    expect(run.errors).toEqual([]);
    for (const side of ['ours', 'upstream']) {
      for (const phase of ['hover', 'focus', 'pressed']) {
        expect(run[side]['default @' + phase], side + ' is missing default @' + phase).toBeTruthy();
      }
    }
  });

});


test.describe('anatomy: part visibility', function () {

  test('the part reader rejects zero-area and transparent-ancestor seats but keeps hairlines', async function ({ page }) {
    await page.setContent(
      '<div class="cell" data-component="VisibilityProbe" data-state="default"><div data-part="body">' +
      '<input id="zero" style="width:0;height:40px;border:0;padding:0">' +
      '<div id="hairline" style="width:1px;height:16px"></div>' +
      '<div id="clipped" style="width:1px;height:1px;overflow:hidden"></div>' +
      '<div style="opacity:0"><div id="faded" style="width:10px;height:10px"></div></div>' +
      '<div id="padded" style="padding:3px 5px 7px 11px">Padding</div>' +
      '</div></div>'
    );
    const parts = {
      zero: { ours: '#zero', measure: 'box' },
      hairline: { ours: '#hairline', measure: 'box' },
      clipped: { ours: '#clipped', measure: 'box' },
      faded: { ours: '#faded', measure: 'box' },
      padded: { ours: '#padded', measure: 'box', compare: ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'] }
    };
    for (const extended of [false, true]) {
      const read = await readParts(page, 'VisibilityProbe', parts, 'ours', null, { extended: extended });
      const state = read.default;
      expect(state.zero.visible, 'zero area is not drawn (extended=' + extended + ')').toBe(false);
      expect(state.hairline.visible, 'a real hairline is drawn (extended=' + extended + ')').toBe(true);
      expect(state.clipped.visible, 'a 1x1 clip is not drawn (extended=' + extended + ')').toBe(false);
      expect(state.faded.visible, 'a transparent ancestor is not drawn (extended=' + extended + ')').toBe(false);
      expect([state.padded.paddingTop, state.padded.paddingRight, state.padded.paddingBottom, state.padded.paddingLeft]).toEqual(['3px', '5px', '7px', '11px']);
    }
  });

});


test('keyboard focus collapses numeric selection without changing its value', async function ({ page }) {
  await page.setContent(
    '<div class="cell" data-component="FocusProbe" data-state="default"><div data-part="body">' +
    '<input type="number" value="2"></div></div>'
  );
  await page.evaluate(function () {
    window.focusKeys = [];
    document.querySelector('input').addEventListener('keydown', function (event) {
      window.focusKeys.push(event.key);
    });
  });
  expect(await enterInteraction(page, 'FocusProbe', 'default', 'input', 'focus')).toBe(true);
  expect(await page.locator('input').inputValue()).toBe('2');
  expect(await page.evaluate(function () { return window.focusKeys; })).toEqual(['ArrowRight']);
  await leaveInteraction(page);
});


test('intrinsically sized selections retain complete labels after fonts load', async function ({ page }) {
  test.slow();
  for (const template of ['default', 'carbon', 'material']) {
    for (const scheme of ['light', 'dark']) {
      for (const component of ['TimePicker', 'TimePickerSelect']) {
        await openShowcase(page, template, component, { measure: true, sheet: true, scheme: scheme, hosted: false });
        const read = async function () {
          return page.evaluate(function (name) {
            const rows = [];
            for (const cell of document.querySelectorAll('.cell[data-component="' + name + '"]')) {
              for (const trigger of cell.querySelectorAll('[role="combobox"]')) {
                const label = trigger.querySelector('[dir="auto"]');
                if (label === null || label.textContent === '') {
                  continue;
                }
                const range = document.createRange();
                range.selectNodeContents(label);
                rows.push({
                  state: cell.getAttribute('data-state'),
                  label: label.textContent,
                  textWidth: range.getBoundingClientRect().width,
                  seatWidth: label.getBoundingClientRect().width
                });
              }
            }
            return rows;
          }, component);
        };
        // Wait for the font-induced intrinsic-layout update as well as font loading.
        await expect.poll(async function () {
          return (await read()).filter(function (row) { return row.textWidth > row.seatWidth; });
        }, { message: template + '/' + scheme + '/' + component + ': a complete option label is ellipsized' }).toEqual([]);
        const rows = await read();
        expect(rows.length, 'the sizing assertion must see actual selected labels').toBeGreaterThan(0);
        expect(rows.some(function (row) { return row.label === 'AM'; }), 'the short period label must be exercised').toBe(true);
      }
    }
  }
});
