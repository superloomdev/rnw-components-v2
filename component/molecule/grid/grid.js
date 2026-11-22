// Info: Grid molecule. The layout grid holding Columns (CSS-grid form) or
// Rows (flexbox form): padding from the margin cell, the kind's gutter
// halves on each side of every column, the 16-track span math through
// `calc`, and the `breakpoint.max` ceiling unless `fullWidth`. The grid
// reads the window to name the breakpoint, as the reference's media
// queries do, takes that breakpoint's margin and provides the family
// context the Row and Column read.
import SPEC from './spec.grid.js';
import createGridContext from './grid-context.js';

export default function Grid (ctx) {
  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;
  const GridContext = createGridContext(ctx);
  const BREAKPOINTS = ['sm', 'md', 'lg', 'xlg', 'max'];

  function GridComponent (props) {
    const viewport = ctx.behaviors.useViewportSize();
    const width = viewport.width;
    const condensed = props.condensed === true;
    const narrow = props.narrow === true;
    const fullWidth = props.fullWidth === true;
    // The row gap: the gutter, half of it in a narrow grid, none in a
    // condensed flexbox grid (`_flex-grid.scss:322-340`; the CSS grid
    // `_css-grid.scss:160-167` keeps the gutter when condensed)
    const holdsRows = React.Children.toArray(props.children).some(function (child) {
      return child !== null && child !== undefined && child.type !== undefined && child.type.displayName === 'Row';
    });
    const rowGap = props.withRowGap !== true ? 0 : narrow ? ctx.metric('Grid', 'gutter') / 2 : condensed && holdsRows ? 0 : ctx.metric('Grid', 'gutter');
    const gutter = condensed ? ctx.metric('Grid', 'gutterCondensed') : narrow ? ctx.metric('Grid', 'gutterNarrow') : ctx.metric('Grid', 'gutter');
    // A breakpoint runs from its own width to the next one's (`sm` below
    // `md`, ..., `max` from `breakpoint.max`); an unknown window is `lg`
    const starts = [0, ctx.metric('Grid', 'bpMd'), ctx.metric('Grid', 'bpLg'), ctx.metric('Grid', 'bpXlg'), ctx.metric('Grid', 'maxWidth')];
    let breakpoint = 'lg';
    if (Utils.isNumber(width) && width > 0) {
      for (let i = 0; i < starts.length; i = i + 1) {
        if (width >= starts[i]) {
          breakpoint = BREAKPOINTS[i];
        }
      }
    }
    // The breakpoint's margin (the grid's `_config.scss` margins: none at sm)
    const margin = ctx.token('grid.margin_' + breakpoint);
    // A condensed flexbox grid pads its columns' block ends by the condensed
    // gutter's half too (`_flex-grid.scss:317-319`)
    const gutterBlock = condensed === true && holdsRows === true ? gutter / 2 : 0;
    const context = Object.freeze({ breakpoint: breakpoint, gutterBlock: gutterBlock, gutterEnd: narrow === true ? ctx.metric('Grid', 'gutter') / 2 : gutter / 2, gutterStart: narrow === true ? 0 : gutter / 2, mode: holdsRows === true ? 'rows' : 'columns', rowGap: rowGap, narrow: narrow });
    const style = {
      display: 'flex',
      flexDirection: holdsRows === true ? 'column' : 'row',
      flexWrap: holdsRows === true ? undefined : 'wrap',
      // The grid takes its container's width, the breakpoint ceiling only
      // caps it (`.cds--css-grid` / `.cds--grid`: inline-size 100%,
      // max-inline-size 99rem)
      maxWidth: fullWidth === true ? undefined : ctx.metric('Grid', 'maxWidth'),
      width: '100%',
      paddingEnd: holdsRows === true ? margin + ctx.metric('Grid', 'gutter') / 2 : margin,
      paddingStart: holdsRows === true ? margin + ctx.metric('Grid', 'gutter') / 2 : margin,
      rowGap: rowGap === 0 ? undefined : rowGap
    };
    return React.createElement(GridContext.Provider, { value: context },
      React.createElement(View, {
        dataSet: { part: 'grid' },
        style: style,
        testID: props.testID
      }, Utils.isArray(props.columns) ? props.columns.map(function (c, i) {
        return React.createElement(ctx.Registry.Column, Object.assign({ key: i }, c));
      }) : props.children));
  }

  GridComponent.displayName = 'Grid';
  return GridComponent;
}
Grid.spec = SPEC;
