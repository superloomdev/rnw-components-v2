// Info: StructuredListWrapper composite. A table of rows
// (`structured-list/_structured-list.scss:31-38`): as wide as its container,
// its columns sized from every row's cells by the browser's automatic table
// layout (`structured-list-layout.js`). It draws a head from `columns` and a
// body from `rows`, then its children (a StructuredListHead, a
// StructuredListBody). With `selection` a body row is pressed to select it
// (one at a time, `selectedInitialRow` first): `marker` 'check' draws each
// row's hidden radio and a trailing checkmark in
// `control.structured_list_marker_column`, 'radio' a leading radio glyph
// column. `isFlush` acts only without `selection` (upstream's
// `isFlush && !selection`).

import SPEC from './spec.structured-list-wrapper.js';
import { createTableContext } from './structured-list-context.js';
import { distributeColumns } from './structured-list-layout.js';


/********************************************************************
StructuredListWrapper factory.

@param {Object} ctx - Component context

@return {Function} - The StructuredListWrapper component
*********************************************************************/
export default function StructuredListWrapper (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;
  const { focusNode } = ctx.behaviors;
  const TableContext = createTableContext(ctx);
  const MARKERS = Object.freeze(['check', 'radio']);


  /********************************************************************
  StructuredListWrapper component.

  @param {Object} props - See `api.structured-list-wrapper.js`

  @return {Object} - React element
  *********************************************************************/
  function StructuredListWrapperComponent (props) {

    // Init the list's form
    const selection = props.selection === true;
    const marker = selection ? (Utils.inArray(MARKERS, props.marker) ? props.marker : 'check') : null;
    const [selected, setSelected] = React.useState(Utils.isString(props.selectedInitialRow) ? props.selectedInitialRow : null);
    const [hovered, setHovered] = React.useState(null);
    const [width, setWidth] = React.useState(null);
    const [measures, setMeasures] = React.useState({});
    const order = React.useRef([]);
    const inputs = React.useRef({});
    const onSelect = props.onSelect;

    // Select a row; a step moves to the next or previous row and focuses it
    const select = React.useCallback(function (id) {
      setSelected(id);
      if (typeof onSelect === 'function') {
        onSelect(id);
      }
    }, [onSelect]);
    const step = React.useCallback(function (id, delta) {
      const ids = order.current;
      if (Utils.isEmptyArray(ids)) {
        return;
      }
      const at = ids.indexOf(id);
      const next = ids[((at === -1 ? 0 : at + delta) % ids.length + ids.length) % ids.length];
      select(next);
      focusNode(inputs.current[next]);
    }, [select]);

    // A cell hands in its column's min-content and max-content widths
    const report = React.useCallback(function (key, entry) {
      setMeasures(function (previous) {
        const before = previous[key];
        if (entry === null) {
          if (before === undefined) {
            return previous;
          }
          const next = Object.assign({}, previous);
          delete next[key];
          return next;
        }
        if (before !== undefined && before.column === entry.column && before.min === entry.min && before.max === entry.max) {
          return previous;
        }
        return Object.assign({}, previous, { [key]: entry });
      });
    }, []);

    // The columns: the widest cell of each; a marker column is fixed at its
    // width where a body row draws its glyph, and a head-only radio column
    // is the empty head cell's paddings, an automatic column
    const markerWidth = ctx.metric('StructuredListWrapper', 'markerColumn');
    const entries = Object.keys(measures).map(function (key) {
      return measures[key];
    });
    const dataColumns = entries.reduce(function (count, entry) {
      return Utils.isNumber(entry.column) ? Math.max(count, entry.column + 1) : count;
    }, 0);
    const offset = marker === 'radio' ? 1 : 0;
    const markerColumn = function (name) {
      const cells = entries.filter(function (entry) {
        return entry.column === name;
      });
      const fixed = cells.some(function (entry) {
        return entry.fixed === true;
      });
      const width = cells.reduce(function (widest, entry) {
        return Math.max(widest, entry.max);
      }, 0);
      return fixed ? { fixed: markerWidth, max: markerWidth, min: Math.max(markerWidth, width) } : { fixed: null, max: width, min: width };
    };
    const columns = [];
    for (let index = 0; index < dataColumns; index = index + 1) {
      columns.push({ fixed: null, max: 0, min: 0 });
    }
    for (const entry of entries) {
      if (Utils.isNumber(entry.column)) {
        const column = columns[entry.column];
        column.min = Math.max(column.min, entry.min);
        column.max = Math.max(column.max, entry.max);
      }
    }
    if (marker === 'radio') {
      columns.unshift(markerColumn('radio'));
    }
    if (marker === 'check') {
      columns.push(markerColumn('check'));
    }
    const widths = width === null || dataColumns === 0 ? null : distributeColumns(columns, width);

    // The context every member reads
    const table = {
      condensed: props.isCondensed === true,
      flush: props.isFlush === true && !selection,
      hovered: hovered,
      inputs: inputs.current,
      marker: marker,
      offset: offset,
      order: order,
      report: report,
      select: select,
      selected: selected,
      selection: selection,
      setHovered: setHovered,
      step: step,
      widthOf: function (column) {
        const at = column === 'check' ? columns.length - 1 : column;
        return widths === null || widths[at] === undefined ? null : widths[at];
      }
    };

    // Measure the table's width: the columns share it
    const onLayout = function (event) {
      const next = event.nativeEvent.layout.width;
      if (next !== width) {
        setWidth(next);
      }
    };

    // Build the head and body from data, then the children
    const head = Utils.isArray(props.columns) ? React.createElement(ctx.Registry.StructuredListHead, { columns: props.columns, key: 'head' }) : null;
    const body = Utils.isArray(props.rows) ? React.createElement(ctx.Registry.StructuredListBody, { key: 'body', rows: props.rows }) : null;
    return React.createElement(TableContext.Provider, { value: table },
      React.createElement(View, {
        'aria-label': Utils.isString(props.accessibilityLabel) ? props.accessibilityLabel : undefined,
        dataSet: { part: 'root' },
        onLayout: onLayout,
        role: 'table',
        testID: props.testID,
        style: { width: '100%' }
      }, head, body, props.children));

  }

  StructuredListWrapperComponent.displayName = 'StructuredListWrapper';
  return StructuredListWrapperComponent;

}

StructuredListWrapper.spec = SPEC;
