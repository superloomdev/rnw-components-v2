// Info: SideNavHeader member. A header at the side navigation's top: a row
// `control.side_nav_link_height_large` tall and
// `control.side_nav_link_padding_inline` in from each side, holding a
// SideNavIcon and the text in `type.side_nav_menu_title` and
// `color.side_nav_link_label_selected`. The pinned upstream stylesheet has
// no rule for it (`notes.md`, `no_reference`). It must be composed inside
// SideNav.

import SPEC from './spec.side-nav-header.js';


/********************************************************************
SideNavHeader factory.

@param {Object} ctx - Component context

@return {Function} - The SideNavHeader component
*********************************************************************/
export default function SideNavHeader (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Text, View } = ctx.ReactNative;


  /********************************************************************
  SideNavHeader component.

  @param {Object} props - See `api.side-nav-header.js`

  @return {Object} - React element
  *********************************************************************/
  function SideNavHeaderComponent (props) {

    return React.createElement(View, {
      style: { alignItems: 'center', flexDirection: 'row', minHeight: ctx.metric('SideNavHeader', 'height'), paddingHorizontal: ctx.metric('SideNavHeader', 'paddingInline') }
    },
    React.createElement(ctx.Registry.SideNavIcon, { icon: props.icon, key: 'icon' }),
    Utils.isString(props.children)
      ? React.createElement(Text, { dir: 'auto', key: 'text', numberOfLines: 1, style: [ctx.typeStyle('side_nav_menu_title'), { color: ctx.color('side_nav_link_label_selected'), flexShrink: 1 }] }, props.children)
      : props.children);

  }

  SideNavHeaderComponent.displayName = 'SideNavHeader';

  return SideNavHeaderComponent;

}

SideNavHeader.spec = SPEC;
