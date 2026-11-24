// Info: StructuredListBody member. Every sample state under every
// template: a row group of a row per `rows` entry, each under its
// `border.width_01` rule, the body closing the last in
// `color.structured_list_border`, or the last row's selected fill when it
// is selected; the row after the selected one takes the selected fill on
// its rule.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import SAMPLE from '../component/composite/structured-list/sample.structured-list-body.js';
import { buildNative } from './harness/system.js';
import { cleanup, cssValue } from './harness/render.js';
import { TEMPLATE_NAMES, registryFor, renderSample } from './header-shared.js';

afterEach(cleanup);

describe('StructuredListBody: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the body comes from the theme', async function () {
        const t = buildNative(template).tokens;
        const list = state.wrappers[0].props;
        const selectedAt = state.props.rows.findIndex(function (row) {
          return list.selection === true && row.id === list.selectedInitialRow;
        });
        const container = await renderSample(registryFor(template), 'StructuredListBody', state);
        const body = container.querySelector('[data-part="rowGroup"]');
        assert.equal(body.getAttribute('role'), 'rowgroup');
        const rows = body.querySelectorAll(':scope > [data-part="row"]');
        assert.equal(rows.length, state.props.rows.length);
        const last = selectedAt === rows.length - 1;
        assert.equal(body.style.borderBottomWidth, t['border.width_01'] + 'px');
        assert.equal(body.style.borderBottomColor, cssValue('borderBottomColor', t[last ? 'color.structured_list_row_container_selected' : 'color.structured_list_border']), 'the closing rule');
        for (let index = 0; index < rows.length; index = index + 1) {
          const selectedRule = selectedAt !== -1 && (index === selectedAt || index === selectedAt + 1);
          assert.equal(rows[index].style.borderTopColor, cssValue('borderTopColor', t[selectedRule ? 'color.structured_list_row_container_selected' : 'color.structured_list_border']), 'the rule above row ' + index);
        }
      });
    }
  }

});
