// Info: StructuredListCell member. One cell of a row
// (`structured-list/_structured-list.scss:157-187`, `_mixins.scss:25-51`).
// A head cell draws its label in `type.structured_list_head` and
// `color.structured_list_head_label`, `control.structured_list_head_padding_top`
// over `control.structured_list_head_padding_bottom` and at least
// `control.structured_list_head_height` tall; a body cell
// `type.structured_list_cell` in `color.structured_list_cell_label`
// (`color.structured_list_cell_label_selected` in a selected or hovered
// selection row), `control.structured_list_cell_padding_top` over
// `control.structured_list_cell_padding_bottom`. Both are
// `control.structured_list_padding_inline` in from each side
// (`control.structured_list_selection_padding_inline` under selection), the
// row's first `control.structured_list_padding_start` from its start
// (`:47-55`); condensed, `control.structured_list_padding_condensed` all
// round but that start (`:40-45`); flush, nothing at the start and
// `control.structured_list_flush_padding_end` at the end (`:57-69`). Its
// width is its column's: a text cell hands the table its min-content and
// max-content widths through a hidden copy (`structured-list-layout.js`),
// `noWrap` making the two one (`:183-185`). A marker cell, drawn by the
// row, is `control.structured_list_marker_column` wide: 'radio' the radio
// glyph (checked when its row is) at the row's start with no end space
// (`:275-281`), 'check' the checkmark at the end in
// `color.structured_list_check`, drawn only on the checked row
// (`:194-214`); both `control.structured_list_icon_top` below the top
// space. It must be composed inside a StructuredListRow.

import SPEC from './spec.structured-list-cell.js';
import { createCellContext, createRowContext, createTableContext } from './structured-list-context.js';
import { breakRuns } from './structured-list-layout.js';


