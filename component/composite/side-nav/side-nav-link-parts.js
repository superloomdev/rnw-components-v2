// Info: The link a SideNavLink and a SideNavMenuItem draw
// (`ui-shell/side-nav/_side-nav.scss:314-402`): a row
// `control.side_nav_link_padding_inline` in from each side, at least
// `control.side_nav_link_height` tall (exactly, in a menu), or
// `control.side_nav_link_height_large` in a large item; in a menu its start
// is `control.side_nav_menu_link_padding_start`, after the menu's icon
// `control.side_nav_menu_link_padding_start_icon`. Under the pointer it
// takes `color.side_nav_link_container_hover`, but a current link in a menu
// keeps its fill (`:157-173`); current, `color.side_nav_link_container_selected`
// and the `control.side_nav_indicator_width` bar in
// `color.side_nav_link_indicator` at its start (`:382-402`); focused, a
// `border.width_02` ring in `color.focus` drawn inside its box (`:377-380`).
// The text is drawn by SideNavLinkText from the link context.

import { createLinkContext } from './side-nav-context.js';


/********************************************************************
Build the link element.

@param {Object} ctx         - Component context
@param {Object} interaction - `useInteractionState` result
@param {Object} options     - { navigation, current, href, icon, testID, itemRef, children, name }

@return {Object} - React element
*********************************************************************/
export default function sideNavLinkElement (ctx, interaction, options) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, View } = ctx.ReactNative;
  const LinkContext = createLinkContext(ctx);
  const navigation = options.navigation;
  const name = options.name;
  const state = interaction.state;
  const current = options.current === true;
  const inMenu = navigation.inMenu === true;
  const hovered = state.hovered === true || state.pressed === true;
  const focusWidth = ctx.metric(name, 'focusWidth');

  // The fill (`_side-nav.scss:157-173,325-334,382-386`)
  let fill = 'transparent';
  if (hovered && !(inMenu && current)) {
    fill = ctx.color('side_nav_link_container_hover');
  } else if (current) {
    fill = ctx.color('side_nav_link_container_selected');
  }
  const linkHeight = ctx.metric(name, 'height');
  let paddingStart = ctx.metric(name, 'paddingInline');
  if (inMenu) {
    paddingStart = ctx.metric(name, navigation.hasIcon === true ? 'menuPaddingStartIcon' : 'menuPaddingStart');
  }
  const link = React.createElement(LinkContext.Provider, { value: { collapsed: navigation.collapsed === true, current: current, hovered: hovered, inMenu: inMenu } },
    React.createElement(Pressable, Object.assign({}, interaction.rootProps, {
      'aria-current': current ? 'page' : undefined,
      accessibilityRole: 'link',
      href: options.href,
      ref: options.itemRef,
      tabIndex: navigation.expanded === true || navigation.isRail === true ? 0 : -1,
      testID: options.testID,
      style: {
        alignItems: 'center',
        backgroundColor: fill,
        flexDirection: 'row',
        height: navigation.large === true ? ctx.metric(name, 'heightLarge') : inMenu ? linkHeight : undefined,
        minHeight: linkHeight,
        outlineColor: state.focused ? ctx.color('focus') : undefined,
        outlineOffset: state.focused ? -focusWidth : undefined,
        outlineStyle: state.focused ? 'solid' : 'none',
        outlineWidth: state.focused ? focusWidth : undefined,
        paddingEnd: ctx.metric(name, 'paddingInline'),
        paddingStart: paddingStart,
        position: 'relative'
      }
    }),
    Utils.isString(options.icon) ? React.createElement(ctx.Registry.SideNavIcon, { icon: options.icon, key: 'icon' }) : null,
    Utils.isString(options.children) ? React.createElement(ctx.Registry.SideNavLinkText, { key: 'text' }, options.children) : options.children,
    current ? React.createElement(View, {
      'aria-hidden': true,
      dataSet: { part: 'indicator' },
      key: 'indicator',
      style: { backgroundColor: ctx.color('side_nav_link_indicator'), bottom: 0, position: 'absolute', start: 0, top: 0, width: ctx.metric(name, 'indicatorWidth') }
    }) : null));
  return link;

}
