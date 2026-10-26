// Info: TabsSkeleton member. The placeholder shape of a tab list.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/composite/tabs/sample.tabs-skeleton.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);

function registryFor (template) {
  return buildSystem(template, factories);
}


describe('TabsSkeleton: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': five items of the theme width', async function () {
        const t = buildNative(template).tokens;
        const container = await render(React.createElement(registryFor(template).TabsSkeleton, state.props));
        const items = container.firstElementChild.querySelectorAll(':scope > div');
        assert.equal(items.length, 5);
        assert.equal(items[0].style.width, t['control.tab_skeleton_width'] + 'px');
      });
    }
  }

});
