// Info: AccordionSkeleton composite. The placeholder shape of an accordion:
// one section open, its title bar and three content bars drawn from
// SkeletonText; the rest draw only a heading bar. Upstream's last bar loses
// its trailing gap to margin collapse, so the content box is a fixed height
// of three lines and two gaps, clipped.

import SPEC from './spec.accordion-skeleton.js';

const PCT = '%';


/********************************************************************
AccordionSkeleton factory.

@param {Object} ctx - Component context

@return {Function} - The AccordionSkeleton component
*********************************************************************/
export default function AccordionSkeleton (ctx) {

  const React = ctx.React;
  const { View } = ctx.ReactNative;


  /********************************************************************
  One placeholder section. The heading is a span upstream, not a button:
  a centered chevron and a title bar at the title gap.

  @param {Object} props - { align, flush, open }

  @return {Object} - React element
  *********************************************************************/
  function Item (props) {

    const headingPadding = ctx.metric('AccordionSkeleton', 'headingPaddingInline');
    const iconSize = ctx.metric('AccordionSkeleton', 'iconSize');
    const iconTop = ctx.metric('AccordionSkeleton', 'iconTop');
    const titleGap = ctx.metric('AccordionSkeleton', 'titleGap');
    const lineHeight = ctx.metric('AccordionSkeleton', 'skeletonTextHeight');
    const lineGap = ctx.metric('AccordionSkeleton', 'skeletonTextGap');
    const chevronFirst = props.align === 'start';
    const flush = props.flush === true;

    const [itemWidth, setItemWidth] = React.useState(0);
    const onItemLayout = function (event) {
      const width = event.nativeEvent.layout.width;
      if (width !== itemWidth) {
        setItemWidth(width);
      }
    };

    const chevron = React.createElement(ctx.Registry.Icon, {
      color: 'accordion_icon',
      name: 'chevron_right',
      size: iconSize,
      style: Object.assign({
        transform: [{ rotate: props.open === true ? '-90deg' : '-270deg' }]
      }, chevronFirst
        ? { marginStart: titleGap, marginTop: iconTop }
        : { marginStart: titleGap })
    });
    const titleBar = React.createElement(View, { style: {
      flexBasis: 'auto',
      flexGrow: 1,
      flexShrink: 1,
      height: lineHeight,
      marginEnd: chevronFirst ? titleGap : 0,
      overflow: 'hidden',
      paddingEnd: chevronFirst ? titleGap : 0,
      paddingStart: titleGap
    } }, React.createElement(ctx.Registry.SkeletonText, {}));

    const bars = [];
    const widths = [90, 80, 95];
    for (let i = 0; i < widths.length; i = i + 1) {
      bars.push(React.createElement(ctx.Registry.SkeletonText, { key: i, width: widths[i] + PCT }));
    }
    const content = props.open === true ? React.createElement(View, {
      role: 'region',
      style: {
        height: lineHeight * 3 + lineGap * 2,
        overflow: 'hidden',
        marginStart: chevronFirst ? headingPadding + iconSize : 0,
        paddingEnd: Math.min(ctx.metric('AccordionSkeleton', 'contentPaddingEnd'), Math.floor(itemWidth * ctx.metric('AccordionSkeleton', 'contentEndRatio'))),
        paddingStart: headingPadding
      }
    }, bars) : null;

    return React.createElement(View, {
      onLayout: onItemLayout,
      role: 'listitem',
      style: {
        borderBottomColor: props.last === true ? (flush === true ? 'transparent' : ctx.color('accordion_divider')) : undefined,
        borderBottomWidth: props.last === true ? ctx.metric('AccordionSkeleton', 'dividerWidth') : 0,
        borderTopColor: flush === true ? 'transparent' : ctx.color('accordion_divider'),
        borderTopWidth: ctx.metric('AccordionSkeleton', 'dividerWidth'),
        marginBottom: props.open === true ? lineGap : 0,
        position: 'relative'
      }
    },
    React.createElement(View, { style: {
      alignItems: 'center',
      flexDirection: chevronFirst ? 'row' : 'row-reverse',
      minHeight: ctx.metric('AccordionSkeleton', 'sizeMedium'),
      paddingEnd: chevronFirst ? 0 : headingPadding,
      paddingStart: 0
    } },
    chevron,
    titleBar
    ),
    flush === true ? React.createElement(View, { style: {
      backgroundColor: ctx.color('accordion_divider'),
      height: ctx.metric('AccordionSkeleton', 'dividerWidth'),
      left: ctx.metric('AccordionSkeleton', 'flushInset'),
      position: 'absolute',
      right: ctx.metric('AccordionSkeleton', 'flushInset'),
      top: 0
    } }) : null,
    content);
  }


  /********************************************************************
  AccordionSkeleton component.

  @param {Object} props - See `api.accordion-skeleton.js`

  @return {Object} - React element
  *********************************************************************/
  function AccordionSkeletonComponent (props) {

    const count = props.count || 4;
    const open = props.open !== false;
    const ListTag = props.ordered === true ? 'ol' : 'ul';
    const items = [];
    for (let i = 0; i < count; i = i + 1) {
      items.push(React.createElement(Item, {
        align: props.align,
        flush: props.isFlush === true,
        key: i,
        last: i === count - 1,
        open: open === true && i === 0
      }));
    }
    return React.createElement(View, { accessibilityRole: 'list', role: ListTag === 'ol' ? 'list' : 'list' }, items);
  }

  AccordionSkeletonComponent.displayName = 'AccordionSkeleton';

  return AccordionSkeletonComponent;

}

AccordionSkeleton.spec = SPEC;
