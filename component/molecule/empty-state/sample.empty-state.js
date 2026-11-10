// Info: EmptyState sample states for the showcase, the browser gates and
// the docs. Mirrors `recipes/probe/EmptyState.mount.js`.
const ACTION = { kind: 'tertiary', onClick: function () {}, text: 'Create new' };
const LINK = { href: '#', text: 'View documentation' };
export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ action: ACTION, link: LINK, size: 'lg', subtitle: 'Description text', title: 'EmptyState title' }) }),
  Object.freeze({ label: 'small', props: Object.freeze({ action: ACTION, link: LINK, size: 'sm', subtitle: 'Description text', title: 'EmptyState title' }) }),
  Object.freeze({ label: 'actions', props: Object.freeze({ action: ACTION, size: 'lg', subtitle: 'Description text', title: 'EmptyState title' }) }),
  Object.freeze({ label: 'illustration', props: Object.freeze({ action: ACTION, illustration: 'data:,', link: LINK, size: 'lg', subtitle: 'Description text', title: 'EmptyState title' }) }),
  Object.freeze({ label: 'illustrationSmall', props: Object.freeze({ action: ACTION, illustration: 'data:,', link: LINK, size: 'sm', subtitle: 'Description text', title: 'EmptyState title' }) }),
  Object.freeze({ label: 'illustrationLeft', props: Object.freeze({ action: ACTION, illustration: 'data:,', illustrationPosition: 'left', link: LINK, size: 'lg', subtitle: 'Description text', title: 'EmptyState title' }) })
]);
