// Info: Grid molecule. The layout grid holding Columns (CSS-grid form) or
// Rows (flexbox form): padding from the margin cell, the kind's gutter
// halves on each side of every column, the 16-track span math through
// `calc`, and the `breakpoint.max` ceiling unless `fullWidth`. The grid
// reads its laid-out width to name the breakpoint and provides the
// family context the Row and Column read.
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
    const rowGap = props.withRowGap === true ? ctx.metric('Grid', 'gutter') : 0;
    const gutter = condensed ? ctx.metric('Grid', 'gutterCondensed') : narrow ? ctx.metric('Grid', 'gutterNarrow') : ctx.metric('Grid', 'gutter');
    const bps = ['bpSm', 'bpMd', 'bpLg', 'bpXlg', 'maxWidth'];
    let breakpoint = 'max';
    for (let i = 0; i < bps.length; i = i + 1) {
      if (Utils.isNumber(width) && width < ctx.metric('Grid', bps[i])) {
        breakpoint = BREAKPOINTS[i]; break;
      }
    }
    const holdsRows = React.Children.toArray(props.children).some(function (child) {
      return child !== null && child !== undefined && child.type !== undefined && child.type.displayName === 'Row';
    });
    const context = Object.freeze({ breakpoint: breakpoint, gutterEnd: narrow === true ? ctx.metric('Grid', 'gutter') / 2 : gutter / 2, gutterStart: narrow === true ? 0 : gutter / 2, mode: holdsRows === true ? 'rows' : 'columns', rowGap: rowGap, narrow: narrow });
    const style = {
      display: 'flex',
      flexDirection: holdsRows === true ? 'column' : 'row',
      flexWrap: holdsRows === true ? undefined : 'wrap',
      // The grid takes its container's width, the breakpoint ceiling only
      // caps it (`.cds--css-grid` / `.cds--grid`: inline-size 100%,
      // max-inline-size 99rem)
      maxWidth: fullWidth === true ? undefined : ctx.metric('Grid', 'maxWidth'),
      width: '100%',
      paddingEnd: holdsRows === true ? ctx.metric('Grid', 'margin') + ctx.metric('Grid', 'gutter') / 2 : ctx.metric('Grid', 'margin'),
      paddingStart: holdsRows === true ? ctx.metric('Grid', 'margin') + ctx.metric('Grid', 'gutter') / 2 : ctx.metric('Grid', 'margin'),
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
