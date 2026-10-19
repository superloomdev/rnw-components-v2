// Info: SelectSkeleton composite. Every sample state renders under all
// three templates as an appearance-only placeholder: an optional label bar
// over a field-height bar, both drawn from the skeleton color roles, all of
// it hidden from the accessibility tree.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/composite/select/sample.select-skeleton.js';
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


describe('SelectSkeleton: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': uses the fixed field height and skeleton label metrics', async function () {
        const tokens = buildNative(template).tokens;
        const container = await render(React.createElement(registryFor(template).SelectSkeleton, state.props));
        const hideLabel = state.props.hideLabel === true;

        const root = container.firstChild;
        assert.equal(root.style.alignSelf, 'stretch', 'root stretches to its container, ' + template);

        const label = container.querySelector('[data-testid="select-skeleton-label"]');
        if (hideLabel) {
          assert.equal(label, null, 'hideLabel removes only the label bar, ' + template);
        } else {
          assert.notEqual(label, null, 'label bar mounts, ' + template);
          assert.equal(Number.parseFloat(label.style.height), tokens['control.field_skeleton_label_height'], 'label height, ' + template);
          assert.equal(Number.parseFloat(label.style.width), tokens['control.field_skeleton_label_width'], 'label width, ' + template);
          assert.equal(Number.parseFloat(label.parentElement.style.marginBottom), tokens['spacing.spacing_03'], 'label gap, ' + template);
        }

        const field = container.querySelector('[data-testid="select-skeleton-field"]');
        assert.notEqual(field, null, 'field bar remains, ' + template);
        assert.equal(Number.parseFloat(field.style.height), tokens['control.field_height'], 'field height, ' + template);
        assert.equal(field.style.width, '100%', 'field fills the wrapper, ' + template);

        // A skeleton paints only: no roles, no inputs
        assert.equal(container.querySelector('button'), null, template);
        assert.equal(container.querySelector('input'), null, template);
        assert.equal(container.querySelector('[role]'), null, template);
      });
    }
  }

});
