// Info: SideNavItems member. The side navigation's list
// (`ui-shell/side-nav/_side-nav.scss:130-144`):
// `control.side_nav_items_padding_top` above its members, growing into the
// navigation's height. It draws its `items` (links, menus, dividers),
// then its children. It must be composed inside SideNav.

import SPEC from './spec.side-nav-items.js';


/********************************************************************
SideNavItems factory.

@param {Object} ctx - Component context

@return {Function} - The SideNavItems component
*********************************************************************/
export default function SideNavItems (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;


  /********************************************************************
  One entry of `items`: a link, a menu of links, or a divider.

  @param {Object} entry - See `api.side-nav-items.js` `items`
  @param {Number} index - The entry's key

  @return {Object} - React element
  *********************************************************************/
  function entryElement (entry, index) {

    if (entry.divider === true) {
      return React.createElement(ctx.Registry.SideNavDivider, { key: index });
    }
    if (Utils.isArray(entry.items)) {
      return React.createElement(ctx.Registry.SideNavMenu, {
        defaultExpanded: entry.defaultExpanded,
        icon: entry.icon,
        isActive: entry.isActive,
        key: index,
        large: entry.large,
        items: entry.items,
        title: entry.title
      });
    }
    return React.createElement(ctx.Registry.SideNavLink, {
      href: entry.href,
      icon: entry.icon,
      isActive: entry.isActive,
      key: index,
      large: entry.large,
      onPress: entry.onPress
    }, entry.label);

  }


  /********************************************************************
  SideNavItems component.

  @param {Object} props - See `api.side-nav-items.js`

  @return {Object} - React element
  *********************************************************************/
  function SideNavItemsComponent (props) {

    // Upstream's `flex: 1 1 0%` fills the navigation; a content basis
    // that grows keeps the list's own height where the navigation has none
    return React.createElement(View, {
      role: 'list',
      testID: props.testID,
      style: { flexBasis: 'auto', flexGrow: 1, flexShrink: 1, overflow: 'hidden', paddingTop: ctx.metric('SideNavItems', 'paddingTop') }
    }, Utils.isArray(props.items) ? props.items.map(entryElement) : null, props.children);

  }

  SideNavItemsComponent.displayName = 'SideNavItems';

  return SideNavItemsComponent;

}

SideNavItems.spec = SPEC;
