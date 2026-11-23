// Info: HeaderMenuButton sample states for the showcase, the browser gates
// and the docs. `requires_parent`: each state mounts inside a Header.
// Mirrors `recipes/probe/HeaderMenuButton.mount.js`: the toggle that is
// drawn below lg only, the collapsible one at rest and active.

export const FRAME = Object.freeze({ width: 800, height: 120, stage: true });

const IN_HEADER = Object.freeze([Object.freeze({ component: 'Header', props: Object.freeze({}) })]);

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ accessibilityLabel: 'Open menu' }), wrappers: IN_HEADER }),
  Object.freeze({ label: 'collapsible', props: Object.freeze({ accessibilityLabel: 'Open menu', isCollapsible: true }), wrappers: IN_HEADER }),
  Object.freeze({ label: 'active', props: Object.freeze({ accessibilityLabel: 'Close menu', isActive: true, isCollapsible: true }), wrappers: IN_HEADER })
]);
