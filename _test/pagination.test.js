// Info: Pagination molecule. The bar paints the container cells, the
// select is the Select's inline form, and the forward button ends at the
// last page (unless pagesUnknown).

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/pagination/sample.pagination.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);

async function renderPagination (Registry, props) {
  const container = await render(React.createElement(Registry.Pagination, props));
  return { root: container.firstElementChild, container: container };
}

describe('Pagination: every sample state under every template', function () {
  for (const template of TEMPLATE_NAMES) {
    const tokens = buildNative(template).tokens;
    for (const state of SAMPLE) {
      if (state.label === 'lastPage') {
        test(template + ' / lastPage: the forward button ends at the last page', async function () {
          const Registry = buildSystem(template, factories);
          const { root } = await renderPagination(Registry, state.props);
          const buttons = Array.from(root.querySelectorAll('[role="button"], button'));
          const forward = buttons[buttons.length - 1];
          assert.equal(forward.getAttribute('aria-disabled') === 'true' || forward.disabled === true, true);
        });
      } else {
        test(template + ' / ' + state.label + ': the bar reads its cells', async function () {
          const Registry = buildSystem(template, factories);
          const { root } = await renderPagination(Registry, state.props);
          assert.equal(root.style.backgroundColor, cssValue('backgroundColor', tokens['color.pagination_container']));
          assert.equal(root.style.borderTopColor, cssValue('borderTopColor', tokens['color.pagination_divider']));
          assert.equal(root.style.borderTopWidth, cssValue('borderTopWidth', tokens['control.pagination_divider_width']));
        });
      }
    }
  }
});

describe('Pagination: the blocks follow upstream order', function () {
  // Upstream Pagination.js:221-282: the item count closes the left block;
  // the page range follows the page select in the right block
  test('the left block holds the count, the right block the page range', async function () {
    const Registry = buildSystem('carbon', factories);
    const { root } = await renderPagination(Registry, SAMPLE[0].props);
    const left = root.querySelector('[data-part="left"]');
    const right = root.querySelector('[data-part="right"]');
    assert.notEqual(left.querySelector('[data-part="count"]'), null, 'the count sits in the left block');
    assert.equal(left.querySelector('[data-part="count"]').textContent, '1–10 of 103 items');
    assert.equal(right.querySelector('[data-part="text"]').textContent, 'of 11 pages');
  });
});
