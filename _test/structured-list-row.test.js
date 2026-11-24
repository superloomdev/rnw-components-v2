// Info: StructuredListRow member. Every sample state under every template:
// a row of its cells under a `border.width_01` rule; in a selection list
// at least `control.structured_list_row_min_height` tall, its hidden radio
// drawn, selected `color.structured_list_row_container_selected` with its
// cells' labels `color.structured_list_cell_label_selected`, under the
// pointer `color.structured_list_row_container_hover` when not selected;
// in the radio form a leading radio glyph and, while its radio holds focus,
// the `border.width_02` ring in `color.focus` under its rule; in the check
// form no ring.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import SAMPLE from '../component/composite/structured-list/sample.structured-list-row.js';
import { buildNative } from './harness/system.js';
import { cleanup, cssValue } from './harness/render.js';
import { TEMPLATE_NAMES, fire, registryFor, renderSample } from './header-shared.js';

afterEach(cleanup);

describe('StructuredListRow: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the row comes from the theme', async function () {
        const t = buildNative(template).tokens;
        const list = state.wrappers[0].props;
        const selection = list.selection === true;
        const radio = selection && list.marker === 'radio';
        const selected = selection && list.selectedInitialRow === state.props.id;
        const container = await renderSample(registryFor(template), 'StructuredListRow', state);
        const row = container.querySelector('[data-part="rowGroup"] > [data-part="row"]');
        assert.equal(row.getAttribute('role'), 'row');
        assert.equal(row.style.borderTopWidth, t['border.width_01'] + 'px');
        assert.equal(row.style.minHeight, selection ? t['control.structured_list_row_min_height'] + 'px' : '');
        assert.equal(row.querySelectorAll('[role="radio"]').length, selection ? 1 : 0, 'the hidden radio');
        assert.equal(row.querySelector('[data-part="radio"]') !== null, radio, 'the radio glyph');
        assert.equal(row.style.backgroundColor, selected ? cssValue('backgroundColor', t['color.structured_list_row_container_selected']) : 'rgba(0, 0, 0, 0)');
        const label = row.querySelector('[data-part="label"]');
        assert.equal(label.style.color, cssValue('color', t[selected ? 'color.structured_list_cell_label_selected' : 'color.structured_list_cell_label']));
        if (!selection) {
          return;
        }
        await fire(row, new Event('mouseenter', { bubbles: false }));
        assert.equal(row.style.backgroundColor, cssValue('backgroundColor', t[selected ? 'color.structured_list_row_container_selected' : 'color.structured_list_row_container_hover']), 'the hover fill, not over the selected one');
        assert.equal(label.style.color, cssValue('color', t['color.structured_list_cell_label_selected']), 'the hovered label');
        await fire(row, new Event('mouseleave', { bubbles: false }));
        const input = row.querySelector('[role="radio"]');
        await act(async function () {
          input.focus();
        });
        const ring = row.querySelector('[data-part="ring"]');
        assert.equal(ring !== null, radio, 'the ring only in the radio form');
        if (ring !== null) {
          assert.equal(ring.style.borderTopColor, cssValue('borderTopColor', t['color.focus']));
          assert.equal(ring.style.borderTopWidth, t['border.width_02'] + 'px');
          assert.equal(ring.style.position, 'absolute');
          assert.equal(ring.style.top, '0px', 'inside the padding box, under the rule');
          assert.equal(ring.getAttribute('aria-hidden'), 'true');
        }
      });
    }
  }

});
