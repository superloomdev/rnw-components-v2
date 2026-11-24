// Info: SideNavItems sample state for the showcase, the browser gates and
// the docs. `requires_parent`: it mounts in a SideNav. Mirrors
// `recipes/probe/SideNavItems.mount.js`: the list holding three links.

import { LINKS } from './sample.side-nav.js';

export const FRAME = Object.freeze({ width: 320, height: 200, stage: true });

const IN_NAV = Object.freeze([
  Object.freeze({ component: 'SideNav', props: Object.freeze({}), referenceProps: Object.freeze({ style: Object.freeze({ insetBlockStart: 0 }) }) })
]);

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ items: LINKS }), wrappers: IN_NAV })
]);
