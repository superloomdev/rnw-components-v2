// Info: DropdownSkeleton composite. Every sample state renders under all
// three templates as an appearance-only placeholder: an optional label bar
// over a field-height bar on a transparent wrapper - the source's skeleton
// class on the wrapper is a marker no compiled rule answers - all of it
// hidden from the accessibility tree.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/composite/select/sample.dropdown-skeleton.js';
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


describe('DropdownSkeleton: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': uses the fixed field height and skeleton label metrics', async function () {
        const tokens = buildNative(template).tokens;
        const container = await render(React.createElement(registryFor(template).DropdownSkeleton, state.props));
        const hideLabel = state.props.hideLabel === true;

        const label = container.querySelector('[data-testid="dropdown-skeleton-label"]');
        if (hideLabel) {
          assert.equal(label, null, 'hideLabel removes only the label bar, ' + template);
        } else {
          assert.notEqual(label, null, 'label bar mounts, ' + template);
          assert.equal(Number.parseFloat(label.style.height), tokens['control.field_skeleton_label_height'], 'label height, ' + template);
          assert.equal(Number.parseFloat(label.style.width), tokens['control.field_skeleton_label_width'], 'label width, ' + template);
          assert.equal(Number.parseFloat(label.parentElement.style.marginBottom), tokens['spacing.spacing_03'], 'label gap, ' + template);
        }

        const field = container.querySelector('[data-testid="dropdown-skeleton-field"]');
        assert.notEqual(field, null, 'field bar remains, ' + template);
        assert.equal(Number.parseFloat(field.style.height), tokens['control.field_height'], 'field height, ' + template);
        assert.equal(field.style.width, '100%', 'field fills the wrapper, ' + template);

        // A skeleton paints only: no roles, no inputs
        assert.equal(container.querySelector('button'), null, template);
        assert.equal(container.querySelector('input'), null, template);
        assert.equal(container.querySelector('[role]'), null, template);
      });

      test(template + ' / ' + state.label + ': keeps the wrapper transparent between its label and field', async function () {
        const tokens = buildNative(template).tokens;
        const container = await render(React.createElement(registryFor(template).DropdownSkeleton, state.props));
        const hideLabel = state.props.hideLabel === true;

        // The source marks the wrapper with its skeleton class but no
        // compiled rule answers it: the rendered upstream wrapper paints
        // nothing, and neither does ours
        const root = container.firstChild;
        const inline = root.style.backgroundColor;
        const computed = getComputedStyle(root).backgroundColor;
        assert.ok(inline === '' || computed === 'rgba(0, 0, 0, 0)',
          'wrapper stays transparent, ' + template + ' (inline: ' + JSON.stringify(inline) + ', computed: ' + computed + ')');

        // No full-cover paint child: the label wrapper and the field bar
        // are the root's only children
        assert.equal(root.children.length, hideLabel ? 1 : 2, 'root children, ' + template);
        const cover = Array.from(root.children).find(function (child) {
          return child.style.position === 'absolute' && child.style.top === '0px' &&
            child.style.right === '0px' && child.style.bottom === '0px' && child.style.left === '0px';
        });
        assert.equal(cover, undefined, 'no absolute full-cover child, ' + template);

        // The label gap and the field keep their own geometry
        const label = container.querySelector('[data-testid="dropdown-skeleton-label"]');
        if (!hideLabel) {
          assert.equal(Number.parseFloat(label.parentElement.style.marginBottom), tokens['spacing.spacing_03'], 'label gap, ' + template);
        }
        const field = container.querySelector('[data-testid="dropdown-skeleton-field"]');
        assert.notEqual(field, null, 'field bar remains, ' + template);
        assert.equal(Number.parseFloat(field.style.height), tokens['control.field_height'], 'field height, ' + template);

        // A skeleton paints only: no roles, no inputs
        assert.equal(container.querySelector('button'), null, template);
        assert.equal(container.querySelector('input'), null, template);
        assert.equal(container.querySelector('[role]'), null, template);
      });
    }
  }

});
