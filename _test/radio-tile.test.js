// Info: RadioTile molecule. The face selects its own value: `radio` with
// `aria-checked`, the corner mark shows only while checked and the border
// draws the selected cells. A group injects checked/onChange/focusable.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/tile/sample.radio-tile.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { act } from 'react';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);


/********************************************************************
Render one RadioTile and return its root.

@param {Object} Registry - Registry
@param {Object} props    - RadioTile props

@return {Promise<HTMLElement>} - The root element
*********************************************************************/
async function renderRadioTile (Registry, props) {

  const container = await render(React.createElement(Registry.RadioTile, props));
  return container.firstElementChild;

}


describe('RadioTile: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    const tokens = buildNative(template).tokens;
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': box, mark and border come from the theme', async function () {
        const Registry = buildSystem(template, factories);
        const root = await renderRadioTile(Registry, state.props);
        const checked = state.props.checked === true;
        assert.equal(root.getAttribute('aria-checked'), String(checked));
        assert.equal(root.style.borderTopWidth, '1px');
        if (checked) {
          assert.equal(root.style.borderTopColor, cssValue('borderTopColor', tokens['color.tile_border_selected']));
        }
        const mark = root.querySelector('svg');
        assert.ok(mark !== null, 'the mark seat stays mounted');
      });
    }
  }

});


describe('RadioTile: press behavior', function () {

  test('press selects the radio', async function () {
    const Registry = buildSystem('carbon', factories);
    const root = await renderRadioTile(Registry, { children: 'Tile content', value: 'one' });
    assert.equal(root.getAttribute('aria-checked'), 'false');
    await act(async function () { root.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
    assert.equal(root.getAttribute('aria-checked'), 'true');
  });

});
