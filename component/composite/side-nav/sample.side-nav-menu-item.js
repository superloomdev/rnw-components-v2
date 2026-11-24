// Info: SideNavMenuItem sample states for the showcase, the browser gates
// and the docs. `requires_parent`: each state mounts in an open SideNavMenu.
// Mirrors `recipes/probe/SideNavMenuItem.mount.js`: at rest and current.

import { IN_NAV } from './sample.side-nav.js';

export const FRAME = Object.freeze({ width: 320, height: 200, stage: true });

const IN_MENU = Object.freeze(IN_NAV.concat([Object.freeze({ component: 'SideNavMenu', props: Object.freeze({ defaultExpanded: true, title: 'Resources' }) })]));

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ children: 'Compute', href: '#compute' }), wrappers: IN_MENU }),
  Object.freeze({ label: 'current', props: Object.freeze({ children: 'Compute', href: '#compute', isActive: true }), wrappers: IN_MENU })
]);
