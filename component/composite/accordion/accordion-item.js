// Info: AccordionItem composite. One headed section of an Accordion: the
// pressable heading with its chevron and the collapsible content. The item's
// own `useDisclosure` owns `open`; the parent Accordion passes align, size,
// flush and the divider-hover flags through props. Upstream the content sits
// in a padded wrapper (the block insets) holding a padded content box (the
// inline insets); both draw here.

import SPEC from './spec.accordion-item.js';


/********************************************************************
AccordionItem factory.

@param {Object} ctx - Component context

@return {Function} - The AccordionItem component
*********************************************************************/
export default function AccordionItem (ctx) {

  const React = ctx.React;
  const { View, Text, Pressable } = ctx.ReactNative;
  const { useDisclosure, useInteractionState } = ctx.behaviors;


  /********************************************************************
  AccordionItem component.

  @param {Object} props - See `api.accordion-item.js`

  @return {Object} - React element
  *********************************************************************/
  function AccordionItemComponent (props) {

    const openState = useDisclosure({
      open: props.open,
      defaultOpen: props.defaultOpen === true,
      onOpenChange: props.onOpenChange,
      disabled: props.disabled === true
    });
    const interaction = useInteractionState({ disabled: props.disabled === true });

    const align = props.align || 'end';
    const live = props.disabled !== true;
    const open = openState.state.open === true;
    const flush = props.flush === true;
    const hoverRule = props.dividerHover === true || props.previousHover === true;

    // The measured item width resolves the content end ratio
    const [itemWidth, setItemWidth] = React.useState(0);
    const onItemLayout = function (event) {
      const width = event.nativeEvent.layout.width;
      if (width !== itemWidth) {
        setItemWidth(width);
      }
    };

    const headingPadding = ctx.metric('AccordionItem', 'headingPaddingInline');
    const iconSize = ctx.metric('AccordionItem', 'iconSize');
    const titleGap = ctx.metric('AccordionItem', 'titleGap');
    const dividerWidth = ctx.metric('AccordionItem', 'dividerWidth');
    const sizeName = props.size === 'sm' ? 'sizeSmall' : props.size === 'lg' ? 'sizeLarge' : 'sizeMedium';
    const height = ctx.metric('AccordionItem', sizeName);

    const labelLeaf = live ? 'accordion_heading_label' : 'accordion_heading_label_disabled';
    const iconLeaf = live ? 'accordion_icon' : 'accordion_icon_disabled';
    const dividerLeaf = hoverRule ? 'accordion_divider_hover' : 'accordion_divider';
    const chevronFirst = align === 'start';
    const state = interaction.state;

    const chevron = React.createElement(ctx.Registry.Icon, {
      color: iconLeaf,
      name: 'chevron_right',
      size: iconSize,
      style: Object.assign({
        transform: [{ rotate: open ? '-90deg' : '-270deg' }]
      }, chevronFirst
        ? { marginStart: headingPadding, marginTop: ctx.metric('AccordionItem', 'iconTop') }
        : { marginStart: titleGap })
    });
    const title = React.createElement(Text, {
      numberOfLines: 1,
      style: [ctx.typeStyle('accordion_title'), {
        color: ctx.color(labelLeaf),
        flexBasis: 'auto',
        flexGrow: 1,
        flexShrink: 1
      }, chevronFirst ? { paddingStart: titleGap } : { paddingStart: titleGap }]
    }, props.title);

    const rule = flush === true
      ? React.createElement(View, { style: {
        backgroundColor: ctx.color(dividerLeaf),
        height: dividerWidth,
        left: ctx.metric('AccordionItem', 'flushInset'),
        position: 'absolute',
        right: ctx.metric('AccordionItem', 'flushInset'),
        top: 0
      } })
      : null;

    const heading = React.createElement(Pressable, {
      accessibilityRole: 'button',
      'aria-controls': props.contentId,
      'aria-expanded': open,
      'aria-disabled': !live,
      disabled: !live,
      onPress: function () {
        openState.toggle();
      },
      onPressIn: interaction.rootProps.onPressIn,
      onPressOut: interaction.rootProps.onPressOut,
      onHoverIn: interaction.rootProps.onHoverIn,
      onHoverOut: interaction.rootProps.onHoverOut,
      onPointerEnter: function (event) {
        if (typeof props.onHoverChange === 'function') {
          props.onHoverChange(true);
        }
        if (typeof interaction.rootProps.onHoverIn === 'function') {
          interaction.rootProps.onHoverIn(event);
        }
      },
      onPointerLeave: function (event) {
        if (typeof props.onHoverChange === 'function') {
          props.onHoverChange(false);
        }
        if (typeof interaction.rootProps.onHoverOut === 'function') {
          interaction.rootProps.onHoverOut(event);
        }
      },
      onFocus: interaction.rootProps.onFocus,
      onBlur: interaction.rootProps.onBlur,
      style: {
        alignItems: 'center',
        backgroundColor: state.hovered === true ? ctx.color('accordion_heading_container_hover') : 'transparent',
        flexDirection: chevronFirst ? 'row' : 'row-reverse',
        minHeight: height,
        outlineColor: state.focused === true ? ctx.color('accordion_focus') : 'transparent',
        outlineOffset: -2,
        outlineStyle: 'solid',
        outlineWidth: state.focused === true ? ctx.metric('AccordionItem', 'focusWidth') : 0,
        paddingEnd: chevronFirst ? 0 : headingPadding
      }
    },
    chevron,
    title
    );

    const content = React.createElement(View, {
      style: open === true ? {
        paddingBottom: ctx.metric('AccordionItem', 'contentPaddingBottom'),
        paddingTop: ctx.metric('AccordionItem', 'contentPaddingTop')
      } : { display: 'none' }
    }, React.createElement(View, {
      id: props.contentId,
      role: 'region',
      style: {
        marginStart: chevronFirst ? headingPadding + iconSize : 0,
        paddingEnd: Math.min(ctx.metric('AccordionItem', 'contentPaddingEnd'), Math.floor(itemWidth * ctx.metric('AccordionItem', 'contentEndRatio'))),
        paddingStart: headingPadding
      }
    }, typeof props.children === 'string' ? React.createElement(Text, { style: ctx.typeStyle('body_compact_01') }, props.children) : props.children));

    return React.createElement(View, {
      onLayout: onItemLayout,
      role: 'listitem',
      style: {
        borderBottomColor: props.last === true ? (flush === true ? 'transparent' : ctx.color(dividerLeaf)) : undefined,
        borderBottomWidth: props.last === true ? dividerWidth : 0,
        borderTopColor: flush === true ? 'transparent' : ctx.color(dividerLeaf),
        borderTopWidth: dividerWidth,
        position: 'relative'
      }
    }, heading, rule, content);
  }

  AccordionItemComponent.displayName = 'AccordionItem';

  return AccordionItemComponent;

}

AccordionItem.spec = SPEC;
