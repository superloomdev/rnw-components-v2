// Info: SideNavIcon member. A side navigation icon
// (`ui-shell/side-nav/_side-nav.scss:407-424`): a box with
// `control.side_nav_icon_gap` after it, centering a
// `control.side_nav_icon_size` glyph in `color.side_nav_icon`
// (`color.side_nav_icon_selected` in an active menu, `:296-298`). In a row
// (a link, a menu's button) the box is as wide as its glyph; elsewhere it
// spans its container, as upstream's flex box does outside a flex row. It
// must be composed inside SideNav.

import SPEC from './spec.side-nav-icon.js';


/********************************************************************
SideNavIcon factory.

@param {Object} ctx - Component context

@return {Function} - The SideNavIcon component
*********************************************************************/
export default function SideNavIcon (ctx) {

  const React = ctx.React;
  const { View } = ctx.ReactNative;


  /********************************************************************
  SideNavIcon component.

  @param {Object} props - See `api.side-nav-icon.js`

  @return {Object} - React element
  *********************************************************************/
  function SideNavIconComponent (props) {

    return React.createElement(View, {
      'aria-hidden': true,
      dataSet: { part: 'icon' },
      style: { alignItems: 'center', flexGrow: 0, flexShrink: 0, justifyContent: 'center', marginEnd: ctx.metric('SideNavIcon', 'gap') }
    }, React.createElement(ctx.Registry.Icon, {
      color: props.isSelected === true ? 'side_nav_icon_selected' : 'side_nav_icon',
      name: props.icon,
      size: ctx.metric('SideNavIcon', 'size')
    }));

  }

  SideNavIconComponent.displayName = 'SideNavIcon';

  return SideNavIconComponent;

}

SideNavIcon.spec = SPEC;
