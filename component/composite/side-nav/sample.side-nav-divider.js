// Info: SideNavDivider sample state for the showcase, the browser gates
// and the docs. `requires_parent`: it mounts in a SideNav's list between
// two links. Mirrors `recipes/probe/SideNavDivider.mount.js`.

import { IN_NAV, LINKS } from './sample.side-nav.js';

export const FRAME = Object.freeze({ width: 320, height: 200, stage: true });

const BETWEEN = Object.freeze([
  IN_NAV[0],
  Object.freeze({ component: 'SideNavItems', props: Object.freeze({ items: Object.freeze([LINKS[0]]) }), referenceProps: Object.freeze({ items: undefined }) })
]);

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({}), wrappers: BETWEEN })
]);
