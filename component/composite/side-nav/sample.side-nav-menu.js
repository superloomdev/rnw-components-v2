// Info: SideNavMenu sample states for the showcase, the browser gates and
// the docs. `requires_parent`: each state mounts in a SideNav's list.
// Mirrors `recipes/probe/SideNavMenu.mount.js`: closed, open, closed
// holding the current link (active, with its icon), open with an icon,
// and large.

import { IN_NAV } from './sample.side-nav.js';

export const FRAME = Object.freeze({ width: 320, height: 200, stage: true });

export const PLAIN = Object.freeze([
  Object.freeze({ label: 'Compute', href: '#compute' }),
  Object.freeze({ label: 'Storage', href: '#storage' })
]);
export const WITH_CURRENT = Object.freeze([
  Object.freeze({ label: 'Compute', href: '#compute' }),
  Object.freeze({ label: 'Storage', href: '#storage', isActive: true })
]);

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ items: PLAIN, title: 'Resources' }), wrappers: IN_NAV }),
  Object.freeze({ label: 'open', props: Object.freeze({ defaultExpanded: true, items: PLAIN, title: 'Resources' }), wrappers: IN_NAV }),
  Object.freeze({ label: 'active', props: Object.freeze({ icon: 'cube', items: WITH_CURRENT, title: 'Resources' }), wrappers: IN_NAV }),
  Object.freeze({ label: 'openIcon', props: Object.freeze({ defaultExpanded: true, icon: 'cube', items: WITH_CURRENT, title: 'Resources' }), wrappers: IN_NAV }),
  Object.freeze({ label: 'large', props: Object.freeze({ items: PLAIN, large: true, title: 'Resources' }), wrappers: IN_NAV })
]);
