// Info: ClickableTile molecule. The whole face takes the press, the hover
// paints the layer's hover cell, the ring is the tile's own cells inside
// the box, and a disabled tile hides its icon and takes no press.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/tile/sample.clickable-tile.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { act } from 'react';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);


/********************************************************************
Render one ClickableTile and return its parts.

@param {Object} Registry - Registry
@param {Object} props    - ClickableTile props

@return {Promise<Object>} - { root, icon }
*********************************************************************/
async function renderClickableTile (Registry, props) {

  const container = await render(React.createElement(Registry.ClickableTile, props));
  const root = container.firstElementChild;

  return { root: root, icon: root.querySelector('svg') };

}


describe('ClickableTile: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    const tokens = buildNative(template).tokens;
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': face, label and icon come from the theme', async function () {
        const Registry = buildSystem(template, factories);
        const { root, icon } = await renderClickableTile(Registry, state.props);
        assert.equal(root.style.backgroundColor, cssValue('backgroundColor', tokens['color.tile_container']));
        if (state.props.disabled === true) {
          assert.equal(root.getAttribute('aria-disabled'), 'true');
          assert.equal(root.getAttribute('href'), null);
        }
        if (state.props.icon) {
          assert.equal(icon === null, state.props.disabled === true);
          if (icon !== null) assert.equal(String(icon.getAttribute('width')), '20');
        }
      });
    }
  }

});


describe('ClickableTile: press behavior', function () {

  test('fires onPress and not when disabled', async function () {
    const Registry = buildSystem('carbon', factories);
    let count = 0;
    const { root } = await renderClickableTile(Registry, { children: 'Tile content', onPress: function () { count += 1; } });
    await act(async function () { root.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
    assert.equal(count, 1);
    const again = await renderClickableTile(Registry, { children: 'Tile content', disabled: true, onPress: function () { count += 1; } });
    await act(async function () { again.root.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
    assert.equal(count, 1);
  });

});
