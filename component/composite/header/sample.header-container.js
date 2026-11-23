// Info: HeaderContainer sample states for the showcase, the browser gates
// and the docs. The container draws its `header`: a collapsible menu
// button and the name, the side navigation collapsed and expanded (the
// button active).

export const FRAME = Object.freeze({ width: 800, height: 120, stage: true });

const HEADER = Object.freeze({
  accessibilityLabel: 'Acme Platform',
  menuButton: Object.freeze({ label: 'Open menu', isCollapsible: true }),
  name: Object.freeze({ prefix: 'Acme', label: 'Platform', href: '#' })
});

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ header: HEADER }) }),
  Object.freeze({ label: 'expanded', props: Object.freeze({ header: HEADER, isSideNavExpanded: true }) })
]);
