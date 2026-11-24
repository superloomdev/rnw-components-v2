// Info: SideNavItems sample state for the showcase, the browser gates and
// the docs. `requires_parent`: it mounts in a SideNav. Mirrors
// `recipes/probe/SideNavItems.mount.js`: the list holding three links.

import { IN_OPEN_NAV, LINKS } from './sample.side-nav.js';

export const FRAME = Object.freeze({ width: 320, height: 200, stage: true });


export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ items: LINKS }), wrappers: IN_OPEN_NAV })
]);
