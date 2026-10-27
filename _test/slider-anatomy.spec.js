// Lead-authored browser assertions; copy verbatim to _test/slider-anatomy.spec.js
// only with the renderer handoff. Clipped pseudo boxes do not expose their
// painted width through getBoundingClientRect, so compare their actual pixels.
import { expect, test } from '@playwright/test';
import { PNG } from 'pngjs';

import { enterInteraction, leaveInteraction, openReference, openShowcase, readControlPaint, readParts } from './harness/page.js';

const STATES = ['minimum', 'quarter', 'default', 'maximum', 'disabled'];
const REFERENCES = [
  { set: 'primary', template: 'carbon', selector: '.cds--slider' },
  { set: 'second', template: 'material', selector: 'md-slider' }
];

function cell (page, state) {
  return page.locator('.cell[data-component="Slider"][data-state="' + state + '"] [data-part="body"]').first();
}

async function strip (locator) {
  await locator.scrollIntoViewIfNeeded();
  const original = await locator.evaluate(function (node) {
    const box = node.getBoundingClientRect();
    const saved = { position: node.style.position, left: node.style.left, top: node.style.top };
    const style = getComputedStyle(node);
    // Compare local paint on the same raster origin, not the incidental
    // fractional offset of the surrounding endpoint labels.
    // Relative layout offsets avoid a fractional transform's compositor
    // resampling of already-rasterized circles and shadow edges.
    node.style.position = 'relative';
    node.style.left = ((parseFloat(style.left) || 0) + Math.round(box.x) - box.x) + 'px';
    node.style.top = ((parseFloat(style.top) || 0) + Math.round(box.y) - box.y) + 'px';
    return saved;
  });
  try {
    const box = await locator.boundingBox();
    const edges = await locator.evaluate(function (node) {
      const host = node.getBoundingClientRect();
      const face = node.shadowRoot ? node.shadowRoot.querySelector('.handleNub')
        : node.querySelector('[data-testid="slider-thumb-face"], .cds--slider__thumb');
      if (face === null) {
        throw new Error('Slider track paint requires a measured nub');
      }
      const nub = face.getBoundingClientRect();
      return [Math.floor(nub.left - host.left), Math.ceil(nub.right - host.left) - 1];
    });
    const image = PNG.sync.read(await locator.screenshot({ animations: 'disabled', scale: 'css' }));
    const width = Math.round(box.width);
    const y = Math.floor(image.height / 2);
    expect(image.width).toBeGreaterThanOrEqual(width);
    const pixels = Array.from({ length: width }, function (_, x) {
      const start = (y * image.width + x) * 4;
      return Array.from(image.data.subarray(start, start + 4));
    });
    return { pixels, edges };
  } finally {
    await locator.evaluate(function (node, saved) {
      node.style.position = saved.position;
      node.style.left = saved.left;
      node.style.top = saved.top;
    }, original);
  }
}

function unmatched (source, target, edges) {
  const failures = [];
  for (let x = 0; x < source.length; x = x + 1) {
    // This assertion pins flat paint and overlap alpha, not the nub's
    // one-pixel antialiased boundary. The full fidelity image and ring/
    // shadow profiles still compare those boundary pixels unchanged.
    if (edges.includes(x)) {
      continue;
    }
    const matches = [-1, 0, 1].some(function (offset) {
      const other = target[x + offset];
      return other !== undefined && source[x].every(function (channel, index) {
        return Math.abs(channel - other[index]) <= 3;
      });
    });
    if (!matches) {
      failures.push({ x, pixel: source[x], expected: target[x] });
    }
  }
  return failures;
}

for (const reference of REFERENCES) {
  for (const scheme of ['light', 'dark']) {
    test('Slider painted track / ' + reference.set + ' / ' + scheme +
      ': fill coverage and disabled overlap match the actual source pixels', async function ({ page }) {
      const mounted = await openReference(page, 'Slider', reference.set, scheme);
      expect(mounted.errors).toEqual([]);
      const upstream = {};
      await page.mouse.move(0, 0);
      for (const state of STATES) {
        const host = cell(page, state).locator(reference.selector);
        await expect(host, state + ': source host exists').toHaveCount(1);
        upstream[state] = await strip(host);
      }
      const opened = await openShowcase(page, reference.template, 'Slider',
        { measure: true, hosted: false, scheme });
      expect(opened.status.errors).toEqual([]);
      expect(opened.pageErrors).toEqual([]);
      expect(opened.consoleErrors).toEqual([]);
      await page.mouse.move(0, 0);
      for (const state of STATES) {
        const host = cell(page, state).getByTestId('slider-track');
        await expect(host, state + ': library host exists').toHaveCount(1);
        const ours = await strip(host);
        expect(ours.pixels.length, state + ': measured width').toBe(upstream[state].pixels.length);
        const edges = ours.edges.concat(upstream[state].edges);
        expect(unmatched(ours.pixels, upstream[state].pixels, edges), state + ': extra or wrong paint').toEqual([]);
        expect(unmatched(upstream[state].pixels, ours.pixels, edges), state + ': missing source paint').toEqual([]);
      }
    });
  }
}

