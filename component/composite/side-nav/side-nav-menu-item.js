// Info: SideNavMenuItem member. One link of a SideNavMenu
// (`SideNavMenuItem.tsx`): an item holding the link
// `side-nav-link-parts.js` draws, at the menu's start and height, in the
// menu link's type. It must be composed inside a SideNavMenu.

import SPEC from './spec.side-nav-menu-item.js';
import { createNavigationContext } from './side-nav-context.js';
import sideNavLinkElement from './side-nav-link-parts.js';


/********************************************************************
SideNavMenuItem factory.

@param {Object} ctx - Component context

@return {Function} - The SideNavMenuItem component
*********************************************************************/
export default function SideNavMenuItem (ctx) {

  const React = ctx.React;
  const { View } = ctx.ReactNative;
  const { useInteractionState } = ctx.behaviors;
  const NavigationContext = createNavigationContext(ctx);


  /********************************************************************
  SideNavMenuItem component.

  @param {Object} props - See `api.side-nav-menu-item.js`

  @return {Object} - React element
  *********************************************************************/
  function SideNavMenuItemComponent (props) {

    const navigation = React.useContext(NavigationContext);
    const interaction = useInteractionState({ onPress: props.onPress });
    return React.createElement(View, { role: 'listitem' },
      sideNavLinkElement(ctx, interaction, {
        children: props.children,
        current: props.isActive === true,
        href: props.href,
        name: 'SideNavMenuItem',
        navigation: navigation,
        testID: props.testID
      }));

  }

  SideNavMenuItemComponent.displayName = 'SideNavMenuItem';

  return SideNavMenuItemComponent;

}

SideNavMenuItem.spec = SPEC;
