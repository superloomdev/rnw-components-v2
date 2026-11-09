// Info: ExpandableTile molecule. The face toggles the fold: collapsed caps
// at the measured above-the-fold height plus the padding allowance, the
// chevron seat rides in the corner and rotates when expanded, and the
// interactive mode gives the toggle to the chevron alone.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/tile/sample.expandable-tile.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { act } from 'react';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);


/********************************************************************
Render one ExpandableTile and return its root.

@param {Object} Registry - Registry
@param {Object} props    - ExpandableTile props

@return {Promise<HTMLElement>} - The root element
*********************************************************************/
async function renderExpandableTile (Registry, props) {

  const container = await render(React.createElement(Registry.ExpandableTile, props));
  return container.firstElementChild;

}


describe('ExpandableTile: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    const tokens = buildNative(template).tokens;
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': fold, chevron and collapsed height come from the theme', async function () {
        const Registry = buildSystem(template, factories);
        const root = await renderExpandableTile(Registry, state.props);
        assert.equal(root.style.backgroundColor, cssValue('backgroundColor', tokens['color.tile_container']));
        assert.equal(root.style.minHeight, '64px');
        const chevron = root.querySelector('svg');
        const seat = root.lastElementChild;
        assert.equal(seat.style.bottom, '0px', 'the seat hangs from the bottom end, as upstream');
        assert.equal(seat.style.top, '');
        const fold = root.children[1];
        assert.equal(fold.style.opacity, state.props.expanded === true ? '1' : '0');
        assert.equal(fold.getAttribute('aria-hidden'), state.props.expanded === true ? null : 'true');
        assert.ok(chevron !== null, 'the chevron is mounted');
        assert.equal(cssValue('fill', chevron.getAttribute('fill')), cssValue('fill', tokens['color.tile_chevron']));
        if (state.props.expanded !== true) {
          assert.equal(root.style.overflowY, 'hidden');
          assert.equal(root.style.maxHeight, String(tokens['control.tile_padding'] * 2) + 'px', 'collapsed height = measured fold + the padding allowance');
        }
      });
    }
  }

});


describe('ExpandableTile: press behavior', function () {

  test('press toggles the expanded state', async function () {
    const Registry = buildSystem('carbon', factories);
    const root = await renderExpandableTile(Registry, { below: 'Below the fold content', children: 'Above the fold content' });
    assert.equal(root.getAttribute('aria-expanded'), 'false');
    await act(async function () { root.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
    assert.equal(root.getAttribute('aria-expanded'), 'true');
  });

});