test('Slider live web responders: keyboard, track press, drag and invalid numeric draft', async function ({ page }) {
  const opened = await openShowcase(page, 'carbon', 'Slider', { measure: true, hosted: false });
  expect(opened.status.errors).toEqual([]);
  const body = cell(page, 'default');
  const thumb = body.getByRole('slider');
  await expect(thumb).toHaveAttribute('aria-valuenow', '50');
  await thumb.focus();
  await page.keyboard.press('ArrowRight');
  await expect(thumb).toHaveAttribute('aria-valuenow', '51');
  await page.keyboard.press('Home');
  await expect(thumb).toHaveAttribute('aria-valuenow', '0');
  await page.keyboard.press('End');
  await expect(thumb).toHaveAttribute('aria-valuenow', '100');
  const track = body.getByTestId('slider-track');
  await track.scrollIntoViewIfNeeded();
  const box = await track.boundingBox();
  expect(box).not.toBeNull();
  const y = box.y + box.height / 2;
  await page.mouse.move(box.x + box.width / 4, y);
  await page.mouse.down();
  await expect(thumb).toHaveAttribute('aria-valuenow', '25');
  await page.mouse.move(box.x + box.width * 3 / 4, y, { steps: 5 });
  await expect(thumb).toHaveAttribute('aria-valuenow', '75');
  await page.mouse.up();
  const input = body.getByTestId('slider-input');
  await input.fill('-');
  await expect(input).toHaveValue('-');
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  await expect(thumb).toHaveAttribute('aria-valuenow', '75');
  await input.press('Enter');
  await expect(input).toHaveValue('75');
  await expect(thumb).toHaveAttribute('aria-valuenow', '75');
});

test('the part reader applies declared pseudo translations before comparing slider ticks', async function ({ page }) {
  await page.setContent('<style>body{margin:0}.seat{position:relative;width:200px;height:32px}.seat::before{content:"";position:absolute;left:100px;top:5px;width:2px;height:4px;background:black;transform:translateX(-50%)}</style>' +
    '<div class="cell" data-component="Probe" data-state="default"><div data-part="body"><div class="seat"></div></div></div>');
  const parts = { tick: { upstream: '.seat', pseudo: '::before', translate: true, measure: 'box' } };
  const result = await readParts(page, 'Probe', parts, 'upstream');
  expect(result.default.tick.x).toBe(99);
  expect(result.default.tick.y).toBe(5);
  expect(result.default.tick.width).toBe(2);
  expect(result.default.tick.height).toBe(4);
});

test('the part reader compares a uniformly scaled radius in painted coordinates', async function ({ page }) {
  await page.setContent('<style>body{margin:0}.seat{width:40px;height:40px}.face{width:14px;height:14px;border-radius:7px;background:black;transform:scale(2);transform-origin:0 0}</style>' +
    '<div class="cell" data-component="RadiusProbe" data-state="default"><div data-part="body" class="seat"><div class="face"></div></div></div>');
  const parts = { face: { upstream: '.face', measure: 'box', scaleRadius: true } };
  const result = await readParts(page, 'RadiusProbe', parts, 'upstream');
  expect(result.default.face.width).toBe(28);
  expect(result.default.face.height).toBe(28);
  expect(result.default.face.borderTopLeftRadius).toBe('14px');
  await page.locator('.face').evaluate(function (node) {
    Object.assign(node.style, { position: 'absolute', left: '0.12345px', top: '0.45678px', transform: 'scale(1.4286)' });
  });
  const fractional = await readParts(page, 'RadiusProbe', parts, 'upstream');
  expect(Math.abs(parseFloat(fractional.default.face.borderTopLeftRadius) - 7 * 1.4286)).toBeLessThan(0.0000000001);
});

test('the slider point driver reaches a covered input and releases before moving away', async function ({ page }) {
  await page.setContent('<style>body{margin:40px}.seat{position:relative;width:100px;height:40px}.nub{position:absolute;left:40px;top:10px;width:20px;height:20px;background:black}input{position:absolute;inset:0;margin:0;width:100px;height:40px;opacity:0}</style>' +
    '<div class="cell" data-component="PointProbe" data-state="default"><div data-part="body" class="seat"><div class="nub"></div><input type="range" min="0" max="100" value="50"></div></div>' +
    '<script>window.downs=0;document.querySelector("input").addEventListener("pointerdown",function(){window.downs++})</script>');
  expect(await enterInteraction(page, 'PointProbe', 'default', '.nub', 'pressed', { point: true })).toBe(true);
  expect(await page.evaluate(function () { return window.downs; })).toBe(1);
  await leaveInteraction(page, { releaseBeforeMove: true });
  await expect(page.locator('input')).toHaveValue('50');
});

test('structural paint reads a slider face rather than its transparent press target', async function ({ page }) {
  await page.setContent('<div class="cell" data-component="Slider" data-state="enabled"><div data-part="body"><div data-testid="slider-track" style="background:rgb(128, 128, 128)"></div><div data-testid="slider-thumb-face" style="background:black"></div><div role="slider"></div></div></div>' +
    '<div class="cell" data-component="Slider" data-state="disabled"><div data-part="body"><div data-testid="slider-track" style="background:rgb(128, 128, 128)"></div><div style="opacity:0.38"><div data-testid="slider-thumb-face" style="background:black"></div></div><div role="slider" aria-disabled="true"></div></div></div>');
  const result = await readControlPaint(page);
  expect(result).toHaveLength(2);
  expect(result[0].disabled).toBe(false);
  expect(result[1].disabled).toBe(true);
  expect(result[0].paint.startsWith('rgb(0, 0, 0) |')).toBe(true);
  expect(result[0].paint).not.toBe(result[1].paint);
});
