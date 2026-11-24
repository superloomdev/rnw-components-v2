// Info: SideNavFooter sample states for the showcase, the browser gates and
// the docs. `requires_parent`: each state mounts in a SideNav: collapsed
// (the chevron) and expanded (the close glyph).

export const FRAME = Object.freeze({ width: 320, height: 200, stage: true });

const IN_NAV = Object.freeze([Object.freeze({ component: 'SideNav', props: Object.freeze({}) })]);

export default Object.freeze([
  Object.freeze({ label: 'collapsed', props: Object.freeze({ expanded: false }), wrappers: IN_NAV }),
  Object.freeze({ label: 'expanded', props: Object.freeze({ expanded: true }), wrappers: IN_NAV })
]);
