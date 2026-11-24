// Info: SideNavFooter sample states for the showcase, the browser gates and
// the docs. `requires_parent`: each state mounts in an open SideNav: collapsed
// (the chevron) and expanded (the close glyph).

import { IN_OPEN_NAV } from './sample.side-nav.js';

export const FRAME = Object.freeze({ width: 320, height: 200, stage: true });

export default Object.freeze([
  Object.freeze({ label: 'collapsed', props: Object.freeze({ expanded: false }), wrappers: IN_OPEN_NAV }),
  Object.freeze({ label: 'expanded', props: Object.freeze({ expanded: true }), wrappers: IN_OPEN_NAV })
]);
