// Info: Contact sheet for the layer-4 review: one PNG per family and scheme
// with the family's cells under the three templates stacked, written to
// test-results/sheet/<Family>.png (light) and <Family>.dark.png (each
// template's dark scheme), plus an index of what was captured.
// Screenshots are evidence for a reviewer; this spec asserts only that
// every family and template produced one.

import { expect, test } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';

import { TEMPLATE_NAMES, openShowcase } from './harness/page.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, 'test-results', 'sheet');


/********************************************************************
Stack PNG buffers vertically onto a white canvas.

@param {Array} buffers - PNG buffers

@return {Buffer} - Combined PNG
*********************************************************************/
function stack (buffers) {

  const images = buffers.map(function (buffer) {
    return PNG.sync.read(buffer);
  });
  const width = Math.max.apply(null, images.map(function (image) {
    return image.width;
  }));
  const height = images.reduce(function (sum, image) {
    return sum + image.height;
  }, 0);
  const out = new PNG({ width: width, height: height });
  out.data.fill(255);
  let y = 0;
  for (const image of images) {
    PNG.bitblt(image, out, 0, 0, image.width, image.height, 0, y);
    y += image.height;
  }

  return PNG.sync.write(out);

}


test('contact sheet: one stacked PNG per family and scheme across the three templates', async function ({ browser }) {

  mkdirSync(OUT, { recursive: true });
  const index = [];

  for (const scheme of ['light', 'dark']) {
    const captured = {};
    for (const template of TEMPLATE_NAMES) {
      const page = await browser.newPage();
      const opened = await openShowcase(page, template, undefined, { scheme: scheme });
      expect(opened.status.errors).toEqual([]);
      const families = page.locator('section.family');
      const count = await families.count();
      expect(count).toBeGreaterThanOrEqual(1);
      for (let i = 0; i < count; i++) {
        const family = await families.nth(i).getAttribute('data-family');
        captured[family] = captured[family] || {};
        captured[family][template] = await families.nth(i).screenshot({ scale: 'css' });
      }
      await page.close();
    }
    for (const family of Object.keys(captured).sort()) {
      const templates = Object.keys(captured[family]);
      expect(templates.sort()).toEqual(TEMPLATE_NAMES.slice().sort());
      const file = family + (scheme === 'dark' ? '.dark' : '') + '.png';
      writeFileSync(join(OUT, file), stack(TEMPLATE_NAMES.map(function (template) {
        return captured[family][template];
      })));
      index.push({ family: family, scheme: scheme, file: file, templates: TEMPLATE_NAMES });
    }
  }
  writeFileSync(join(OUT, 'index.json'), JSON.stringify(index, null, 2) + '\n');
  expect(index.length).toBeGreaterThanOrEqual(2);

});
