// Info: SideNavDetails sample state for the showcase, the browser gates and
// the docs. `requires_parent`: it mounts in an open SideNav.

import { IN_OPEN_NAV } from './sample.side-nav.js';

export const FRAME = Object.freeze({ width: 320, height: 200, stage: true });

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ children: 'Acme production', title: 'Workspace' }), wrappers: IN_OPEN_NAV })
]);
