// Info: TextInputSkeleton molecule. Every sample state renders under all
// three templates as appearance-only placeholders: an optional label bar
// over a field-height bar, both drawn from the skeleton color roles, all of
// it hidden from the accessibility tree.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/text-input/sample.text-input-skeleton.js';
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


describe('TextInputSkeleton: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': label placeholder over a field-height bar', async function () {
        const tokens = buildNative(template).tokens;
        const container = await render(React.createElement(registryFor(template).TextInputSkeleton, state.props));
        const bars = Array.from(container.querySelectorAll('[aria-hidden="true"]'));
        const hideLabel = state.props.hideLabel === true;
        assert.equal(bars.length, hideLabel ? 1 : 2, 'one bar per placeholder');
        // The last bar is the field box; it takes the size's height
        const field = bars[bars.length - 1];
        assert.equal(Number.parseFloat(field.style.height), tokens[HEIGHTS[state.props.size || 'md']]);
        // Nothing interactive: a skeleton paints only
        assert.equal(container.querySelector('button'), null);
        assert.equal(container.querySelector('input'), null);
      });
    }
  }

});
