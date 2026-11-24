// Info: SideNavIcon sample state for the showcase, the browser gates and
// the docs. `requires_parent`: it mounts alone in an item of a SideNav's
// list, where its box spans the item (`notes.md`). Mirrors
// `recipes/probe/SideNavIcon.mount.js`. In a row it is drawn by
// SideNavLink `icon` and SideNavMenu `active`, `openIcon`.

import { IN_NAV } from './sample.side-nav.js';

export const FRAME = Object.freeze({ width: 320, height: 200, stage: true });

const IN_ITEM = Object.freeze(IN_NAV.concat([Object.freeze({ component: 'SideNavItem', props: Object.freeze({}) })]));

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ icon: 'home' }), wrappers: IN_ITEM })
]);
