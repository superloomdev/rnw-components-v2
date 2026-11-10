// Info: Column molecule. One column of the grid: the span of the
// breakpoint's track count through `calc`, the context's gutter halves as
// margins (CSS-grid mode) or padding (row mode), and `offset` as the
// matching start margin. `span: 0` draws nothing.
import SPEC from './spec.column.js';
import createGridContext from './grid-context.js';

export default function Column (ctx) {
  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;
  const GridContext = createGridContext(ctx);
  const ORDER = ['sm', 'md', 'lg', 'xlg', 'max'];

  // Resolve the breakpoint cascade: the largest defined bp <= the current
  // wins; none -> the column shares the track equally (auto)
  function resolve (props, bp) {
    const index = ORDER.indexOf(bp);
    for (let i = index; i >= 0; i = i - 1) {
      const v = props[ORDER[i]];
      if (v !== undefined && v !== null) {
        return v;
      }
    }
    return true;
  }

  function ColumnComponent (props) {
    const context = React.useContext(GridContext);
    const columns = ctx.metric('Column', 'columns');
    const spec = resolve(props, context.breakpoint);
    if (Utils.isNumber(spec) && spec === 0) {
      return null;
    }
    const span = Utils.isNumber(spec) ? spec : Utils.isObject(spec) && Utils.isNumber(spec.span) ? spec.span : null;
    const offset = Utils.isObject(spec) && Utils.isNumber(spec.offset) ? spec.offset : 0;
    const gutterHalfS = context.gutterStart;
    const gutterHalfE = context.gutterEnd;
    const mode = context.mode;
    // The track wrapper takes the span's fraction of the grid's content
    // width (and the offset's start margin); the painting column inside
    // carries the gutter halves, so no box ever outgrows its track
    const track = { flexShrink: 0 };
    if (span === null) {
      track.flexGrow = 1;
      track.flexBasis = '0%';
    } else {
      track.width = (span * 100 / columns) + '%';
    }
    if (offset > 0) {
      track.marginStart = (offset * 100 / columns) + '%';
    }
    const style = mode === 'columns'
      ? { marginEnd: gutterHalfE, marginStart: gutterHalfS }
      : { paddingEnd: gutterHalfE, paddingStart: gutterHalfS };
    return React.createElement(View, { style: track },
      React.createElement(View, { dataSet: { part: 'column' }, style: style, testID: props.testID },
        Utils.isString(props.children) ? React.createElement(ctx.ReactNative.Text, { style: ctx.typeStyle('body_compact_01') }, props.children) : props.children));
  }

  ColumnComponent.displayName = 'Column';
  return ColumnComponent;
}
Column.spec = SPEC;
