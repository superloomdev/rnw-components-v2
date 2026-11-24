// Info: StructuredListWrapper composite. Every sample state under every
// template: a table of a head row (`columns`, a leading empty head cell in
// the radio form) and body rows (`rows`); every body row under a
// `border.width_01` rule, the body closing the last; the cells' paddings by
// the list's form (plain, condensed, flush, selection, flush ignored under
// selection); the selected row in `color.structured_list_row_container_selected`,
// its checkmark drawn, every row's radio glyph in the radio form; a press
// selects a row and an arrow key the next. The table layout's shares, from
// the probe's column widths.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import SAMPLE from '../component/composite/structured-list/sample.structured-list-wrapper.js';
import { breakRuns, distributeColumns } from '../component/composite/structured-list/structured-list-layout.js';
import { Lib, buildNative } from './harness/system.js';
import { cleanup, cssValue } from './harness/render.js';
import { TEMPLATE_NAMES, fire, registryFor, renderSample } from './header-shared.js';

afterEach(cleanup);


/********************************************************************
The paddings a cell of this list draws.

@param {Object}  t     - The built theme's tokens
@param {Object}  props - The list's props
@param {Boolean} first - The row's first cell
@param {Boolean} head  - A head cell

@return {Object} - { top, bottom, start, end }
*********************************************************************/
function paddingsOf (t, props, first, head) {

  const condensed = props.isCondensed === true;
  const inline = condensed ? t['control.structured_list_padding_condensed'] : t[props.selection === true ? 'control.structured_list_selection_padding_inline' : 'control.structured_list_padding_inline'];
  const flush = props.isFlush === true && props.selection !== true;
  return {
    bottom: condensed ? t['control.structured_list_padding_condensed'] : t[head ? 'control.structured_list_head_padding_bottom' : 'control.structured_list_cell_padding_bottom'],
    end: flush ? t['control.structured_list_flush_padding_end'] : inline,
    start: flush ? 0 : first ? t['control.structured_list_padding_start'] : inline,
    top: condensed ? t['control.structured_list_padding_condensed'] : t[head ? 'control.structured_list_head_padding_top' : 'control.structured_list_cell_padding_top']
  };

}

describe('StructuredListWrapper: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the table comes from the theme', async function () {
        const t = buildNative(template).tokens;
        const props = state.props;
        const radio = props.selection === true && props.marker === 'radio';
        const check = props.selection === true && !radio;
        const container = await renderSample(registryFor(template), 'StructuredListWrapper', state);
        const table = container.querySelector('[role="table"]');
        assert.equal(table !== null, true, 'the table');
        assert.equal(table.getAttribute('aria-label'), props.accessibilityLabel);
        const headCells = table.querySelectorAll('[data-part="headCell"]');
        assert.equal(headCells.length, props.columns.length + (radio ? 1 : 0), 'a head cell per column, the radio column\'s first');
        const headRow = table.querySelector('[data-part="headRow"]');
        assert.equal(headRow.style.borderTopWidth, '0px', 'the head row draws no rule');
        const rows = table.querySelectorAll('[data-part="rowGroup"] > [data-part="row"]');
        assert.equal(rows.length, props.rows.length, 'a body row per row');
        const body = table.querySelector('[data-part="rowGroup"]');
        assert.equal(body.style.borderBottomWidth, t['border.width_01'] + 'px', 'the closing rule');
        const head = paddingsOf(t, props, !radio, true);
        assert.equal(headCells[radio ? 1 : 0].style.paddingTop, head.top + 'px');
        assert.equal(headCells[radio ? 1 : 0].style.paddingBottom, head.bottom + 'px');
        assert.equal(headCells[headCells.length - 1].style.paddingRight, head.end + 'px');
        assert.equal(headCells[0].style.minHeight, (t['control.structured_list_head_height'] - t['border.width_01'] / 2) + 'px', 'the floor holds half the rule below it');
        for (let index = 0; index < rows.length; index = index + 1) {
          const row = rows[index];
          const id = props.rows[index].id;
          const selected = props.selection === true && props.selectedInitialRow === id;
          assert.equal(row.style.borderTopWidth, t['border.width_01'] + 'px', 'the rule above row ' + index);
          assert.equal(row.style.backgroundColor, selected ? cssValue('backgroundColor', t['color.structured_list_row_container_selected']) : 'rgba(0, 0, 0, 0)', 'the fill of row ' + index);
          const cells = row.querySelectorAll('[data-part="cell"]');
          assert.equal(cells.length, props.rows[index].cells.length + (props.selection === true ? 1 : 0), 'the cells of row ' + index);
          const data = radio ? Array.from(cells).slice(1) : check ? Array.from(cells).slice(0, -1) : Array.from(cells);
          const first = paddingsOf(t, props, !radio, false);
          const later = paddingsOf(t, props, false, false);
          assert.equal(data[0].style.paddingLeft, first.start + 'px', 'row ' + index + ' first cell start');
          assert.equal(data[1].style.paddingLeft, later.start + 'px', 'row ' + index + ' second cell start');
          assert.equal(data[1].style.paddingRight, later.end + 'px', 'row ' + index + ' second cell end');
          assert.equal(data[1].style.paddingTop, later.top + 'px');
          assert.equal(data[1].style.paddingBottom, later.bottom + 'px');
          const label = data[1].querySelector('[data-part="label"]');
          assert.equal(label.style.color, cssValue('color', t[selected ? 'color.structured_list_cell_label_selected' : 'color.structured_list_cell_label']), 'row ' + index + ' label');
          assert.equal(row.querySelectorAll('[role="radio"]').length, props.selection === true ? 1 : 0, 'row ' + index + ' radio');
          const mark = row.querySelector('[data-part="check"], [data-part="checkOn"]');
          assert.equal(mark !== null, check, 'row ' + index + ' checkmark cell');
          if (mark !== null) {
            assert.equal(mark.style.opacity, selected ? '1' : '0', 'row ' + index + ' checkmark drawn when checked');
            assert.equal(cells[cells.length - 1].style.width, t['control.structured_list_marker_column'] + 'px');
          }
          assert.equal(row.querySelector('[data-part="radio"]') !== null, radio, 'row ' + index + ' radio glyph');
        }
      });
    }
  }

  test('a press selects a row; an arrow key selects the next and moves focus there', async function () {
    const state = SAMPLE.find(function (entry) {
      return entry.label === 'radio';
    });
    const container = await renderSample(registryFor('carbon'), 'StructuredListWrapper', state);
    const radios = container.querySelectorAll('[role="radio"]');
    assert.equal(radios[0].getAttribute('aria-checked'), 'false');
    const rows = container.querySelectorAll('[data-part="rowGroup"] > [data-part="row"]');
    await act(async function () {
      rows[0].click();
    });
    assert.equal(radios[0].getAttribute('aria-checked'), 'true', 'the pressed row is selected');
    await fire(radios[0], new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }));
    assert.equal(radios[1].getAttribute('aria-checked'), 'true', 'ArrowDown selects the next row');
    assert.equal(radios[0].getAttribute('aria-checked'), 'false');
    assert.equal(container.ownerDocument.activeElement === radios[1], true, 'focus moves with it');
    await fire(radios[1], new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowUp' }));
    assert.equal(radios[0].getAttribute('aria-checked'), 'true', 'ArrowUp selects the previous row');
  });

});

