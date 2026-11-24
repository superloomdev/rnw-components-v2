// Info: HeaderSideNavItems sample states for the showcase, the browser
// gates and the docs. `requires_parent`: each state mounts in an expanded
// SideNav, staged at the body's top as the reference stages upstream's
// fixed one. The list is drawn below lg only; from lg the navigation draws
// without it, as upstream's `display: none` list does. Mirrors
// `recipes/probe/HeaderSideNavItems.mount.js`.

import { LINKS } from './sample.header.js';

export const FRAME = Object.freeze({ width: 320, height: 240, stage: true });

const IN_SIDE_NAV = Object.freeze([
  Object.freeze({ component: 'SideNav', props: Object.freeze({ expanded: true }), referenceProps: Object.freeze({ style: Object.freeze({ insetBlockStart: 0 }) }) })
]);

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ items: LINKS }), wrappers: IN_SIDE_NAV }),
  Object.freeze({ label: 'divider', props: Object.freeze({ hasDivider: true, items: LINKS }), wrappers: IN_SIDE_NAV })
]);
