// Info: PaginationSkeleton composite. The Pagination bar's loading
// placeholder: the container's own cells for the bar and its divider, and
// four SkeletonText bars in the text gap's rhythm (medium, short, long in
// the left slot, medium on the right), as the references draw it.
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

    // The four bars: medium, short, long on the left, medium on the right
    const SkeletonText = ctx.Registry.SkeletonText;
    const gap = ctx.metric('PaginationSkeleton', 'gap');
    const bar = function (key, width, last) {
      return React.createElement(View, { dataSet: { part: 'text' }, key: key, style: { marginEnd: last === true ? 0 : gap } },
        React.createElement(SkeletonText, { width: ctx.metric('PaginationSkeleton', width) }));
    };
    const left = React.createElement(View, { dataSet: { part: 'left' }, style: { flexDirection: 'row' } },
      [bar('a', 'widthMedium'), bar('b', 'widthShort'), bar('c', 'widthLong')]);
    const right = React.createElement(View, { dataSet: { part: 'right' } }, bar('d', 'widthMedium', true));

    // Render the bar: the container's background and its top divider
    return React.createElement(View, {
      'aria-hidden': true,
      dataSet: { part: 'root' },
      style: {
        alignItems: 'center',
        backgroundColor: ctx.color('pagination_container'),
        borderTopColor: ctx.color('pagination_divider'),
        borderTopWidth: ctx.metric('PaginationSkeleton', 'dividerWidth'),
        flexDirection: 'row',
        height: ctx.metric('PaginationSkeleton', 'height'),
        justifyContent: 'space-between',
        paddingInline: ctx.metric('PaginationSkeleton', 'paddingInline')
      },
      testID: props.testID
    }, left, right);

  }

  PaginationSkeletonComponent.displayName = 'PaginationSkeleton';
  return PaginationSkeletonComponent;

}
PaginationSkeleton.spec = SPEC;
