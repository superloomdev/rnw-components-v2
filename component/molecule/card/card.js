// Info: Card molecule - the productive card: header (label, title,
// description, top actions), body, footer (bottom actions, the primary /
// secondary button). Action icons are ghost IconButtons (sm at the top,
// md at the bottom, D-frozen), the overflow through OverflowMenu.
//
// Behavior: `role`/`tabIndex`/key handling sit on the root only for
// `clickZone: 'one'`; the footer renders when there are bottom actions
// or a button.
//
// Accessibility: clickZone one gives the card `button` role,
// `aria-disabled` when disabled.
import SPEC from './spec.card.js';

export default function Card (ctx) {
  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Text, View } = ctx.ReactNative;

  function CardComponent (props) {
    const pad = ctx.metric('Card', 'padding');
    const gap = ctx.metric('Card', 'textGap');
    const disabled = props.disabled === true;
    const zoneOne = props.clickZone === 'one';
    const interactive = zoneOne && typeof props.onClick === 'function' && !disabled;
    const icons = Utils.isArray(props.actionIcons) ? props.actionIcons : [];
    const overflow = Utils.isArray(props.overflowActions) ? props.overflowActions : [];
    const atTop = props.actionsPlacement === 'top';
    const iconSize = atTop ? 'sm' : 'md';
    const iconSeats = icons.map(function (seat, i) {
      return React.createElement(ctx.Registry.IconButton, {
        accessibilityLabel: seat.label,
        key: i,
        kind: 'ghost',
        onPress: seat.onPress,
        size: iconSize,
        icon: seat.icon
      });
    });
    const overflowNode = !Utils.isEmptyArray(overflow) ? React.createElement(ctx.Registry.OverflowMenu, {
      items: overflow.map(function (a) {
        return { label: a.label, onPress: a.onPress };
      }),
      size: iconSize
    }) : null;
    const actions = !Utils.isEmptyArray(iconSeats) || overflowNode !== null
      ? React.createElement(View, { dataSet: { part: 'actions' }, style: { alignItems: 'center', flexDirection: 'row', minHeight: ctx.metric('Card', 'actionsHeight'), paddingStart: ctx.metric('Card', 'iconPadding') } }, iconSeats, overflowNode)
      : null;
    const header = React.createElement(View, { dataSet: { part: 'header' }, style: { paddingBottom: pad, paddingEnd: pad, paddingStart: pad, paddingTop: pad } },
      React.createElement(View, { style: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' } },
        React.createElement(View, {},
          Utils.isString(props.label) ? React.createElement(Text, { dataSet: { part: 'label' }, style: [{ color: ctx.color('card_label'), marginBottom: gap }, ctx.typeStyle('card_label')] }, props.label) : null,
          Utils.isString(props.title) ? React.createElement(Text, { dataSet: { part: 'title' }, style: [{ color: ctx.color('card_label') }, ctx.typeStyle(props.titleSize === 'large' ? 'card_title_large' : 'card_title')] }, props.title) : null),
        atTop ? actions : null),
      Utils.isString(props.description) ? React.createElement(Text, { dataSet: { part: 'description' }, style: [{ color: ctx.color('card_label'), marginTop: gap }, ctx.typeStyle('card_description')] }, props.description) : null);
    const body = React.createElement(View, { dataSet: { part: 'body' }, style: { paddingBottom: pad, paddingEnd: pad, paddingStart: pad, paddingTop: ctx.metric('Card', 'paddingBodyTop') } },
      Utils.isString(props.children) ? React.createElement(Text, { style: [{ color: ctx.color('card_label') }, ctx.typeStyle('card_body')] }, props.children) : props.children);
    const primary = Utils.isString(props.primaryButtonText)
      ? React.createElement(ctx.Registry.Button, { kind: 'primary', label: props.primaryButtonText, onPress: props.onPrimaryButtonClick, size: 'md' })
      : null;
    const secondary = Utils.isString(props.secondaryButtonText)
      ? React.createElement(ctx.Registry.Button, { kind: 'secondary', label: props.secondaryButtonText, onPress: props.onSecondaryButtonClick, size: 'md' })
      : null;
    const footer = (!atTop && actions !== null) || primary !== null || secondary !== null
      ? React.createElement(View, { dataSet: { part: 'footer' }, style: { alignItems: 'center', borderTopColor: ctx.color('card_divider'), borderTopWidth: ctx.metric('Card', 'dividerWidth'), flexDirection: 'row', justifyContent: 'space-between' } },
        React.createElement(View, {}, atTop ? null : actions), React.createElement(View, { style: { flexDirection: 'row' } }, secondary, primary))
      : null;
    const card = React.createElement(View, {
      dataSet: { part: 'root' },
      style: {
        backgroundColor: interactive ? ctx.color('card_container_hover') : ctx.color('card_container'),
        borderColor: interactive ? ctx.color('card_outline_clickable') : 'transparent',
        borderWidth: ctx.metric('Card', 'borderWidth')
      },
      testID: props.testID
    }, header, body, footer);
    if (!zoneOne) {
      return card;
    }
    return React.createElement(View, {
      accessibilityRole: 'button',
      'aria-disabled': disabled || undefined,
      focusable: interactive,
      onClick: interactive ? props.onClick : undefined,
      onKeyDown: interactive ? function (e) {
        const key = e.nativeEvent && e.nativeEvent.key ? e.nativeEvent.key : (e.key || '');
        if ((key === 'Enter' || key === ' ') && typeof props.onClick === 'function') {
          props.onClick(e);
        }
      } : undefined,
      style: function (state) {
        const focused = state && state.focused === true;
        return [{
          outlineColor: focused ? ctx.color('card_focus') : undefined,
          outlineStyle: focused ? 'solid' : undefined,
          outlineWidth: focused ? ctx.metric('Card', 'focusWidth') : undefined
        }];
      }
    }, card);
  }

  CardComponent.displayName = 'Card';
  return CardComponent;
}
Card.spec = SPEC;
