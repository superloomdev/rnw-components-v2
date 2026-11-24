// Info: SideNavDetails sample state for the showcase, the browser gates and
// the docs. `requires_parent`: it mounts in a SideNav.

export const FRAME = Object.freeze({ width: 320, height: 200, stage: true });

const IN_NAV = Object.freeze([Object.freeze({ component: 'SideNav', props: Object.freeze({}) })]);

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ children: 'Acme production', title: 'Workspace' }), wrappers: IN_NAV })
]);
