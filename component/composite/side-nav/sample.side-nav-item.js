// Info: SideNavItem sample state for the showcase, the browser gates and
// the docs. `requires_parent`: it mounts in a SideNav's list. Mirrors
// `recipes/probe/SideNavItem.mount.js`: an item holding text. `large`
// acts on a link inside the item: SideNavLink's `inLargeItem` state.

import { IN_NAV } from './sample.side-nav.js';

export const FRAME = Object.freeze({ width: 320, height: 200, stage: true });

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ children: 'Status: online' }), wrappers: IN_NAV })
]);
