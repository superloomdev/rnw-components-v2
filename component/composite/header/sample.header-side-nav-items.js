// Info: HeaderSideNavItems sample states for the showcase, the browser
// gates and the docs. `requires_parent`: each state mounts in an expanded
// standalone SideNav (no overlay), in a host row on the page's `layer_01`
// as SideNav's own states do, so the cell draws at every width; the
// reference mount draws both in upstream's form. The list is drawn below
// lg only; from lg the navigation draws without it, as upstream's
// `display: none` list does. Mirrors
// `recipes/probe/HeaderSideNavItems.mount.js`.

import { LINKS } from './sample.header.js';

export const FRAME = Object.freeze({ width: 320, height: 240, stage: true });

const IN_SIDE_NAV = Object.freeze([
  Object.freeze({ component: 'View', props: Object.freeze({ background: 'layer_01', style: Object.freeze({ flexDirection: 'row', height: 240, overflow: 'hidden' }) }), reference: false }),
  Object.freeze({ component: 'SideNav', props: Object.freeze({ expanded: true, isFixedNav: true }), reference: false })
]);

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ items: LINKS }), wrappers: IN_SIDE_NAV }),
  Object.freeze({ label: 'divider', props: Object.freeze({ hasDivider: true, items: LINKS }), wrappers: IN_SIDE_NAV })
]);
