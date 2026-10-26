// Info: TabListVertical member. The column of tabs inside TabsVertical.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/composite/tabs/sample.tab-list-vertical.js';
import { TEMPLATES, buildSystem } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);

function registryFor (template) {
  return buildSystem(template, factories);
}


describe('TabListVertical: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the column draws its tabs', async function () {
        const container = await render(React.createElement(registryFor(template).TabListVertical, state.props));
        const list = container.querySelector('[role="tablist"]');
        assert.notEqual(list, null);
        const tabs = list.querySelectorAll('[role="tab"]');
        assert.equal(tabs.length, state.props.items.length);
        const selected = state.props.defaultSelectedIndex || 0;
        assert.equal(tabs[selected].getAttribute('aria-selected'), 'true');
      });
    }
  }

});
