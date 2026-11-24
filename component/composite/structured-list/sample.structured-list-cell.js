// Info: StructuredListCell sample states for the showcase, the browser
// gates and the docs. `requires_parent`: it mounts in a row of a list.
// Mirrors `recipes/probe/StructuredListCell.mount.js`: a body cell plain,
// condensed, flush and in a selection list, and a head cell. The reference
// mounts the whole upstream list: a one-cell table, as wide as the body.

export const FRAME = Object.freeze({ width: 800 });


/********************************************************************
One frozen state: a cell alone in a row of a list with these props.

@param {String}  label - The state's label
@param {String}  text  - The cell's text
@param {Object}  list  - The list's other props
@param {Boolean} head  - A head cell

@return {Object} - The state
*********************************************************************/
function state (label, text, list, head) {

  const reference = head === true ? { columns: Object.freeze([text]) } : { rows: Object.freeze([Object.freeze({ id: 'row-0', cells: Object.freeze([text]) })]) };
  return Object.freeze({
    label: label,
    props: Object.freeze(head === true ? { children: text, head: true } : { children: text }),
    referenceProps: Object.freeze({ list: Object.freeze(Object.assign(reference, list)) }),
    wrappers: Object.freeze([
      Object.freeze({ component: 'StructuredListWrapper', props: Object.freeze(list), reference: false }),
      Object.freeze({ component: head === true ? 'StructuredListHead' : 'StructuredListBody', props: Object.freeze({}), reference: false }),
      Object.freeze({ component: 'StructuredListRow', props: Object.freeze(head === true ? { head: true } : { id: 'row-0' }), reference: false })
    ])
  });

}

export default Object.freeze([
  state('default', 'Online', {}),
  state('condensed', 'Online', { isCondensed: true }),
  state('flush', 'Online', { isFlush: true }),
  state('selection', 'Frankfurt', { selection: true }),
  state('head', 'Status', {}, true)
]);
