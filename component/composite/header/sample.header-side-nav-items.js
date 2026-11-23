// Info: HeaderSideNavItems sample states for the showcase, the browser
// gates and the docs. The list is drawn below lg only; from lg the cell
// keeps an empty View, so the state is mounted and draws nothing, as
// upstream's `display: none` list does.

import { LINKS } from './sample.header.js';

export const FRAME = Object.freeze({ width: 320 });

const HOLDER = Object.freeze([Object.freeze({ component: 'View', props: Object.freeze({}), reference: false })]);

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ items: LINKS }), wrappers: HOLDER }),
  Object.freeze({ label: 'divider', props: Object.freeze({ hasDivider: true, items: LINKS }), wrappers: HOLDER })
]);
