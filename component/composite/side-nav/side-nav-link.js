// Info: SideNavLink member. One item of the side navigation holding a link
// (`SideNavLink.tsx`): a SideNavItem around the link
// `side-nav-link-parts.js` draws, with an optional SideNavIcon before the
// text. It takes focus only while the navigation is open or a rail
// (`SideNavLink.tsx` `tabIndex`). It must be composed inside SideNav.

import SPEC from './spec.side-nav-link.js';
import { createNavigationContext } from './side-nav-context.js';
import sideNavLinkElement from './side-nav-link-parts.js';


/********************************************************************
SideNavLink factory.

@param {Object} ctx - Component context

@return {Function} - The SideNavLink component
*********************************************************************/
export default function SideNavLink (ctx) {

  const React = ctx.React;
  const { useInteractionState } = ctx.behaviors;
  const NavigationContext = createNavigationContext(ctx);


  /********************************************************************
  The link inside its item, under the item's `large`.

  @param {Object} props - The SideNavLink props

  @return {Object} - React element
  *********************************************************************/
  function Link (props) {

    const navigation = React.useContext(NavigationContext);
    const interaction = useInteractionState({ onPress: props.onPress });
    return sideNavLinkElement(ctx, interaction, {
      children: props.children,
      current: props.isActive === true,
      href: props.href,
      icon: props.icon,
      name: 'SideNavLink',
      navigation: navigation,
      testID: props.testID
    });

  }


  /********************************************************************
  SideNavLink component.

  @param {Object} props - See `api.side-nav-link.js`

  @return {Object} - React element
  *********************************************************************/
  function SideNavLinkComponent (props) {

    return React.createElement(ctx.Registry.SideNavItem, { large: props.large },
      React.createElement(Link, props));

  }

  SideNavLinkComponent.displayName = 'SideNavLink';

  return SideNavLinkComponent;

}

SideNavLink.spec = SPEC;
