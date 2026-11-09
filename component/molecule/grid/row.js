// Info: Row molecule. One row of the flexbox Grid: negative inline
// margins against the grid's padding so the columns' own padding halves
// re-form the gutter. Reads the family context the Grid provides.
import SPEC from './spec.row.js';
import createGridContext from './grid-context.js';

export default function Row (ctx) {
  const React = ctx.React;
  const { View } = ctx.ReactNative;
  const GridContext = createGridContext(ctx);

  function RowComponent (props) {
    const context = React.useContext(GridContext);
    const children = Array.isArray(props.columns) ? props.columns.map(function (c, i) {
      return React.createElement(ctx.Registry.Column, Object.assign({ key: i }, c));
    }) : props.children;
    return React.createElement(View, {
      dataSet: { part: 'row' },
      style: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginEnd: -context.gutterEnd, marginStart: -context.gutterStart },
      testID: props.testID
    }, children);
  }

  RowComponent.displayName = 'Row';
  return RowComponent;
}
Row.spec = SPEC;
