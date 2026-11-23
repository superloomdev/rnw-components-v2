// Info: HeaderMenuItem sample states for the showcase, the browser gates
// and the docs. `requires_parent`: each state mounts in a Header's menu
// bar. Mirrors `recipes/probe/HeaderMenuItem.mount.js`.

export const FRAME = Object.freeze({ width: 800, height: 120, stage: true });

const IN_BAR = Object.freeze([
  Object.freeze({ component: 'Header', props: Object.freeze({}) }),
  Object.freeze({ component: 'HeaderNavigation', props: Object.freeze({}) })
]);

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ children: 'Catalog', href: '#catalog' }), wrappers: IN_BAR }),
  Object.freeze({ label: 'current', props: Object.freeze({ children: 'Catalog', href: '#catalog', isActive: true }), wrappers: IN_BAR })
]);
