// Info: TabPanel member. The content one tab labels; composed inside
// TabPanels with id/labelledBy/hidden.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/composite/tabs/sample.tab-panel.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);


describe('TabPanel: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the panel draws with its role and padding', async function () {
        const t = registryFor(template);
        const container = await render(React.createElement(t.TabPanel, state.props));
        const panel = container.querySelector('[role="tabpanel"]');
        assert.notEqual(panel, null);
        const tokens = buildNative(template).tokens;
        assert.equal(panel.style.padding, tokens['control.tab_panel_padding'] + 'px', 'the panel padding is the theme cell');
      });
    }
  }

});

describe('TabPanel: a bare string child renders inside a text element', function () {

  test('a string child renders through the registry Text, never as a raw text node', async function () {
    const t = registryFor('carbon');
    const container = await render(React.createElement(t.TabPanel, { children: 'Panel content' }));
    const panel = container.querySelector('[role="tabpanel"]');
    assert.notEqual(panel, null);
    const bare = Array.prototype.filter.call(panel.childNodes, function (node) { return node.nodeType === 3; });
    assert.equal(bare.length, 0, 'a raw string beside the View warns on web and crashes native');
    assert.equal(panel.textContent, 'Panel content');
  });

});

function registryFor (template) {
  return buildSystem(template, factories);
}
