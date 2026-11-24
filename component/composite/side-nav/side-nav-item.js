// Info: SideNavItem member. One item of the side navigation's list
// (`ui-shell/side-nav/_side-nav.scss:146-155`): it clips what it holds; a
// string is drawn in `type.body_compact_01` and `color.side_nav_link_label`,
// the page's type and the navigation's text. `large` makes every link and
// menu inside it the large height (`:259-261,360-362`, descendant rules).
// It must be composed inside SideNav.

import SPEC from './spec.side-nav-item.js';
import { createNavigationContext } from './side-nav-context.js';


/********************************************************************
SideNavItem factory.

@param {Object} ctx - Component context

@return {Function} - The SideNavItem component
*********************************************************************/
export default function SideNavItem (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Text, View } = ctx.ReactNative;
  const NavigationContext = createNavigationContext(ctx);


  /********************************************************************
  SideNavItem component.

  @param {Object} props - See `api.side-nav-item.js`

  @return {Object} - React element
  *********************************************************************/
  function SideNavItemComponent (props) {

    const parent = React.useContext(NavigationContext);
    const large = parent.large === true || props.large === true;
    const context = React.useMemo(function () {
      return Object.freeze(Object.assign({}, parent, { inItem: true, large: large }));
    }, [parent, large]);

    // An item inside an item is not a list item of its own: upstream nests
    // an `li` in an `li` (`SideNavLink.tsx` inside a SideNavItem)
    return React.createElement(NavigationContext.Provider, { value: context },
      React.createElement(View, { role: parent.inItem === true ? undefined : 'listitem', style: { overflow: 'hidden' } },
        Utils.isString(props.children)
          ? React.createElement(Text, { dir: 'auto', style: [ctx.typeStyle('body_compact_01'), { color: ctx.color('side_nav_link_label') }] }, props.children)
          : props.children));

  }

  SideNavItemComponent.displayName = 'SideNavItem';

  return SideNavItemComponent;

}

SideNavItem.spec = SPEC;
