// Info: Accessibility identity across templates. For every component and
// every sample state, the accessibility tree rendered under the default,
// carbon and material templates is identical: roles, aria-* attributes,
// focusability and text. A theme changes appearance only.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import { discoverComponents } from '../scripts/lib/components.js';
import { TEMPLATES, buildSystem } from './harness/system.js';
import { React, a11yTree, cleanup, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);
const components = await discoverComponents();
const registries = {};
for (const name of TEMPLATE_NAMES) {
  registries[name] = buildSystem(name, factories);
}

afterEach(cleanup);


describe('a11y identity: the accessibility tree is the same under every template', function () {

  test('there are components and sample states to compare', function () {
    assert.ok(components.length >= 1);
    assert.equal(TEMPLATE_NAMES.length, 3);
  });

  for (const component of components) {
    for (const state of component.sample) {
      test(component.name + ' / ' + state.label, async function () {
        const trees = {};
        for (const template of TEMPLATE_NAMES) {
          const Component = registries[template][component.name];
          const container = await render(React.createElement(Component, state.props));
          trees[template] = a11yTree(container);
          assert.ok(trees[template].length >= 1, component.name + ' rendered nothing under ' + template);
        }
        for (const template of TEMPLATE_NAMES.slice(1)) {
          assert.deepEqual(trees[template], trees[TEMPLATE_NAMES[0]],
            component.name + ' / ' + state.label + ': accessibility tree differs between ' + TEMPLATE_NAMES[0] + ' and ' + template);
        }
      });
    }
  }

});
