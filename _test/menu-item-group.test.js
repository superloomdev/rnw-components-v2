// Info: MenuItemGroup member. A `role="group"` naming a run of items for
// assistive technology without drawing a heading of its own.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import { TEMPLATES, buildSystem } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);

describe('MenuItemGroup: the run is a named role="group"', function () {

  for (const template of TEMPLATE_NAMES) {
    test(template + ': role=group with the label, children inside', async function () {
      const container = await render(React.createElement(buildSystem(template, factories).MenuItemGroup, {
        children: React.createElement('div', { 'data-inside': 'yes' }),
        label: 'Edit'
      }));
      const group = container.querySelector('[role="group"]');
      assert.notEqual(group, null, 'the group mounts');
      assert.equal(group.getAttribute('aria-label'), 'Edit', 'the group is named');
      assert.notEqual(group.querySelector('[data-inside="yes"]'), null, 'the children render inside');
      assert.equal(group.style.marginTop, '', 'a group adds no space of its own');
    });
  }

});
