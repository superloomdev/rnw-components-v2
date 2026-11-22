// Info: PaginationSkeleton composite. The Pagination bar's loading
// placeholder: the container's own cells for the bar and its divider, and
// four skeleton text bars in the text gap's rhythm (medium, short, long in
// the left slot, medium on the right), as the references draw it. Below
// the collapse width the bar keeps its blocks empty: the bars are the
// blocks' children the container query hides (`_pagination.scss:60-74`).
//
// Behavior: none - a placeholder takes no input.
//
// Accessibility: hidden from assistive technology, like every skeleton.
import SPEC from './spec.pagination-skeleton.js';


/********************************************************************
PaginationSkeleton factory.

@param {Object} ctx - Component context

@return {Function} - The PaginationSkeleton component
*********************************************************************/
export default function PaginationSkeleton (ctx) {

  const React = ctx.React;
  const { View } = ctx.ReactNative;


  /********************************************************************
  PaginationSkeleton component.

  @param {Object} props - See `api.pagination-skeleton.js`

  @return {Object} - React element
  *********************************************************************/
  function PaginationSkeletonComponent (props) {

    // The four bars: medium, short, long on the left, medium on the right;
    // every bar keeps its end gap (`_pagination.scss:278-281`), the left
    // block pads both ends and the right block draws the divider at its
    // start (probe: left 290 = 16 + 70 + 16 + 35 + 16 + 105 + 16 + 16,
    // right 87 = 1 + 70 + 16)
    // Upstream's SkeletonText bars drop their bottom margin here
    // (`_pagination.scss:278-281` margin-block-end 0), so each bar is the
    // placeholder alone at the text line's height (probe: texts 16 tall)
    const SkeletonPlaceholder = ctx.Registry.SkeletonPlaceholder;
    const gap = ctx.metric('PaginationSkeleton', 'gap');
    const divider = ctx.metric('PaginationSkeleton', 'dividerWidth');
    const bar = function (key, width) {
      return React.createElement(View, { dataSet: { part: 'text' }, key: key, style: { marginEnd: gap } },
        React.createElement(SkeletonPlaceholder, { height: ctx.metric('PaginationSkeleton', 'barHeight'), width: ctx.metric('PaginationSkeleton', width) }));
    };
    // The collapse measure: below the collapse width the blocks lose their
    // children, the left block its start padding and the right its rule
    // (`_pagination.scss:60-74,170-175,221-232`)
    const [barWidth, setBarWidth] = React.useState(undefined);
    const collapsed = typeof barWidth === 'number' && barWidth < ctx.metric('PaginationSkeleton', 'collapseWidth');
    const left = React.createElement(View, { dataSet: { part: 'left' }, style: { flexDirection: 'row', paddingEnd: ctx.metric('PaginationSkeleton', 'paddingInline'), paddingStart: collapsed ? 0 : ctx.metric('PaginationSkeleton', 'paddingInline') } },
      collapsed ? null : [bar('a', 'widthMedium'), bar('b', 'widthShort'), bar('c', 'widthLong')]);
    const right = React.createElement(View, { dataSet: { part: 'right' }, style: { borderStartColor: ctx.color('pagination_divider'), borderStartWidth: collapsed ? 0 : divider, flexDirection: 'row' } }, collapsed ? null : bar('d', 'widthMedium'));

    // Render the bar: the container's background and its top divider, one
    // divider short of its container (`inline-size: calc(100% - 1px)`)
    return React.createElement(View, {
      'aria-hidden': true,
      dataSet: { part: 'root' },
      onLayout: function (e) {
        const w = e.nativeEvent.layout.width;
        if (w !== barWidth) {
          setBarWidth(w);
        }
      },
      style: {
        alignItems: 'center',
        alignSelf: 'stretch',
        backgroundColor: ctx.color('pagination_container'),
        borderTopColor: ctx.color('pagination_divider'),
        borderTopWidth: divider,
        flexDirection: 'row',
        height: ctx.metric('PaginationSkeleton', 'height'),
        justifyContent: 'space-between',
        marginEnd: divider
      },
      testID: props.testID
    }, left, right);

  }

  PaginationSkeletonComponent.displayName = 'PaginationSkeleton';
  return PaginationSkeletonComponent;

}
PaginationSkeleton.spec = SPEC;
