// Info: SelectableTile molecule. The face toggles `aria-checked` on press,
// the corner mark swaps its glyph with the state, and the border draws the
// selected cells (transparent otherwise, on all four sides as upstream).

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/tile/sample.selectable-tile.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { act } from 'react';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);


/********************************************************************
Render one SelectableTile and return its parts.

@param {Object} Registry - Registry
@param {Object} props    - SelectableTile props

@return {Promise<Object>} - { root, mark }
*********************************************************************/
async function renderSelectableTile (Registry, props) {

  const container = await render(React.createElement(Registry.SelectableTile, props));
  const root = container.firstElementChild;

  return { root: root, mark: root.querySelector('svg') };

}


describe('SelectableTile: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    const tokens = buildNative(template).tokens;
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': box, mark and border come from the theme', async function () {
        const Registry = buildSystem(template, factories);
        const { root, mark } = await renderSelectableTile(Registry, state.props);
        const selected = state.props.selected === true;
        const disabled = state.props.disabled === true;
        const expectedBorder = selected
          ? tokens[disabled ? 'color.tile_border_selected_disabled' : 'color.tile_border_selected']
          : 'rgba(0, 0, 0, 0)';
        assert.equal(root.style.borderTopColor, cssValue('borderTopColor', expectedBorder));
        assert.equal(root.style.borderTopWidth, '1px');
        assert.equal(root.getAttribute('aria-checked'), String(selected));
        assert.ok(mark !== null, 'the mark stays mounted');
        assert.equal(String(mark.getAttribute('height')), '16');
        assert.equal(cssValue('fill', mark.getAttribute('fill')), cssValue('fill', tokens[disabled ? 'color.tile_mark_disabled' : selected ? 'color.tile_mark_selected' : 'color.tile_mark']));
      });
    }
  }

});


describe('SelectableTile: press behavior', function () {

  test('press toggles the checked state', async function () {
    const Registry = buildSystem('carbon', factories);
    const { root } = await renderSelectableTile(Registry, { children: 'Tile content' });
    assert.equal(root.getAttribute('aria-checked'), 'false');
    await act(async function () { root.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
    assert.equal(root.getAttribute('aria-checked'), 'true');
  });

});
