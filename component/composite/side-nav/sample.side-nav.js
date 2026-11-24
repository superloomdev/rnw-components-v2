// Info: SideNav sample states for the showcase, the browser gates and the
// docs. Mirrors `recipes/probe/SideNav.mount.js`: one state per drawn
// width and overlay (`notes.md`, the window rules and the outcomes). Each
// state mounts in a row of the frame's height, as a host lays the
// navigation beside its page.

export const FRAME = Object.freeze({ width: 320, height: 320, stage: true });

export const LINKS = Object.freeze([
  Object.freeze({ label: 'Dashboard', href: '#dashboard', icon: 'home' }),
  Object.freeze({ label: 'Documents', href: '#documents', icon: 'document', isActive: true }),
  Object.freeze({ label: 'Settings', href: '#settings', icon: 'settings' })
]);
export const MENU = Object.freeze({
  title: 'Resources',
  icon: 'cube',
  items: Object.freeze([
    Object.freeze({ label: 'Compute', href: '#compute' }),
    Object.freeze({ label: 'Storage', href: '#storage' }),
    Object.freeze({ label: 'Network', href: '#network' })
  ])
});
export const NAVIGATION = Object.freeze([LINKS[0], LINKS[1], MENU, Object.freeze({ divider: true }), LINKS[2]]);

// A member's states mount in the navigation, staged at the body's top as
// the reference stages upstream's fixed one, and in its list
export const IN_NAV = Object.freeze([
  Object.freeze({ component: 'SideNav', props: Object.freeze({}), referenceProps: Object.freeze({ style: Object.freeze({ insetBlockStart: 0 }) }) }),
  Object.freeze({ component: 'SideNavItems', props: Object.freeze({}) })
]);

const ROW = Object.freeze([Object.freeze({ component: 'View', props: Object.freeze({ style: Object.freeze({ flexDirection: 'row', height: 320 }) }), reference: false })]);

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ items: NAVIGATION }), wrappers: ROW }),
  Object.freeze({ label: 'expanded', props: Object.freeze({ expanded: true, items: NAVIGATION }), wrappers: ROW }),
  Object.freeze({ label: 'rail', props: Object.freeze({ isRail: true, items: NAVIGATION }), wrappers: ROW }),
  Object.freeze({ label: 'railExpanded', props: Object.freeze({ expanded: true, isRail: true, items: NAVIGATION }), wrappers: ROW }),
  Object.freeze({ label: 'hidden', props: Object.freeze({ isPersistent: false, items: NAVIGATION }), wrappers: ROW }),
  Object.freeze({ label: 'fixed', props: Object.freeze({ isFixedNav: true, items: NAVIGATION }), wrappers: ROW }),
  Object.freeze({ label: 'fixedExpanded', props: Object.freeze({ expanded: true, isFixedNav: true, items: NAVIGATION }), wrappers: ROW })
]);
