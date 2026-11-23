// Info: HeaderGlobalAction sample states for the showcase, the browser
// gates and the docs. `requires_parent`: each state mounts in a Header's
// global bar. Mirrors `recipes/probe/HeaderGlobalAction.mount.js`.

export const FRAME = Object.freeze({ width: 800, height: 120, stage: true });

const IN_BAR = Object.freeze([
  Object.freeze({ component: 'Header', props: Object.freeze({}) }),
  Object.freeze({ component: 'HeaderGlobalBar', props: Object.freeze({}) })
]);

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ accessibilityLabel: 'Search', icon: 'search', tooltipAlignment: 'end' }), wrappers: IN_BAR }),
  Object.freeze({ label: 'active', props: Object.freeze({ accessibilityLabel: 'Search', icon: 'search', isActive: true, tooltipAlignment: 'end' }), wrappers: IN_BAR })
]);
