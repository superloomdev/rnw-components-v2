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

import { openShowcase } from './harness/page.js';

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
    const border = opened.theme['color.border_strong_01'];
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
