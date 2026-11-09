// Info: Tab member. One item of a tab list: label, icon, secondary line,
// selected and disabled states, the indicator seats and, when the list is
// dismissable, the close button; standing alone it draws an unselected
// line tab.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/composite/tabs/sample.tab.js';
import { TEMPLATES, buildSystem } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);

function registryFor (template) {
  return buildSystem(template, factories);
}


describe('Tab: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the tab draws its label and role', async function () {
        const container = await render(React.createElement(registryFor(template).Tab, state.props));
        const tab = container.querySelector('[role="tab"]');
        assert.notEqual(tab, null);
        assert.equal(tab.getAttribute('aria-selected'), 'false');
        assert.equal(tab.getAttribute('aria-disabled'), state.props.disabled === true ? 'true' : null);
        assert.equal(tab.previousElementSibling.textContent.includes(state.props.label), true);
      });
    }
  }

});


describe('Tab: composition', function () {

  test('selected draws the indicator and aria-selected', async function () {
    for (const template of TEMPLATE_NAMES) {
      const container = await render(React.createElement(registryFor(template).Tab, { label: 'Tab', selected: true }));
      const tab = container.querySelector('[role="tab"]');
      assert.equal(tab.getAttribute('aria-selected'), 'true');
    }
  });

});
