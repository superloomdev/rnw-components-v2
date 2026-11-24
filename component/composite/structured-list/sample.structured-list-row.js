// Info: StructuredListRow sample states for the showcase, the browser
// gates and the docs. `requires_parent`: it mounts in a list's body.
// Mirrors `recipes/probe/StructuredListRow.mount.js`: a plain row, and the
// first row of a selection list at rest (hover and focus are the
// reference's targets), selected, and in the radio form unchecked and
// checked. The reference mounts the whole upstream list.

import { ROWS, SELECTION_ROWS } from './sample.structured-list-wrapper.js';

export const FRAME = Object.freeze({ width: 800 });

const ROW = SELECTION_ROWS[0];


/********************************************************************
One frozen state: a row in the body of a list with these props.

@param {String} label - The state's label
@param {Object} row   - The row `{ id, cells }`
@param {Object} list  - The list's other props

@return {Object} - The state
*********************************************************************/
function state (label, row, list) {

  return Object.freeze({
    label: label,
    props: Object.freeze({ cells: row.cells, id: row.id }),
    referenceProps: Object.freeze({ list: Object.freeze(Object.assign({ rows: Object.freeze([row]) }, list)) }),
    wrappers: Object.freeze([
      Object.freeze({ component: 'StructuredListWrapper', props: Object.freeze(list), reference: false }),
      Object.freeze({ component: 'StructuredListBody', props: Object.freeze({}), reference: false })
    ])
  });

}

export default Object.freeze([
  state('default', ROWS[0], {}),
  state('selection', ROW, { selection: true }),
  state('selected', ROW, { selectedInitialRow: 'row-0', selection: true }),
  state('radio', ROW, { marker: 'radio', selection: true }),
  state('radioSelected', ROW, { marker: 'radio', selectedInitialRow: 'row-0', selection: true })
]);
