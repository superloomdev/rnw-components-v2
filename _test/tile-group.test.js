// Info: TileGroup molecule. The legend names the radiogroup, the group
// injects checked/onChange into every tile so one value is selected, and
// `disabled` reaches every tile.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/tile/sample.tile-group.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { act } from 'react';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);
const ITEMS = Object.freeze([
  Object.freeze({ children: 'Option one', value: 'one' }),
  Object.freeze({ children: 'Option two', value: 'two' }),
  Object.freeze({ children: 'Option three', disabled: true, value: 'three' })
]);

afterEach(cleanup);


/********************************************************************
Render one TileGroup and return its parts.

@param {Object} Registry - Registry
@param {Object} props    - TileGroup props

@return {Promise<Object>} - { root, legend, tiles }
*********************************************************************/
async function renderTileGroup (Registry, props) {

  const container = await render(React.createElement(Registry.TileGroup, props));
  const root = container.firstElementChild;

  return {
    root: root,
    legend: root.querySelector('[dir="auto"]'),
    tiles: Array.from(root.querySelectorAll('[role="radio"]'))
  };

}


describe('TileGroup: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    const tokens = buildNative(template).tokens;
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': legend and single selection come from the theme', async function () {
        const Registry = buildSystem(template, factories);
        const { legend, tiles } = await renderTileGroup(Registry, state.props);
        assert.equal(legend.style.color, cssValue('color', tokens['color.field_label']));
        assert.equal(tiles.length, 3);
        assert.equal(tiles.filter(function (t) { return t.getAttribute('aria-checked') === 'true'; }).length, 1);
        assert.equal(tiles[2].getAttribute('aria-disabled'), 'true', tiles[2].outerHTML.slice(0, 300));
      });
    }
  }

});


describe('TileGroup: selection behavior', function () {

  test('one value is checked across the group', async function () {
    const Registry = buildSystem('carbon', factories);
    const { tiles } = await renderTileGroup(Registry, { defaultSelected: 'one', items: ITEMS });
    assert.equal(tiles[0].getAttribute('aria-checked'), 'true');
    await act(async function () { tiles[1].dispatchEvent(new MouseEvent('click', { bubbles: true })); });
    assert.equal(tiles[1].getAttribute('aria-checked'), 'true');
    assert.equal(tiles[0].getAttribute('aria-checked'), 'false');
  });

});
