// Info: StructuredListHead member. Every sample state under every
// template: a row group holding one head row of a head cell per label (and
// the radio form's empty leading one), no rule above it, each label in
// `type.structured_list_head` and `color.structured_list_head_label`, at
// least `control.structured_list_head_height` tall.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import SAMPLE from '../component/composite/structured-list/sample.structured-list-head.js';
import { buildNative } from './harness/system.js';
import { cleanup, cssValue } from './harness/render.js';
import { TEMPLATE_NAMES, registryFor, renderSample } from './header-shared.js';

afterEach(cleanup);

describe('StructuredListHead: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the head comes from the theme', async function () {
        const t = buildNative(template).tokens;
        const radio = state.wrappers[0].props.marker === 'radio';
        const container = await renderSample(registryFor(template), 'StructuredListHead', state);
        const head = container.querySelector('[data-part="head"]');
        assert.equal(head !== null && head.getAttribute('role') === 'rowgroup', true, 'the row group');
        const row = head.querySelector('[data-part="headRow"]');
        assert.equal(row.style.borderTopWidth, '0px');
        const cells = row.querySelectorAll('[data-part="headCell"]');
        assert.equal(cells.length, state.props.columns.length + (radio ? 1 : 0));
        const labels = row.querySelectorAll('[data-part="label"]');
        assert.equal(labels.length, state.props.columns.length, 'a label per column');
        for (let index = 0; index < labels.length; index = index + 1) {
          assert.equal(labels[index].textContent, state.props.columns[index]);
          assert.equal(labels[index].style.color, cssValue('color', t['color.structured_list_head_label']));
        }
        assert.equal(cells[0].style.minHeight, (t['control.structured_list_head_height'] - t['border.width_01'] / 2) + 'px', 'the floor holds half the rule below it');
        assert.equal(cells[0].getAttribute('role'), 'columnheader');
        if (radio) {
          assert.equal(cells[0].querySelector('[data-part="label"]') === null, true, 'the radio column\'s head cell is empty');
          assert.equal(cells[0].style.paddingLeft, t['control.structured_list_padding_start'] + 'px');
          assert.equal(cells[0].style.paddingRight, t['control.structured_list_selection_padding_inline'] + 'px');
        }
      });
    }
  }

});
