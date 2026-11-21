// Info: Tile molecule. The container paints the layer cell, the box reads
// the tile's own cells and a text child takes the tile's type set; a plain
// tile carries no role.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/tile/sample.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);


/********************************************************************
Render one Tile and return its root.

@param {Object} Registry - Registry
@param {Object} props    - Tile props

@return {Promise<Object>} - The root element
*********************************************************************/
async function renderTile (Registry, props) {

  const container = await render(React.createElement(Registry.Tile, props));
  return container.firstElementChild;

}


describe('Tile: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    const tokens = buildNative(template).tokens;
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': box and type come from the theme', async function () {
        const Registry = buildSystem(template, factories);
        const root = await renderTile(Registry, state.props);
        assert.equal(root.style.backgroundColor, cssValue('backgroundColor', tokens['color.tile_container']));
        assert.equal(root.style.paddingLeft, '16px');
        assert.equal(root.style.minHeight, '64px');
        assert.equal(root.style.minWidth, '128px');
        const label = root.querySelector('[dir="auto"]');
        assert.equal(label.style.color, cssValue('color', tokens['color.tile_label']));
      });
    }
  }

});
