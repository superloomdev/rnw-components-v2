// Info: SideNavDetails member. A block of details in the side navigation:
// `control.side_nav_items_padding_top` above and below and
// `control.side_nav_link_padding_inline` in from each side, a level-2
// heading in `type.side_nav_menu_title` and
// `color.side_nav_link_label_selected`, then the children (a string in
// `type.side_nav_menu_link` and `color.side_nav_link_label`). The pinned
// upstream stylesheet has no rule for it (`notes.md`, `no_reference`). It
// must be composed inside SideNav.

import SPEC from './spec.side-nav-details.js';


/********************************************************************
SideNavDetails factory.

@param {Object} ctx - Component context

@return {Function} - The SideNavDetails component
*********************************************************************/
export default function SideNavDetails (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Text, View } = ctx.ReactNative;


  /********************************************************************
  SideNavDetails component.

  @param {Object} props - See `api.side-nav-details.js`

  @return {Object} - React element
  *********************************************************************/
  function SideNavDetailsComponent (props) {

    return React.createElement(View, {
      style: { paddingHorizontal: ctx.metric('SideNavDetails', 'paddingInline'), paddingVertical: ctx.metric('SideNavDetails', 'paddingBlock') }
    },
    React.createElement(Text, {
      'aria-level': 2,
      dir: 'auto',
      key: 'title',
      numberOfLines: 1,
      role: 'heading',
      style: [ctx.typeStyle('side_nav_menu_title'), { color: ctx.color('side_nav_link_label_selected') }]
    }, props.title),
    Utils.isString(props.children)
      ? React.createElement(Text, { dir: 'auto', key: 'text', style: [ctx.typeStyle('side_nav_menu_link'), { color: ctx.color('side_nav_link_label') }] }, props.children)
      : props.children);

  }

  SideNavDetailsComponent.displayName = 'SideNavDetails';

  return SideNavDetailsComponent;

}

SideNavDetails.spec = SPEC;
