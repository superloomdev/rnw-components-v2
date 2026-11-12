// Info: PageHeader sample states for the showcase, the browser gates
// and the docs. Mirrors `recipes/probe/PageHeader.mount.js`: the same rows
// per state and the same texts.
// The header fills its container (`inline-size: 100%`), the probe's 1280
export const FRAME = Object.freeze({ width: 1280 });
const CRUMBS = [{ label: 'Breadcrumb 1', href: '#' }, { label: 'Breadcrumb 2', href: '#' }];
const ACTIONS = [{ kind: 'secondary', label: 'Secondary button' }, { kind: 'primary', label: 'Primary button' }];
const TAGS = [{ label: 'Tag one', type: 'blue' }, { label: 'Tag two', type: 'green' }];
const SUBTITLE = 'Optional subtitle if necessary';
const TITLE = 'Page title';
export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ breadcrumbs: CRUMBS, pageActions: ACTIONS, subtitle: SUBTITLE, tags: TAGS, title: TITLE }) }),
  Object.freeze({ label: 'title', props: Object.freeze({ title: TITLE }) }),
  Object.freeze({ label: 'breadcrumbs', props: Object.freeze({ breadcrumbs: CRUMBS, title: TITLE }) }),
  Object.freeze({ label: 'subtitle', props: Object.freeze({ subtitle: SUBTITLE, title: TITLE }) }),
  Object.freeze({ label: 'actions', props: Object.freeze({ pageActions: ACTIONS, title: TITLE }) }),
  Object.freeze({ label: 'children', props: Object.freeze({ children: 'Available row content', title: TITLE }) }),
  Object.freeze({ label: 'tags', props: Object.freeze({ tags: TAGS, title: TITLE }) }),
  Object.freeze({ label: 'icon', props: Object.freeze({ title: TITLE, titleIcon: 'document' }) })
]);
