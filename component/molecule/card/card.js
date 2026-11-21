// Info: Card molecule - the productive card: header (label, title,
// description, top actions), body, footer (bottom actions, the primary /
// secondary button). Action icons are ghost IconButtons (sm at the top,
// md at the bottom, D-frozen), the overflow through OverflowMenu.
//
// Behavior: `useButton` gives the press, keys and ring to the root only
// for `clickZone: 'one'` with an `onClick`; the footer renders when there
// are bottom actions or a button.
//
// Accessibility: clickZone one gives the card `button` role (`group` when
// it holds controls), `aria-disabled` when disabled.
import SPEC from './spec.card.js';

export default function Card (ctx) {
  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, Text, View } = ctx.ReactNative;
  const { useButton } = ctx.behaviors;

  function CardComponent (props) {
    const pad = ctx.metric('Card', 'padding');
    const gap = ctx.metric('Card', 'textGap');
    const disabled = props.disabled === true;
    // Only a card with a click handler takes the zone (`Card.js:28,88`)
    const zoneOne = props.clickZone === 'one' && typeof props.onClick === 'function';
    const interactive = zoneOne && !disabled;
    const button = useButton({ disabled: !interactive, onPress: props.onClick });
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
    // Productive action icons are icon-only ghost buttons, not `__icon`
    // seats, so the row adds no padding of its own (`Card.js:58-69`,
    // `_productive-card.scss` `__actions` margin 0, min block size 32);
    // in the header the row lifts by the offset unless a label or a large
    // title sits beside it (`__actions-header`)
    const hasLabel = Utils.isString(props.label);
    const large = props.titleSize === 'large';
    // With overflow actions the menu replaces the icons (`Card.js:35-51`)
    const actions = !Utils.isEmptyArray(iconSeats) || overflowNode !== null
      ? React.createElement(View, {
        dataSet: { part: 'actions' },
        style: { alignItems: 'center', flexDirection: 'row', marginTop: atTop && !hasLabel && !large ? -ctx.metric('Card', 'actionsOffset') : 0, minHeight: ctx.metric('Card', 'actionsHeight') }
      }, overflowNode !== null ? overflowNode : iconSeats)
      : null;
    const headerActions = atTop && actions !== null;
    const labelOnly = hasLabel && !Utils.isString(props.title) && !Utils.isString(props.description);
    // The header pads every side but the end; its row pads the end by the
    // actions space when it holds actions (`_card.scss` `__header`,
    // `__header-container--has-actions`, `__header-label-only`)
    const header = React.createElement(View, { dataSet: { part: 'header' }, style: { paddingBottom: labelOnly ? ctx.metric('Card', 'headerPaddingBottomLabel') : pad, paddingStart: pad, paddingTop: pad } },
      React.createElement(View, { style: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between', paddingEnd: headerActions ? ctx.metric('Card', 'actionsSpace') : 0 } },
        React.createElement(View, { style: { flexShrink: 1 } },
          hasLabel ? React.createElement(Text, { dataSet: { part: 'label' }, style: [{ color: ctx.color('card_label'), marginBottom: labelOnly ? 0 : gap }, ctx.typeStyle('card_label')] }, props.label) : null,
          Utils.isString(props.title) ? React.createElement(Text, { dataSet: { part: 'title' }, style: [{ color: ctx.color('card_label') }, ctx.typeStyle(large ? 'card_title_large' : 'card_title')] }, props.title) : null,
          Utils.isString(props.description) ? React.createElement(Text, { dataSet: { part: 'description' }, style: [{ color: ctx.color('card_label'), marginTop: gap }, ctx.typeStyle('card_description')] }, props.description) : null),
        headerActions ? actions : null));
    const body = React.createElement(View, { dataSet: { part: 'content' }, style: { paddingBottom: pad, paddingEnd: pad, paddingStart: pad, paddingTop: ctx.metric('Card', 'paddingBodyTop') } },
      Utils.isString(props.children) ? React.createElement(Text, { style: [{ color: ctx.color('card_label') }, ctx.typeStyle('card_body')] }, props.children) : props.children);
    // The productive footer's buttons are ghost md, secondary then primary,
    // then the actions; spread apart with a button, at the end without
    // (`CardFooter.js:28-42`, `_productive-card.scss` `__footer`)
    const primary = Utils.isString(props.primaryButtonText)
      ? React.createElement(ctx.Registry.Button, { children: props.primaryButtonText, key: 'primary', kind: 'ghost', onPress: props.onPrimaryButtonClick, size: 'md' })
      : null;
    const secondary = Utils.isString(props.secondaryButtonText)
      ? React.createElement(ctx.Registry.Button, { children: props.secondaryButtonText, key: 'secondary', kind: 'ghost', onPress: props.onSecondaryButtonClick, size: 'md' })
      : null;
    const hasButton = primary !== null || secondary !== null;
    const footer = (!atTop && actions !== null) || hasButton
      ? React.createElement(View, { dataSet: { part: 'footer' }, style: { alignItems: 'center', borderTopColor: ctx.color('card_divider'), borderTopWidth: ctx.metric('Card', 'dividerWidth'), flexDirection: 'row', justifyContent: hasButton ? 'space-between' : 'flex-end' } },
        secondary, primary, atTop ? null : actions)
      : null;
    const state = button.state;
    const card = React.createElement(View, {
      dataSet: { part: 'root' },
      style: {
        backgroundColor: interactive && state.hovered === true ? ctx.color('card_container_hover') : ctx.color('card_container'),
        borderColor: interactive ? ctx.color('card_outline_clickable') : 'transparent',
        borderWidth: ctx.metric('Card', 'borderWidth')
      },
      testID: props.testID
    }, header, body, footer);
    if (!zoneOne) {
      return card;
    }
    // Upstream puts role="button" on a div that may hold the action buttons
    // (`Card.js:29-34,166`); react-native-web draws any button role as a
    // `<button>`, and a `<button>` may not hold another, so a card that holds
    // controls is a focusable group with the same press, keys and ring
    const holdsControls = actions !== null || primary !== null || secondary !== null;
    const focused = state.focused === true;
    return React.createElement(Pressable, Object.assign({}, button.rootProps, {
      accessibilityLabel: undefined,
      accessibilityRole: holdsControls ? 'group' : 'button',
      'aria-disabled': disabled || undefined,
      // The zone is the card's own box: a `<button>` would otherwise shrink
      // to its content
      style: [{ width: '100%' }, focused ? {
        outlineColor: ctx.color('card_focus'),
        outlineStyle: 'solid',
        outlineWidth: ctx.metric('Card', 'focusWidth')
      } : null]
    }), card);
  }

  CardComponent.displayName = 'Card';
  return CardComponent;
}
Card.spec = SPEC;
