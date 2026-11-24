// Info: The contexts the side navigation's members share. Module-level so
// every factory shares one React context instance each. The navigation
// context carries the open state and the rail (a link takes focus only
// while the navigation is open or a rail, `SideNavLink.tsx` `tabIndex`),
// `large` from an enclosing item, whether an item already holds it, the
// menu a link sits in and a closed rail; the link context carries what a
// link's text draws: current, hovered, in a menu, in a closed rail.
let navigationContext = null;
let linkContext = null;

export function createNavigationContext (ctx) {
  if (navigationContext === null) {
    navigationContext = ctx.React.createContext(Object.freeze({ collapsed: false, expanded: true, hasIcon: false, inItem: false, inMenu: false, isRail: false, large: false }));
  }
  return navigationContext;
}

export function createLinkContext (ctx) {
  if (linkContext === null) {
    linkContext = ctx.React.createContext(Object.freeze({ collapsed: false, current: false, hovered: false, inMenu: false }));
  }
  return linkContext;
}
