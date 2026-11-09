// Info: IconTab member. An icon-only tab, square of the list's height,
// named by `label` through the tooltip.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/composite/tabs/sample.icon-tab.js';
import { TEMPLATES, buildSystem } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);

function registryFor (template) {
  return buildSystem(template, factories);
}


describe('IconTab: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': a square icon tab with a name', async function () {
        const container = await render(React.createElement(registryFor(template).IconTab, state.props));
        const tab = container.querySelector('[role="tab"]');
        assert.notEqual(tab, null);
        assert.equal(tab.getAttribute('aria-label'), state.props.label);
      });
    }
  }

});