describe('StructuredListWrapper: the table layout', function () {

  test('room to spare: every column takes its max and the rest by its max, as the probe default', function () {
    const widths = distributeColumns([{ fixed: null, max: 127.922, min: 100 }, { fixed: null, max: 98.625, min: 98.625 }, { fixed: null, max: 399.5, min: 90 }], 800);
    assert.equal(Math.abs(widths[0] - 163.469) < 0.01, true, String(widths[0]));
    assert.equal(Math.abs(widths[1] - 126.031) < 0.01, true, String(widths[1]));
    assert.equal(Math.abs(widths[2] - 510.5) < 0.01, true, String(widths[2]));
  });

  test('a marker column keeps its width; the others take the rest', function () {
    const widths = distributeColumns([{ fixed: null, max: 100, min: 40 }, { fixed: 32, max: 32, min: 32 }], 800);
    assert.equal(widths[0], 768);
    assert.equal(widths[1], 32);
  });

  test('less room: the columns grow from min toward max by the difference', function () {
    const widths = distributeColumns([{ fixed: null, max: 100, min: 50 }, { fixed: null, max: 500, min: 100 }], 400);
    assert.equal(Math.abs(widths[0] - (50 + 250 * 50 / 450)) < 1e-9, true, String(widths[0]));
    assert.equal(Math.abs(widths[1] - (100 + 250 * 400 / 450)) < 1e-9, true, String(widths[1]));
  });

  test('below the mins: every column keeps its min', function () {
    const widths = distributeColumns([{ fixed: null, max: 100, min: 50 }, { fixed: 32, max: 32, min: 32 }], 60);
    assert.equal(widths[0], 50);
    assert.equal(widths[1], 32);
  });

  test('the runs a text breaks into: spaces, and after a dash where the browser breaks', function () {
    assert.equal(breakRuns(Lib.Utils, 'Runs customer-facing services').join('|'), 'Runs|customer-|facing|services');
    assert.equal(breakRuns(Lib.Utils, '22:00 UTC.').join('|'), '22:00|UTC.');
    assert.equal(breakRuns(Lib.Utils, 'COVID-19 at 2020-2024, a -5 and -b').join('|'), 'COVID-|19|at|2020-|2024,|a|-5|and|-|b');
    assert.equal(breakRuns(Lib.Utils, 'pre\u2013post, a \u20135 and a \u2013b').join('|'), 'pre\u2013|post,|a|\u2013|5|and|a|\u2013b');
  });

});