/********************************************************************
StructuredListCell factory.

@param {Object} ctx - Component context

@return {Function} - The StructuredListCell component
*********************************************************************/
export default function StructuredListCell (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Text, View } = ctx.ReactNative;
  const TableContext = createTableContext(ctx);
  const RowContext = createRowContext(ctx);
  const CellContext = createCellContext(ctx);
  const NO_TABLE = Object.freeze({ condensed: false, flush: false, offset: 0, report: null, selection: false, widthOf: function () {
    return null;
  } });


  /********************************************************************
  StructuredListCell component.

  @param {Object} props - See `api.structured-list-cell.js`

  @return {Object} - React element
  *********************************************************************/
  function StructuredListCellComponent (props) {

    // Init the cell's place and form
    const context = React.useContext(TableContext);
    const table = context === null ? NO_TABLE : context;
    const row = React.useContext(RowContext);
    const place = React.useContext(CellContext);
    const head = props.head === true || row.head === true;
    const marker = props.marker === 'radio' || props.marker === 'check' ? props.marker : null;
    const metric = function (name) {
      return ctx.metric('StructuredListCell', name);
    };

    // The paddings (`_mixins.scss:25-51`, `_structured-list.scss:22-69,210-214,275-281`)
    const condensed = table.condensed === true;
    const top = condensed ? metric('paddingCondensed') : metric(head ? 'headPaddingTop' : 'cellPaddingTop');
    const bottom = condensed ? metric('paddingCondensed') : metric(head ? 'headPaddingBottom' : 'cellPaddingBottom');
    const inline = condensed ? metric('paddingCondensed') : metric(table.selection === true ? 'selectionPaddingInline' : 'paddingInline');
    let start = place.first === true ? metric('paddingStart') : inline;
    let end = inline;
    if (table.flush === true) {
      start = 0;
      end = metric('flushPaddingEnd');
    }
    if (marker === 'radio' && !head) {
      end = 0;
    }
    if (marker === 'check') {
      start = 0;
    }

    // The text and its hidden copy, which measures the column
    const text = Utils.isString(props.children) || Utils.isNumber(props.children) ? String(props.children) : null;
    const type = ctx.textPresentation(ctx.typeStyle(head ? 'structured_list_head' : 'structured_list_cell'));
    const noWrap = props.noWrap === true;
    const [sizes, setSizes] = React.useState({ max: null, min: null });
    const measure = function (which) {
      return function (event) {
        const width = event.nativeEvent.layout.width;
        setSizes(function (previous) {
          return previous[which] === width ? previous : Object.assign({}, previous, { [which]: width });
        });
      };
    };
    const key = React.useId();
    const report = table.report;
    const column = place.column;
    const contentMax = marker !== null ? 0 : text === null ? 0 : sizes.max;
    const contentMin = noWrap || text === null || marker !== null ? contentMax : sizes.min;
    // A marker's glyph cell is its column's fixed width (`:210-214,275-281`);
    // the radio form's empty head cell is only its paddings
    const fixed = marker !== null && !head;
    React.useEffect(function () {
      if (typeof report !== 'function' || contentMax === null || contentMin === null) {
        return undefined;
      }
      report(key, { column: column, fixed: fixed, max: start + end + contentMax, min: start + end + contentMin });
      return function () {
        report(key, null);
      };
    }, [report, key, column, fixed, start, end, contentMax, contentMin]);
    const sizer = text === null || marker !== null ? null : React.createElement(View, {
      'aria-hidden': true,
      key: 'sizer',
      pointerEvents: 'none',
      style: { height: 0, opacity: 0, overflow: 'hidden', position: 'absolute', start: 0, top: 0, width: 0 }
    }, React.createElement(View, { style: { flexDirection: 'row', overflow: 'scroll' } },
      React.createElement(Text, { onLayout: measure('max'), style: [type, { flexShrink: 0 }] }, text),
      noWrap ? null : React.createElement(View, { onLayout: measure('min'), style: { alignItems: 'flex-start', flexShrink: 0 } },
        breakRuns(Utils, text).map(function (run, index) {
          return React.createElement(Text, { key: index, style: type }, run);
        }))));

    // The content: the label, a marker's glyph, or the children
    let content = props.children;
    if (marker === 'radio' && !head) {
      content = React.createElement(View, { dataSet: { part: 'radio' }, key: 'radio', style: { marginTop: metric('iconTop') } },
        React.createElement(ctx.Registry.Icon, { color: row.active ? 'structured_list_cell_label_selected' : 'structured_list_cell_label', name: row.checked ? 'radio_button_checked' : 'radio_button', size: metric('iconSize') }));
    } else if (marker === 'check') {
      content = React.createElement(View, { dataSet: { part: row.checked ? 'checkOn' : 'check' }, key: 'check', style: { marginTop: metric('iconTop'), opacity: row.checked ? 1 : 0 } },
        React.createElement(ctx.Registry.Icon, { color: 'structured_list_check', name: 'checkmark_filled', size: metric('iconSize') }));
    } else if (marker === 'radio') {
      content = null;
    } else if (text !== null) {
      content = React.createElement(Text, {
        dataSet: { part: 'label' },
        dir: 'auto',
        key: 'label',
        style: [type, { color: ctx.color(head ? 'structured_list_head_label' : row.active ? 'structured_list_cell_label_selected' : 'structured_list_cell_label') }]
      }, text);
    }

    // The width: the marker column, or the column the table gave
    // (a glyph cell keeps its marker width until the table has measured)
    const shared = table.widthOf(marker === 'radio' ? 0 : marker === 'check' ? 'check' : table.offset + column);
    const width = shared === null && fixed ? metric('markerColumn') : shared;
    return React.createElement(View, {
      dataSet: { part: head ? 'headCell' : 'cell' },
      role: head ? 'columnheader' : 'cell',
      testID: props.testID,
      style: {
        alignItems: marker === 'check' ? 'flex-end' : 'flex-start',
        flexBasis: width === null ? 'auto' : undefined,
        flexGrow: width === null ? 1 : 0,
        flexShrink: width === null ? 1 : 0,
        minHeight: head ? metric('headHeight') - metric('ruleWidth') / 2 : undefined,
        paddingBottom: bottom,
        paddingEnd: end,
        paddingStart: start,
        paddingTop: top,
        position: 'relative',
        width: width === null ? undefined : width
      }
    }, content, sizer);

  }

  StructuredListCellComponent.displayName = 'StructuredListCell';
  return StructuredListCellComponent;

}

StructuredListCell.spec = SPEC;
