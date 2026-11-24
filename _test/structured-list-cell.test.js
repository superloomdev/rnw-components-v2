// Info: StructuredListCell member. Every sample state under every
// template: a body cell's label in `color.structured_list_cell_label`
// between `control.structured_list_cell_padding_top` and
// `control.structured_list_cell_padding_bottom`, its start
// `control.structured_list_padding_start` as the row's first cell, its end
// `control.structured_list_padding_inline` (selection
// `control.structured_list_selection_padding_inline`, condensed
// `control.structured_list_padding_condensed`, flush
// `control.structured_list_flush_padding_end` and no start); a head cell's
// label in `color.structured_list_head_label`; and a hidden copy of the
// text, out of the accessibility tree, that measures its column.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import SAMPLE from '../component/composite/structured-list/sample.structured-list-cell.js';
import { buildNative } from './harness/system.js';
import { cleanup, cssValue } from './harness/render.js';
import { TEMPLATE_NAMES, registryFor, renderSample } from './header-shared.js';

afterEach(cleanup);

describe('StructuredListCell: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the cell comes from the theme', async function () {
        const t = buildNative(template).tokens;
        const list = state.wrappers[0].props;
        const head = state.props.head === true;
        const condensed = list.isCondensed === true;
        const flush = list.isFlush === true;
        const container = await renderSample(registryFor(template), 'StructuredListCell', state);
        const cell = container.querySelector(head ? '[data-part="headCell"]' : '[data-part="cell"]');
        assert.equal(cell.getAttribute('role'), head ? 'columnheader' : 'cell');
        const top = condensed ? t['control.structured_list_padding_condensed'] : t[head ? 'control.structured_list_head_padding_top' : 'control.structured_list_cell_padding_top'];
        const bottom = condensed ? t['control.structured_list_padding_condensed'] : t[head ? 'control.structured_list_head_padding_bottom' : 'control.structured_list_cell_padding_bottom'];
        const inline = condensed ? t['control.structured_list_padding_condensed'] : t[list.selection === true ? 'control.structured_list_selection_padding_inline' : 'control.structured_list_padding_inline'];
        assert.equal(cell.style.paddingTop, top + 'px');
        assert.equal(cell.style.paddingBottom, bottom + 'px');
        assert.equal(cell.style.paddingLeft, (flush ? 0 : t['control.structured_list_padding_start']) + 'px', 'the first cell\'s start');
        assert.equal(cell.style.paddingRight, (flush ? t['control.structured_list_flush_padding_end'] : inline) + 'px');
        const label = cell.querySelector('[data-part="label"]');
        assert.equal(label.textContent, state.props.children);
        assert.equal(label.style.color, cssValue('color', t[head ? 'color.structured_list_head_label' : 'color.structured_list_cell_label']));
        const sizer = cell.querySelector('[aria-hidden="true"]');
        assert.equal(sizer !== null, true, 'the measuring copy');
        assert.equal(sizer.style.opacity, '0');
        assert.equal(sizer.style.position, 'absolute');
        assert.equal(sizer.textContent.indexOf(state.props.children) === 0, true, 'the whole text first');
      });
    }
  }

});
