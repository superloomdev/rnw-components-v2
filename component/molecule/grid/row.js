// Info: Row molecule. One row of the flexbox Grid: negative inline
// margins against the grid's padding so the columns' own padding halves
// re-form the gutter; the columns read the family context the Grid
// provides.
import SPEC from './spec.row.js';

export default function Row (ctx) {
  const React = ctx.React;
  const { View } = ctx.ReactNative;

  function RowComponent (props) {
    // The row pulls back by half the regular gutter in every kind; the
    // condensed and narrow columns change their own padding only (probe
    // `Row.json`: rows margin-left -16 in default, condensed and narrow;
    // columns 16 / 0.5 / 0-16)
    const half = ctx.metric('Row', 'gutter') / 2;
    const children = Array.isArray(props.columns) ? props.columns.map(function (c, i) {
      return React.createElement(ctx.Registry.Column, Object.assign({ key: i }, c));
    }) : props.children;
    return React.createElement(View, {
      dataSet: { part: 'row' },
      style: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginEnd: -half, marginStart: -half },
      testID: props.testID
    }, children);
  }

  RowComponent.displayName = 'Row';
  return RowComponent;
}
Row.spec = SPEC;
