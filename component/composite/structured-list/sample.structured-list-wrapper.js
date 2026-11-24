// Info: StructuredListWrapper sample states for the showcase, the browser
// gates and the docs. Mirrors `recipes/probe/StructuredListWrapper.mount.js`:
// one state per outcome of the list's rules (`notes.md`, the outcomes):
// the plain, condensed and flush paddings; the table's width shared out
// with room to spare and with a column that wraps, a `noWrap` column held
// or not, one column past a cell's max width; selection with its trailing
// checkmark (none, a middle and the last row selected, condensed, flush
// ignored) and with the radio marker (none and one selected, condensed).

export const FRAME = Object.freeze({ width: 800 });

export const COLUMNS = Object.freeze(['Service', 'Status', 'Description']);
export const ROWS = Object.freeze([
  Object.freeze({ id: 'row-0', cells: Object.freeze([Object.freeze({ text: 'API gateway', noWrap: true }), 'Online', 'Routes and secures application traffic across environments.']) }),
  Object.freeze({ id: 'row-1', cells: Object.freeze([Object.freeze({ text: 'Data warehouse', noWrap: true }), 'Maintenance', 'Scheduled maintenance begins Friday at 22:00 UTC.']) })
]);
export const LONG = 'Scheduled maintenance begins Friday at 22:00 UTC; traffic moves to the standby region in Dallas until every health check of the warehouse passes again.';
// The wrapping states' text: at the device walks' rooms (262, 344) every line ends more than 4 short of its
// column and the next word passes it by more than 4, read from the font's advances (`notes.md`)
export const WRAPPED = 'Maintenance work begins Thursday at 22:00 UTC; traffic moves over to the secondary region in London until every health check of the warehouse passes again.';
export const ROWS_LONG = Object.freeze([
  ROWS[0],
  Object.freeze({ id: 'row-1', cells: Object.freeze([Object.freeze({ text: 'Data warehouse', noWrap: true }), 'Maintenance', WRAPPED]) })
]);
export const ROWS_LONG_WRAP = Object.freeze([
  Object.freeze({ id: 'row-0', cells: Object.freeze(['API gateway', 'Online', 'Routes and secures application traffic across environments.']) }),
  Object.freeze({ id: 'row-1', cells: Object.freeze(['Data warehouse', 'Maintenance', WRAPPED]) })
]);
export const SELECTION_COLUMNS = Object.freeze(['Environment', 'Region', 'Purpose']);
export const SELECTION_ROWS = Object.freeze([
  Object.freeze({ id: 'row-0', cells: Object.freeze(['Production', 'Frankfurt', 'Runs customer-facing services']) }),
  Object.freeze({ id: 'row-1', cells: Object.freeze(['Staging', 'Dallas', 'Validates releases before deployment']) }),
  Object.freeze({ id: 'row-2', cells: Object.freeze(['Development', 'London', 'Supports feature development and integration']) }),
  Object.freeze({ id: 'row-3', cells: Object.freeze(['Disaster recovery', 'Sydney', 'Provides a standby recovery environment']) })
]);

const LIST = Object.freeze({ accessibilityLabel: 'Service status', columns: COLUMNS });
const SELECTION = Object.freeze({ accessibilityLabel: 'Deployment environments', columns: SELECTION_COLUMNS, rows: SELECTION_ROWS, selection: true });


/********************************************************************
One frozen state.

@param {String} label - The state's label
@param {Object} props - Its props

@return {Object} - The state
*********************************************************************/
function state (label, props) {

  return Object.freeze({ label: label, props: Object.freeze(props) });

}

export default Object.freeze([
  state('default', Object.assign({ rows: ROWS }, LIST)),
  state('condensed', Object.assign({ isCondensed: true, rows: ROWS }, LIST)),
  state('flush', Object.assign({ isFlush: true, rows: ROWS }, LIST)),
  state('wraps', Object.assign({ rows: ROWS_LONG }, LIST)),
  state('wrapsAll', Object.assign({ rows: ROWS_LONG_WRAP }, LIST)),
  state('twoColumns', { accessibilityLabel: 'Service status', columns: Object.freeze(['Service', 'Description']), rows: Object.freeze([Object.freeze({ id: 'row-0', cells: Object.freeze(['Data warehouse', LONG]) })]) }),
  state('selection', Object.assign({}, SELECTION)),
  state('selected', Object.assign({ selectedInitialRow: 'row-2' }, SELECTION)),
  state('selectedLast', Object.assign({ selectedInitialRow: 'row-3' }, SELECTION)),
  state('selectionCondensed', Object.assign({ isCondensed: true, selectedInitialRow: 'row-2' }, SELECTION)),
  state('selectionFlush', Object.assign({ isFlush: true }, SELECTION)),
  state('radio', Object.assign({ marker: 'radio' }, SELECTION)),
  state('radioSelected', Object.assign({ marker: 'radio', selectedInitialRow: 'row-1' }, SELECTION)),
  state('radioCondensed', Object.assign({ isCondensed: true, marker: 'radio', selectedInitialRow: 'row-1' }, SELECTION))
]);
