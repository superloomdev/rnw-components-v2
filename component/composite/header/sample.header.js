// Info: Header sample states for the showcase, the browser gates and the
// docs. Mirrors `recipes/probe/Header.mount.js`: the bar alone, the shell
// (name, menu bar, global actions), a menu button drawn below lg only and a
// collapsible one drawn at every width (the name then starts closer).

// The bar spans its container (upstream's fixed `inset-inline: 0`); the
// body is staged so the reference's fixed bar draws inside the cell
export const FRAME = Object.freeze({ width: 800, height: 120, stage: true });

export const NAME = Object.freeze({ prefix: 'Acme', label: 'Platform', href: '#' });
export const LINKS = Object.freeze([
  Object.freeze({ label: 'Catalog', href: '#catalog' }),
  Object.freeze({ label: 'Docs', href: '#docs', isActive: true }),
  Object.freeze({ label: 'Support', href: '#support' })
]);
export const ACTIONS = Object.freeze([
  Object.freeze({ icon: 'search', label: 'Search' }),
  Object.freeze({ icon: 'notification', label: 'Notifications' }),
  Object.freeze({ icon: 'user', label: 'Account' })
]);
const SHELL = Object.freeze({
  accessibilityLabel: 'Acme Platform',
  name: NAME,
  navigation: Object.freeze({ accessibilityLabel: 'Acme Platform', items: LINKS }),
  actions: ACTIONS
});

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ accessibilityLabel: 'Acme Platform' }) }),
  Object.freeze({ label: 'shell', props: SHELL }),
  Object.freeze({ label: 'menuButton', props: Object.freeze(Object.assign({}, SHELL, { menuButton: Object.freeze({ label: 'Open menu' }) })) }),
  Object.freeze({ label: 'collapsible', props: Object.freeze(Object.assign({}, SHELL, { menuButton: Object.freeze({ label: 'Open menu', isCollapsible: true }) })) })
]);
