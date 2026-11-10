// Info: PageHeader sample states for the showcase, the browser gates
// and the docs. Mirrors `recipes/probe/PageHeader.mount.js`.
const CRUMBS = [{ label: 'Home', href: '#' }, { label: 'Library', href: '#' }];
const ACTIONS = [{ label: 'Create' }, { label: 'Edit' }];
export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ breadcrumbs: CRUMBS, pageActions: ACTIONS, subtitle: 'Description text', title: 'Page title' }) }),
  Object.freeze({ label: 'collapsed', props: Object.freeze({ breadcrumbs: CRUMBS, collapseHeader: true, pageActions: ACTIONS, subtitle: 'Description text', title: 'Page title' }) }),
  Object.freeze({ label: 'tags', props: Object.freeze({ breadcrumbs: CRUMBS, pageActions: ACTIONS, subtitle: 'Description text', tags: [{ label: 'tag-one' }, { label: 'tag-two' }], title: 'Page title' }) }),
  Object.freeze({ label: 'noBreadcrumbs', props: Object.freeze({ pageActions: ACTIONS, subtitle: 'Description text', title: 'Page title' }) }),
  Object.freeze({ label: 'icon', props: Object.freeze({ breadcrumbs: CRUMBS, pageActions: ACTIONS, subtitle: 'Description text', title: 'Page title', titleIcon: 'accessibility' }) })
]);
