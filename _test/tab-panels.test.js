// Info: TabPanels member. One mounted panel per tab, the selected one
// drawn and the rest hidden for the id wiring.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/composite/tabs/sample.tab-panels.js';
import { TEMPLATES, buildSystem } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);

function registryFor (template) {
  return buildSystem(template, factories);
}


describe('TabPanels: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': one panel per tab, only the selected drawn', async function () {
        const container = await render(React.createElement(registryFor(template).TabPanels, state.props));
        const panels = container.querySelectorAll('[role="tabpanel"]');
        assert.equal(panels.length, state.props.panels.length);
        const shown = Array.from(panels).filter(function (p) { return p.getAttribute('aria-hidden') !== 'true'; });
        assert.equal(shown.length, 1);
        assert.equal(shown[0].id, 'sample-tabpanel-' + state.props.selectedIndex);
      });
    }
  }

});
