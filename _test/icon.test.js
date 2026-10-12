// Info: Icon atom. Every semantic name in data/icons.json renders under all
// three templates with a non-empty path, the size picks the set's own glyph
// when one exists, the fill is the named color token, and the accessibility
// answer is image-with-name or hidden.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

import * as factories from 'rnw-components/all';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const ICONS = JSON.parse(readFileSync(join(HERE, '..', 'data', 'icons.json'), 'utf8'));
const NAMES = Object.keys(ICONS.icons);
const TEMPLATE_NAMES = Object.keys(TEMPLATES);

const mounted = [];

afterEach(async function () {
  while (mounted.length > 0) {
    const item = mounted.pop();
    await act(async function () {
      item.root.unmount();
    });
    item.container.remove();
  }
});


/********************************************************************
Render one element into a fresh container and return the container.

@param {Object} element - React element

@return {Promise<HTMLElement>} - The container
*********************************************************************/
async function render (element) {

  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  mounted.push({ container: container, root: root });
  await act(async function () {
    root.render(element);
  });

  return container;

}


describe('Icon: every icon under every template', function () {

  test('data/icons.json names the 84 icons the contract carries', function () {
    assert.equal(NAMES.length, 84);
  });

  for (const template of TEMPLATE_NAMES) {
    test(template + ': all ' + NAMES.length + ' names render an svg with a non-empty path', async function () {
      const Registry = buildSystem(template, { Icon: factories.Icon });
      const container = await render(React.createElement(
        React.Fragment, null,
        NAMES.map(function (name) {
          return React.createElement(Registry.Icon, { key: name, name: name, testID: 'icon-' + name });
        })
      ));
      const svgs = container.querySelectorAll('svg');
      assert.equal(svgs.length, NAMES.length);
      for (const svg of svgs) {
        const paths = svg.querySelectorAll('path');
        assert.ok(paths.length >= 1, svg.getAttribute('data-testid') + ' has a path');
        for (const path of paths) {
          const d = path.getAttribute('d') || '';
          assert.ok(d.length > 0, svg.getAttribute('data-testid') + ' path has a non-empty d');
        }
        assert.match(svg.getAttribute('viewBox') || '', /^-?\d+ -?\d+ \d+ \d+$/);
      }
    });
  }

});


describe('Icon: size, glyph choice, fill', function () {

  test('default size is the size metric and fill is color.icon_primary', async function () {
    const Registry = buildSystem('default', { Icon: factories.Icon });
    const t = buildNative('default').tokens;
    const container = await render(React.createElement(Registry.Icon, { name: 'close' }));
    const svg = container.querySelector('svg');
    assert.equal(svg.getAttribute('width'), String(t['size.icon_02']));
    assert.equal(svg.getAttribute('height'), String(t['size.icon_02']));
    assert.equal(svg.getAttribute('fill'), t['color.icon_primary']);
  });

  test('carbon at 16 uses the set\'s own 16px glyph; at 32 the base glyph', async function () {
    const Registry = buildSystem('carbon', { Icon: factories.Icon });
    // chevron_down is one of the glyphs the set draws on its own small grid
    const literal = buildNative('carbon').tokens['icon.chevron_down'];
    assert.notEqual(literal.sizes['16'].viewBox, literal.viewBox, 'fixture: the 16px grid must differ from the base grid');
    const small = (await render(React.createElement(Registry.Icon, { name: 'chevron_down', size: 16 }))).querySelector('svg');
    assert.equal(small.getAttribute('viewBox'), literal.sizes['16'].viewBox);
    assert.equal(small.querySelector('path').getAttribute('d'), literal.sizes['16'].paths[0].d);
    const large = (await render(React.createElement(Registry.Icon, { name: 'chevron_down', size: 32 }))).querySelector('svg');
    assert.equal(large.getAttribute('viewBox'), literal.viewBox);
    assert.equal(large.querySelector('path').getAttribute('d'), literal.paths[0].d);
  });

  test('a color token leaf changes the fill; an unknown one throws', async function () {
    const Registry = buildSystem('default', { Icon: factories.Icon });
    const t = buildNative('default').tokens;
    const svg = (await render(React.createElement(Registry.Icon, { name: 'close', color: 'icon_disabled' }))).querySelector('svg');
    assert.equal(svg.getAttribute('fill'), t['color.icon_disabled']);
    await assert.rejects(render(React.createElement(Registry.Icon, { name: 'close', color: 'no_such' })), TypeError);
  });

  test('a name the theme lacks throws at render; nothing is substituted', async function () {
    const Registry = buildSystem('default', { Icon: factories.Icon });
    await assert.rejects(render(React.createElement(Registry.Icon, { name: 'no_such_icon' })), /icon\.no_such_icon/);
  });

});


describe('Icon: accessibility', function () {

  test('with a label it is an image with that name', async function () {
    const Registry = buildSystem('default', { Icon: factories.Icon });
    const svg = (await render(React.createElement(Registry.Icon, { name: 'close', accessibilityLabel: 'Close' }))).querySelector('svg');
    assert.equal(svg.getAttribute('role'), 'img');
    assert.equal(svg.getAttribute('aria-label'), 'Close');
    assert.equal(svg.getAttribute('aria-hidden'), null);
  });

  test('without a label it is decorative and hidden', async function () {
    const Registry = buildSystem('default', { Icon: factories.Icon });
    const svg = (await render(React.createElement(Registry.Icon, { name: 'close' }))).querySelector('svg');
    assert.equal(svg.getAttribute('aria-hidden'), 'true');
    assert.equal(svg.getAttribute('aria-label'), null);
  });

  test('the accessibility answer is identical under all three templates', async function () {
    const answers = [];
    for (const template of TEMPLATE_NAMES) {
      const Registry = buildSystem(template, { Icon: factories.Icon });
      const svg = (await render(React.createElement(Registry.Icon, { name: 'close', accessibilityLabel: 'Close' }))).querySelector('svg');
      answers.push([svg.getAttribute('role'), svg.getAttribute('aria-label'), svg.getAttribute('aria-hidden')].join('|'));
    }
    assert.equal(new Set(answers).size, 1, answers.join(' vs '));
  });

});
