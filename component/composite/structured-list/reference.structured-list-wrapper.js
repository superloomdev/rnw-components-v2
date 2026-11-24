// Info: StructuredListWrapper measurement reference. Upstream draws a CSS
// table (`structured-list/_structured-list.scss:31-38`) from the same data:
// a head row of head cells, body rows of cells, under selection each row's
// hidden radio and the marker the props name ('check': a trailing cell
// with the checkmark glyph, the Selection story; 'radio': the row's own
// `selection`, a leading radio glyph cell). Its collapsed borders give a
// row's box half of each rule on either side: a row and the root compare
// their whole box, a cell its box but its height (the row's, less the rule
// ours draws above it, 0.98 shorter); the focus ring (upstream's outline,
// ours a layer under the rule) and the closing rule are the perceptual
// gate's (upstream draws it on the last row's box, ours on the body's).
// The members' references mount the same list from `referenceProps.list`.

export const PARTS = Object.freeze({
  root: Object.freeze({ upstream: '.cds--structured-list', ours: '[data-part="root"]', measure: 'box', compare: ['x', 'y', 'width', 'height', 'backgroundColor'] }),
  headRow: Object.freeze({ upstream: '.cds--structured-list-row--header-row', ours: '[data-part="headRow"]', measure: 'box', compare: ['x', 'y', 'width', 'height', 'borderTopWidth'] }),
  headCells: Object.freeze({ upstream: '.cds--structured-list-th', all: true, ours: '[data-part="headCell"]', measure: 'box', compare: ['x', 'y', 'width', 'height', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'] }),
  headLabels: Object.freeze({ upstream: '.cds--structured-list-th:not(:empty)', all: true, ours: '[data-part="headCell"] [data-part="label"]', measure: 'text' }),
  rows: Object.freeze({ upstream: '.cds--structured-list-tbody > .cds--structured-list-row', all: true, ours: '[data-part="rowGroup"] > [data-part="row"]', measure: 'box', compare: ['x', 'y', 'width', 'height', 'backgroundColor', 'borderTopWidth', 'borderTopColor'] }),
  // A cell's height is its row's less the rule above it: upstream's
  // collapsed rule gives each cell half a rule on either side
  cells: Object.freeze({ upstream: '.cds--structured-list-td', all: true, ours: '[data-part="cell"]', measure: 'box', compare: ['x', 'y', 'width', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'], except: ['height'] }),
  labels: Object.freeze({ upstream: '.cds--structured-list-td:not(:has(svg))', all: true, ours: '[data-part="cell"] [data-part="label"]', measure: 'text' }),
  radios: Object.freeze({ upstream: '.cds--structured-list__icon', all: true, optional: true, ours: '[data-part="radio"] svg', measure: 'box', compare: ['x', 'y', 'width', 'height'] }),
  // The checkmark is drawn on the checked row only (`:194-209`)
  checks: Object.freeze({ upstream: '.cds--structured-list-input:checked + .cds--structured-list-td .cds--structured-list-svg', all: true, optional: true, ours: '[data-part="checkOn"] svg', measure: 'box', compare: ['x', 'y', 'width', 'height'] })
});

/********************************************************************
The parts a member's states draw.

@param {Array} names - Part names

@return {Object} - The parts
*********************************************************************/
export function partsOf (names) {

  const picked = {};
  for (const name of names) {
    picked[name] = PARTS[name];
  }
  return Object.freeze(picked);

}

export const TARGETS = Object.freeze([
  Object.freeze({ interactions: Object.freeze(['hover']), name: 'firstRow', ours: '[data-part="rowGroup"] > [data-part="row"]:first-child', states: Object.freeze(['selection', 'selected', 'radio']), upstream: '.cds--structured-list-tbody > .cds--structured-list-row:first-child' }),
  Object.freeze({ interactions: Object.freeze(['hover']), name: 'selectedRow', ours: '[data-part="rowGroup"] > [data-part="row"]:nth-child(3)', states: Object.freeze(['selected']), upstream: '.cds--structured-list-tbody > .cds--structured-list-row:nth-child(3)' }),
  Object.freeze({ interactions: Object.freeze(['focus']), name: 'firstRadio', ours: '[data-part="rowGroup"] > [data-part="row"]:first-child [role="radio"]', states: Object.freeze(['selection', 'radio', 'radioSelected']), upstream: '.cds--structured-list-tbody > .cds--structured-list-row:first-child .cds--structured-list-input' })
]);


/********************************************************************
The upstream list for our props.

@param {Object} React    - React
@param {Object} upstream - The upstream module plus `icon(name)`
@param {Object} props    - { columns, rows, selection, marker,
                           isCondensed, isFlush, selectedInitialRow,
                           accessibilityLabel }

@return {Object} - React element
*********************************************************************/
export function mountList (React, upstream, props) {

  const marker = props.selection === true ? (props.marker === 'radio' ? 'radio' : 'check') : null;
  const radio = marker === 'radio';
  const Check = upstream.icon('checkmark_filled');
  const head = Array.isArray(props.columns) ? React.createElement(upstream.StructuredListHead, { key: 'head' },
    React.createElement(upstream.StructuredListRow, { head: true, selection: radio },
      props.columns.map(function (label, index) {
        return React.createElement(upstream.StructuredListCell, { head: true, key: index }, label);
      }))) : null;
  const body = Array.isArray(props.rows) ? React.createElement(upstream.StructuredListBody, { key: 'body' }, props.rows.map(function (row) {
    const cells = row.cells.map(function (cell, index) {
      const text = typeof cell === 'string' ? cell : cell.text;
      return React.createElement(upstream.StructuredListCell, { key: index, noWrap: typeof cell === 'string' ? undefined : cell.noWrap === true }, text);
    });
    // Each input keeps its own default name: a shared one would join every
    // list on the page into one radio group
    if (marker !== null) {
      cells.push(React.createElement(upstream.StructuredListInput, { key: 'input', id: row.id, value: row.id, title: row.id, 'aria-label': row.id }));
    }
    if (marker === 'check') {
      cells.push(React.createElement(upstream.StructuredListCell, { key: 'check' },
        React.createElement(Check, { className: 'cds--structured-list-svg', 'aria-label': 'select an option' })));
    }
    return React.createElement(upstream.StructuredListRow, { key: row.id, id: row.id, selection: radio }, cells);
  })) : null;
  return React.createElement(upstream.StructuredListWrapper, {
    'aria-label': props.accessibilityLabel,
    isCondensed: props.isCondensed === true,
    isFlush: props.isFlush === true,
    selection: props.selection === true,
    selectedInitialRow: props.selectedInitialRow
  }, head, body);

}

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze([]),
  additionalTargets: TARGETS,
  // Taller than the measurement grid's 160 pitch: the body declares its
  // height so the cell spans its rows
  body: Object.freeze({ width: 800, height: 300, stage: true }),
  mount: mountList,
  parts: PARTS
});
