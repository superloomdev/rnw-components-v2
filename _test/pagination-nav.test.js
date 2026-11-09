// Info: PaginationNav molecule. The row of page buttons with overflow
// pickers; the active page carries aria-current="page" and the direction
// buttons page.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/pagination/sample.pagination-nav.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);

describe('PaginationNav: every sample state under every template', function () {
  for (const template of TEMPLATE_NAMES) {
    const tokens = buildNative(template).tokens;
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the active page carries aria-current', async function () {
        const Registry = buildSystem(template, factories);
        const container = await render(React.createElement(Registry.PaginationNav, state.props));
        const root = container.firstElementChild;
        const wanted = state.props.defaultPage === undefined ? 0 : state.props.defaultPage;
        const active = Array.from(root.querySelectorAll('[aria-current="page"]'));
        assert.equal(active.length, 1);
        assert.equal(active[0].textContent, String(wanted + 1));
      });
    }
  }
});
