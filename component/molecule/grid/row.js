// Info: Row molecule. One row of the flexbox Grid: negative inline
// margins against the grid's padding so the columns' own padding halves
// re-form the gutter; the columns read the family context the Grid
// provides.
import SPEC from './spec.row.js';
import createGridContext from './grid-context.js';

export default function Row (ctx) {
  const React = ctx.React;
  const { View } = ctx.ReactNative;
  const GridContext = createGridContext(ctx);

  function RowComponent (props) {
    // The row pulls back by half the regular gutter in every kind; the
    // condensed and narrow columns change their own padding only (probe
    // `Row.json`: rows margin-left -16 in default, condensed and narrow;
    // columns 16 / 0.5 / 0-16)
    const half = ctx.metric('Row', 'gutter') / 2;
    // A row-gap grid also gaps the row's wrapped columns
    // (`_flex-grid.scss:327-330` gap row-gap 0)
    const rowGap = React.useContext(GridContext).rowGap;
    const children = Array.isArray(props.columns) ? props.columns.map(function (c, i) {
      return React.createElement(ctx.Registry.Column, Object.assign({ key: i }, c));
    }) : props.children;
    return React.createElement(View, {
      dataSet: { part: 'row' },
      style: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginEnd: -half, marginStart: -half, rowGap: rowGap > 0 ? rowGap : undefined },
      testID: props.testID
    }, children);
  }

  RowComponent.displayName = 'Row';
  return RowComponent;
}
Row.spec = SPEC;
