// Info: SideNavLink sample states for the showcase, the browser gates and
// the docs. `requires_parent`: each state mounts in a SideNav's list.
// Mirrors `recipes/probe/SideNavLink.mount.js`: at rest, current, with an
// icon (at rest and current), large, and inside a large item.

import { IN_NAV } from './sample.side-nav.js';

export const FRAME = Object.freeze({ width: 320, height: 200, stage: true });

const IN_LARGE_ITEM = Object.freeze(IN_NAV.concat([Object.freeze({ component: 'SideNavItem', props: Object.freeze({ large: true }) })]));

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ children: 'Dashboard', href: '#dashboard' }), wrappers: IN_NAV }),
  Object.freeze({ label: 'current', props: Object.freeze({ children: 'Dashboard', href: '#dashboard', isActive: true }), wrappers: IN_NAV }),
  Object.freeze({ label: 'icon', props: Object.freeze({ children: 'Dashboard', href: '#dashboard', icon: 'home' }), wrappers: IN_NAV }),
  Object.freeze({ label: 'iconCurrent', props: Object.freeze({ children: 'Dashboard', href: '#dashboard', icon: 'home', isActive: true }), wrappers: IN_NAV }),
  Object.freeze({ label: 'large', props: Object.freeze({ children: 'Dashboard', href: '#dashboard', large: true }), wrappers: IN_NAV }),
  Object.freeze({ label: 'inLargeItem', props: Object.freeze({ children: 'Dashboard', href: '#dashboard' }), wrappers: IN_LARGE_ITEM })
]);
