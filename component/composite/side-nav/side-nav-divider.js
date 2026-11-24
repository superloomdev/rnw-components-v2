// Info: SideNavDivider member. A rule between the side navigation's
// members (`ui-shell/side-nav/_side-nav.scss:192-201`): `border.width_01`
// tall in `color.side_nav_divider`, `control.side_nav_divider_margin_block`
// above and below and `control.side_nav_divider_inset` in from each side.
// It must be composed inside SideNav.

import SPEC from './spec.side-nav-divider.js';


/********************************************************************
SideNavDivider factory.

@param {Object} ctx - Component context

@return {Function} - The SideNavDivider component
*********************************************************************/
export default function SideNavDivider (ctx) {

  const React = ctx.React;
  const { View } = ctx.ReactNative;


  /********************************************************************
  SideNavDivider component.

  @return {Object} - React element
  *********************************************************************/
  function SideNavDividerComponent () {

    return React.createElement(View, {
      role: 'separator',
      style: {
        backgroundColor: ctx.color('side_nav_divider'),
        height: ctx.metric('SideNavDivider', 'width'),
        marginHorizontal: ctx.metric('SideNavDivider', 'inset'),
        marginVertical: ctx.metric('SideNavDivider', 'marginBlock')
      }
    });

  }

  SideNavDividerComponent.displayName = 'SideNavDivider';

  return SideNavDividerComponent;

}

SideNavDivider.spec = SPEC;
