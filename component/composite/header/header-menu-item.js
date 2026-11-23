// Info: HeaderMenuItem member. One `li` of the header's menu bar holding a
// link: the bar's height, `control.header_menu_item_padding_inline` on both
// sides, a `control.header_menu_item_focus_width` border drawn in
// `color.focus` under focus, the `type.header_menu_item` label truncated at
// its end in `color.header_menu_item_label` (`_hover`, `_active`) over
// `color.header_menu_item_container` (`_hover`, `_active`). The current
// page (`isActive`) sets `aria-current` and draws the
// `control.header_menu_item_indicator_width` bar in
// `color.header_menu_item_indicator` under the link, across its border.
// In an open HeaderMenu (`inMenu`) the row is
// `control.header_menu_item_height` tall on the menu's fills and its
// current row draws the bar at its start; in HeaderSideNavItems
// (`stacked`) the line is as tall as its text. It must be composed inside
// Header, in HeaderNavigation, HeaderMenu or HeaderSideNavItems.

import SPEC from './spec.header-menu-item.js';


/********************************************************************
HeaderMenuItem factory.

@param {Object} ctx - Component context

@return {Function} - The HeaderMenuItem component
*********************************************************************/
export default function HeaderMenuItem (ctx) {

  const React = ctx.React;
  const { Pressable, Text, View } = ctx.ReactNative;
  const { useInteractionState } = ctx.behaviors;


  /********************************************************************
  HeaderMenuItem component.

  @param {Object} props - See `api.header-menu-item.js`

  @return {Object} - React element
  *********************************************************************/
  function HeaderMenuItemComponent (props) {

    // Init the interaction state and the cells the link reads
    const interaction = useInteractionState({ onPress: props.onPress, onBlur: props.onBlur });
    const state = interaction.state;
    const focusWidth = ctx.metric('HeaderMenuItem', 'focusWidth');
    const indicatorWidth = ctx.metric('HeaderMenuItem', 'indicatorWidth');
    const inMenu = props.inMenu === true;
    const stacked = props.stacked === true;
    // Upstream's current class is `isActive` with any `aria-current` but `page`
    const current = props.isActive === true && props['aria-current'] !== 'page';
    const ariaCurrent = current ? 'true' : props['aria-current'];

    // The fill: the menu's own fills inside an open menu, the bar's outside
    // (`_header.scss:246,264-275,383-416`)
    const phase = state.pressed ? 'active' : state.hovered ? 'hover' : 'enabled';
    let fill;
    if (inMenu && current) {
      fill = ctx.color(phase === 'hover' ? 'header_submenu_item_container_selected_hover' : 'header_submenu_item_container_selected');
    } else if (inMenu) {
      fill = phase === 'enabled' ? ctx.color('header_menu_container') : ctx.color(ctx.stateLeaf('header_submenu_item_container', phase));
    } else {
      fill = ctx.color(ctx.stateLeaf('header_menu_item_container', phase));
    }

    // The current page's bar crosses the link's border: under it in the
    // bar, at its start in a menu (`_header.scss:299-334`)
    const indicator = current ? React.createElement(View, {
      'aria-hidden': true,
      key: 'indicator',
      style: Object.assign({ backgroundColor: ctx.color('header_menu_item_indicator'), position: 'absolute', start: -focusWidth }, inMenu || stacked
        ? { bottom: -focusWidth, top: -focusWidth, width: indicatorWidth }
        : { bottom: -focusWidth, end: -focusWidth, height: indicatorWidth })
    }) : null;

    // Render the `li` and its link
    return React.createElement(View, {
      role: 'listitem',
      style: { alignSelf: inMenu || stacked ? 'stretch' : undefined, flexDirection: 'row' }
    },
    React.createElement(Pressable, Object.assign({}, interaction.rootProps, {
      'aria-current': ariaCurrent,
      accessibilityRole: 'link',
      href: props.href,
      ref: props.itemRef,
      testID: props.testID,
      style: {
        alignItems: 'center',
        backgroundColor: fill,
        borderColor: state.focused ? ctx.color('focus') : 'transparent',
        borderWidth: focusWidth,
        flexDirection: 'row',
        flexGrow: 1,
        height: inMenu ? ctx.metric('HeaderMenuItem', 'menuItemHeight') : undefined,
        outlineStyle: 'none',
        paddingHorizontal: ctx.metric('HeaderMenuItem', 'paddingInline'),
        position: 'relative'
      }
    }),
    React.createElement(Text, {
      dir: 'auto',
      key: 'label',
      numberOfLines: 1,
      style: [ctx.typeStyle('header_menu_item'), {
        color: ctx.color(state.pressed ? 'header_menu_item_label_active' : state.hovered ? 'header_menu_item_label_hover' : 'header_menu_item_label')
      }]
    }, props.children),
    indicator));

  }

  HeaderMenuItemComponent.displayName = 'HeaderMenuItem';

  return HeaderMenuItemComponent;

}

HeaderMenuItem.spec = SPEC;
