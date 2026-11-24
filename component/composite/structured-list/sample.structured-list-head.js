// Info: StructuredListHead sample states for the showcase, the browser
// gates and the docs. `requires_parent`: it mounts in a list. Mirrors
// `recipes/probe/StructuredListHead.mount.js`: the head of the plain list,
// condensed (the head row's floor wins), and of a radio list (its empty
// leading head cell). The reference mounts the whole upstream list.

import { COLUMNS, SELECTION_COLUMNS } from './sample.structured-list-wrapper.js';

export const FRAME = Object.freeze({ width: 800 });

const PLAIN = Object.freeze({ columns: COLUMNS });
const RADIO = Object.freeze({ columns: SELECTION_COLUMNS, marker: 'radio', selection: true });


/********************************************************************
One frozen state: the head of a list with these props.

@param {String} label   - The state's label
@param {Object} columns - The head's labels
@param {Object} list    - The list's other props

@return {Object} - The state
*********************************************************************/
function state (label, columns, list) {

  return Object.freeze({
    label: label,
    props: Object.freeze({ columns: columns }),
    referenceProps: Object.freeze({ list: Object.freeze(Object.assign({ columns: columns }, list)) }),
    wrappers: Object.freeze([Object.freeze({ component: 'StructuredListWrapper', props: Object.freeze(list), reference: false })])
  });

}

export default Object.freeze([
  state('default', PLAIN.columns, {}),
  state('condensed', PLAIN.columns, { isCondensed: true }),
  state('radio', RADIO.columns, { marker: 'radio', selection: true })
]);
