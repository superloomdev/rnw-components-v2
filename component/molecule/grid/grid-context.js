// Info: the context a Grid provides its Rows and Columns: the grid's mode
// (CSS-grid Columns or flexbox Rows), the gutter halves for the current
// grid kind, and the breakpoint the laid-out width falls in. Module-level
// so every factory shares the one React context instance.
let gridContext = null;

export default function createGridContext (ctx) {
  if (gridContext === null) {
    gridContext = ctx.React.createContext(Object.freeze({ breakpoint: 'lg', gutterStart: 16, gutterEnd: 16, mode: 'rows', rowGap: 0 }));
  }
  return gridContext;
}
