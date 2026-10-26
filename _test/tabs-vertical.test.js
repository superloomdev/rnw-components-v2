// Info: TabsVertical member. A column of tabs beside their panels, the list
// taking `control.tab_vertical_list_ratio` of the width and scrolling with
// fades when `height` constrains it.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/composite/tabs/sample.tabs-vertical.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);

function registryFor (template) {
  return buildSystem(template, factories);
}


describe('TabsVertical: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the column list and panels draw', async function () {
        const container = await render(React.createElement(registryFor(template).TabsVertical, state.props));
        const list = container.querySelector('[role="tablist"]');
        assert.notEqual(list, null);
        const tabs = list.querySelectorAll('[role="tab"]');
        assert.equal(tabs.length, state.props.items.length);
      });
    }
  }

});


describe('TabsVertical: the list width follows the theme', function () {

  test('the list takes control.tab_vertical_list_ratio of the row', async function () {
    for (const template of TEMPLATE_NAMES) {
      const t = buildNative(template).tokens;
      const container = await render(React.createElement(registryFor(template).TabsVertical, { items: [{ label: 'One' }, { label: 'Two' }] }));
      const listWrap = container.firstElementChild.children[0];
      assert.equal(listWrap.style.width, (t['control.tab_vertical_list_ratio'] * 100) + '%');
    }
  });

});
