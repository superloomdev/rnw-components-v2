// Info: StructuredListSkeleton composite. The list's loading placeholder
// (`StructuredList.Skeleton.js`, `structured-list/_structured-list.scss:231-262`):
// a head of three cells at `control.structured_list_skeleton_column_first`,
// `_second` and `_third` of the table, which shares its whole width among
// them in that ratio (8 %, 30 %, 15 % scale to 15.09 %, 56.6 %, 28.3 %:
// probe 120.75 / 452.828 / 226.422 of 800), each holding a
// `control.structured_list_skeleton_bar_height` bar
// `control.structured_list_skeleton_bar_ratio` of its content width in the
// skeleton fill; then `rowCount` body rows of three empty cells, each row
// under its rule and the last closed by one (`:71-82`).

import SPEC from './spec.structured-list-skeleton.js';


/********************************************************************
StructuredListSkeleton factory.

@param {Object} ctx - Component context

@return {Function} - The StructuredListSkeleton component
*********************************************************************/
export default function StructuredListSkeleton (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;
  const COLUMNS = Object.freeze(['columnFirst', 'columnSecond', 'columnThird']);


  /********************************************************************
  StructuredListSkeleton component.

  @param {Object} props - See `api.structured-list-skeleton.js`

  @return {Object} - React element
  *********************************************************************/
  function StructuredListSkeletonComponent (props) {

    const metric = function (name) {
      return ctx.metric('StructuredListSkeleton', name);
    };
    const [width, setWidth] = React.useState(null);
    const onLayout = function (event) {
      const next = event.nativeEvent.layout.width;
      if (next !== width) {
        setWidth(next);
      }
    };
    const ratios = COLUMNS.map(metric);
    const total = ratios.reduce(function (sum, ratio) {
      return sum + ratio;
    }, 0);
    const count = Utils.isNumber(props.rowCount) && props.rowCount > 0 ? Math.floor(props.rowCount) : 5;
    const rule = ctx.metric('StructuredListSkeleton', 'ruleWidth');
    // A share of the measured width, border box: a grow ratio would share
    // only what the paddings leave
    const columnStyle = function (index) {
      return width === null ? { flexBasis: 0, flexGrow: ratios[index], flexShrink: 1 } : { width: width * ratios[index] / total };
    };

    // The head: a bar in each cell, its share of the content width
    const head = React.createElement(View, { key: 'head', role: 'rowgroup' }, React.createElement(View, { role: 'row', style: { flexDirection: 'row' } },
      ratios.map(function (ratio, index) {
        const start = metric(index === 0 ? 'paddingStart' : 'paddingInline');
        const end = metric('paddingInline');
        const content = width === null ? 0 : width * ratio / total - start - end;
        return React.createElement(View, {
          dataSet: { part: 'headCell' },
          key: index,
          role: 'columnheader',
          style: [columnStyle(index), { minHeight: metric('headHeight'), paddingBottom: metric('headPaddingBottom'), paddingEnd: end, paddingStart: start, paddingTop: metric('headPaddingTop') }]
        }, React.createElement(ctx.Registry.SkeletonPlaceholder, { height: metric('barHeight'), width: Math.max(0, content * metric('barRatio')) }));
      })));

    // The body: empty rows under their rules
    const rows = [];
    for (let index = 0; index < count; index = index + 1) {
      rows.push(React.createElement(View, { dataSet: { part: 'row' }, key: index, role: 'row', style: { borderTopColor: ctx.color('structured_list_border'), borderTopWidth: rule, flexDirection: 'row' } },
        ratios.map(function (ratio, column) {
          return React.createElement(View, { key: column, role: 'cell', style: [columnStyle(column), { paddingBottom: metric('cellPaddingBottom'), paddingTop: metric('cellPaddingTop') }] });
        })));
    }
    const body = React.createElement(View, { dataSet: { part: 'rowGroup' }, key: 'body', role: 'rowgroup', style: { borderBottomColor: ctx.color('structured_list_border'), borderBottomWidth: rule } }, rows);
    return React.createElement(View, { 'aria-busy': true, dataSet: { part: 'root' }, onLayout: onLayout, testID: props.testID, style: { width: '100%' } }, head, body);

  }

  StructuredListSkeletonComponent.displayName = 'StructuredListSkeleton';
  return StructuredListSkeletonComponent;

}

StructuredListSkeleton.spec = SPEC;
