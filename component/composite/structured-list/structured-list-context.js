// Info: The contexts the structured list's members share. Module-level so
// every factory shares one React context instance each. The table context
// carries the list's form (condensed, flush, selection and its marker), the
// selected and hovered rows, the column widths and the cells' measure; the
// row context what a row's cells draw (head, active, the row's id and its
// focus); the cell context a cell's column and its place in the row.

let tableContext = null;
let rowContext = null;
let cellContext = null;


export function createTableContext (ctx) {

  if (tableContext === null) {
    tableContext = ctx.React.createContext(null);
  }
  return tableContext;

}


export function createRowContext (ctx) {

  if (rowContext === null) {
    rowContext = ctx.React.createContext(Object.freeze({ active: false, head: false, id: null }));
  }
  return rowContext;

}


export function createCellContext (ctx) {

  if (cellContext === null) {
    cellContext = ctx.React.createContext(Object.freeze({ column: 0, first: true }));
  }
  return cellContext;

}
