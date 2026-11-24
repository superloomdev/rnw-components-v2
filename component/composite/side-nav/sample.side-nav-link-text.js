// Info: SideNavLinkText sample states for the showcase, the browser gates
// and the docs. `requires_parent`: each state mounts in a SideNavLink (a
// SideNavMenuItem in an open SideNavMenu for `inMenu`). Mirrors
// `recipes/probe/SideNavLinkText.mount.js`: at rest, current, truncated,
// and in a menu.

import { IN_NAV } from './sample.side-nav.js';

export const FRAME = Object.freeze({ width: 320, height: 200, stage: true });

function inLink (props) {
  return Object.freeze(IN_NAV.concat([Object.freeze({ component: 'SideNavLink', props: Object.freeze(props) })]));
}

const IN_MENU = Object.freeze(IN_NAV.concat([
  Object.freeze({ component: 'SideNavMenu', props: Object.freeze({ defaultExpanded: true, title: 'Resources' }) }),
  Object.freeze({ component: 'SideNavMenuItem', props: Object.freeze({ href: '#compute' }) })
]));

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ children: 'Dashboard' }), wrappers: inLink({ href: '#dashboard' }) }),
  Object.freeze({ label: 'current', props: Object.freeze({ children: 'Dashboard' }), wrappers: inLink({ href: '#dashboard', isActive: true }) }),
  Object.freeze({ label: 'long', props: Object.freeze({ children: 'Infrastructure monitoring and alert history' }), wrappers: inLink({ href: '#monitoring' }) }),
  Object.freeze({ label: 'inMenu', props: Object.freeze({ children: 'Compute' }), wrappers: IN_MENU })
]);
