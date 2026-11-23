// Info: HeaderMenu sample states for the showcase, the browser gates and
// the docs. `requires_parent`: each state mounts in a Header's menu bar.
// Mirrors `recipes/probe/HeaderMenu.mount.js`: closed, closed holding the
// current link (its title draws current), open, and open holding it (the
// current row's fill and side bar). The reference presses the title open.

export const FRAME = Object.freeze({ width: 800, height: 240, stage: true });

const IN_BAR = Object.freeze([
  Object.freeze({ component: 'Header', props: Object.freeze({}) }),
  Object.freeze({ component: 'HeaderNavigation', props: Object.freeze({}) })
]);
const ITEMS = Object.freeze([
  Object.freeze({ label: 'Compute', href: '#compute' }),
  Object.freeze({ label: 'Storage', href: '#storage' }),
  Object.freeze({ label: 'Network', href: '#network' })
]);
const CURRENT = Object.freeze([ITEMS[0], Object.freeze({ label: 'Storage', href: '#storage', isActive: true }), ITEMS[2]]);

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ menuLinkName: 'Products', items: ITEMS }), wrappers: IN_BAR }),
  Object.freeze({ label: 'current', props: Object.freeze({ menuLinkName: 'Products', items: CURRENT }), wrappers: IN_BAR }),
  Object.freeze({ label: 'open', props: Object.freeze({ menuLinkName: 'Products', items: ITEMS }), wrappers: IN_BAR }),
  Object.freeze({ label: 'openCurrent', props: Object.freeze({ menuLinkName: 'Products', items: CURRENT }), wrappers: IN_BAR })
]);
