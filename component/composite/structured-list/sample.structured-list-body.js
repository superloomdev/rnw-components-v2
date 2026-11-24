// Info: StructuredListBody sample states for the showcase, the browser
// gates and the docs. `requires_parent`: it mounts in a list. Mirrors
// `recipes/probe/StructuredListBody.mount.js`: the body of the plain list
// and of a selection list with a middle and with its last row selected
// (the closing rule takes the selected fill). The reference mounts the
// whole upstream list.

import { ROWS, SELECTION_ROWS } from './sample.structured-list-wrapper.js';

export const FRAME = Object.freeze({ width: 800 });


/********************************************************************
One frozen state: the body of a list with these props.

@param {String} label - The state's label
@param {Array}  rows  - The body's rows
@param {Object} list  - The list's other props

@return {Object} - The state
*********************************************************************/
function state (label, rows, list) {

  return Object.freeze({
    label: label,
    props: Object.freeze({ rows: rows }),
    referenceProps: Object.freeze({ list: Object.freeze(Object.assign({ rows: rows }, list)) }),
    wrappers: Object.freeze([Object.freeze({ component: 'StructuredListWrapper', props: Object.freeze(list), reference: false })])
  });

}

export default Object.freeze([
  state('default', ROWS, {}),
  state('selected', SELECTION_ROWS, { selectedInitialRow: 'row-2', selection: true }),
  state('selectedLast', SELECTION_ROWS, { selectedInitialRow: 'row-3', selection: true })
]);
