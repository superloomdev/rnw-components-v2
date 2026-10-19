// Info: TextAreaSkeleton molecule. Under all three templates it draws an
// optional label placeholder over a box at the theme's text-area height -
// the 100 the source backs - all of it hidden from the accessibility tree.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/text-input/sample.text-area-skeleton.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);


/********************************************************************
Build a registry for a template.

@param {String} template - Template name

@return {Object} - Registry
*********************************************************************/
function registryFor (template) {

  return buildSystem(template, factories, { built: buildNative(template) });

}


describe('TextAreaSkeleton: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': label placeholder over the text-area height', async function () {
        const tokens = buildNative(template).tokens;
        const container = await render(React.createElement(registryFor(template).TextAreaSkeleton, state.props));
        const bars = Array.from(container.querySelectorAll('[aria-hidden="true"]'));
        const hideLabel = state.props.hideLabel === true;
        assert.equal(bars.length, hideLabel ? 1 : 2, 'one bar per placeholder');
        const field = bars[bars.length - 1];
        assert.equal(Number.parseFloat(field.style.height), tokens['control.text_area_skeleton_height']);
        assert.equal(tokens['control.text_area_skeleton_height'], 100, 'the source-backed 100');
        assert.equal(container.querySelector('button'), null);
      });
    }
  }

});
