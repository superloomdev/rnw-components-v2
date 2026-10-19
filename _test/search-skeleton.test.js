// Info: SearchSkeleton molecule. Every sample state renders under all three
// templates as a single field-height bar drawn from the skeleton color
// roles, hidden from the accessibility tree - the search field has no label,
// so neither does its skeleton.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/search/sample.search-skeleton.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);
const HEIGHTS = { sm: 'size.size_small', md: 'control.field_height', lg: 'size.size_large' };

afterEach(cleanup);


/********************************************************************
Build a registry for a template.

@param {String} template - Template name

@return {Object} - Registry
*********************************************************************/
function registryFor (template) {

  return buildSystem(template, factories, { built: buildNative(template) });

}


describe('SearchSkeleton: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': one field-height bar, no label placeholder', async function () {
        const tokens = buildNative(template).tokens;
        const container = await render(React.createElement(registryFor(template).SearchSkeleton, state.props));
        const bars = Array.from(container.querySelectorAll('[aria-hidden="true"]'));
        assert.equal(bars.length, 1, 'the search field has no label placeholder');
        assert.equal(Number.parseFloat(bars[0].style.height), tokens[HEIGHTS[state.props.size || 'md']]);
        assert.equal(container.querySelector('button'), null);
      });
    }
  }

});
