// Info: StructuredListSkeleton composite. Every sample state under every
// template: a head of three cells holding a
// `control.structured_list_skeleton_bar_height` bar each, between the head
// paddings; `rowCount` body rows (5 by default), each under its
// `border.width_01` rule in `color.structured_list_border`, the body
// closing the last.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import SAMPLE from '../component/composite/structured-list/sample.structured-list-skeleton.js';
import { buildNative } from './harness/system.js';
import { cleanup, cssValue } from './harness/render.js';
import { TEMPLATE_NAMES, registryFor, renderSample } from './header-shared.js';

afterEach(cleanup);

describe('StructuredListSkeleton: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the skeleton comes from the theme', async function () {
        const t = buildNative(template).tokens;
        const container = await renderSample(registryFor(template), 'StructuredListSkeleton', state);
        const root = container.querySelector('[data-part="root"]');
        assert.equal(root.getAttribute('aria-busy'), 'true');
        const cells = root.querySelectorAll('[data-part="headCell"]');
        assert.equal(cells.length, 3);
        assert.equal(cells[0].style.paddingTop, t['control.structured_list_head_padding_top'] + 'px');
        assert.equal(cells[0].style.paddingLeft, t['control.structured_list_padding_start'] + 'px');
        assert.equal(cells[1].style.paddingLeft, t['control.structured_list_padding_inline'] + 'px');
        assert.equal(cells[0].style.minHeight, t['control.structured_list_head_height'] + 'px');
        assert.equal(cells[0].firstElementChild.style.height, t['control.structured_list_skeleton_bar_height'] + 'px', 'the bar');
        const rows = root.querySelectorAll('[data-part="rowGroup"] > [data-part="row"]');
        assert.equal(rows.length, typeof state.props.rowCount === 'number' ? state.props.rowCount : 5);
        for (const row of rows) {
          assert.equal(row.style.borderTopWidth, t['border.width_01'] + 'px');
          assert.equal(row.style.borderTopColor, cssValue('borderTopColor', t['color.structured_list_border']));
        }
        const body = root.querySelector('[data-part="rowGroup"]');
        assert.equal(body.style.borderBottomWidth, t['border.width_01'] + 'px');
      });
    }
  }

});
