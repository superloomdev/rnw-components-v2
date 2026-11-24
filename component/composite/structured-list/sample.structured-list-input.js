// Info: StructuredListInput sample states for the showcase, the browser
// gates and the docs. `requires_parent`: it mounts in a selection row.
// Mirrors `recipes/probe/StructuredListInput.mount.js`: the radio of an
// unchecked and a checked row (its checkmark drawn), and of a radio row
// (focus is the reference's target). The reference mounts the whole
// upstream list.

import { SELECTION_ROWS } from './sample.structured-list-wrapper.js';

export const FRAME = Object.freeze({ width: 800 });

const ROW = SELECTION_ROWS[0];


/********************************************************************
One frozen state: the radio of a row in a list with these props.

@param {String} label - The state's label
@param {Object} list  - The list's other props

@return {Object} - The state
*********************************************************************/
function state (label, list) {

  return Object.freeze({
    label: label,
    props: Object.freeze({ accessibilityLabel: ROW.id }),
    referenceProps: Object.freeze({ list: Object.freeze(Object.assign({ rows: Object.freeze([ROW]), selection: true }, list)) }),
    wrappers: Object.freeze([
      Object.freeze({ component: 'StructuredListWrapper', props: Object.freeze(Object.assign({ selection: true }, list)), reference: false }),
      Object.freeze({ component: 'StructuredListBody', props: Object.freeze({}), reference: false }),
      Object.freeze({ component: 'StructuredListRow', props: Object.freeze({ cells: ROW.cells, id: ROW.id }), reference: false })
    ])
  });

}

export default Object.freeze([
  state('default', {}),
  state('checked', { selectedInitialRow: 'row-0' }),
  state('radio', { marker: 'radio' })
]);
