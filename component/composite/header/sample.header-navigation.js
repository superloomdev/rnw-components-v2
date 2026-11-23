// Info: HeaderNavigation sample states for the showcase, the browser gates
// and the docs. `requires_parent`: each state mounts inside a Header. The
// menu bar is drawn from lg only, so its states are drawn at the primary
// window; below lg the Header's own narrow set shows it gone.

import { LINKS } from './sample.header.js';

export const FRAME = Object.freeze({ width: 800, height: 240, stage: true });

const IN_HEADER = Object.freeze([Object.freeze({ component: 'Header', props: Object.freeze({}) })]);
const MENU = Object.freeze({
  label: 'Products',
  items: Object.freeze([
    Object.freeze({ label: 'Compute', href: '#compute' }),
    Object.freeze({ label: 'Storage', href: '#storage' })
  ])
});

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ accessibilityLabel: 'Acme Platform', items: LINKS }), wrappers: IN_HEADER }),
  Object.freeze({ label: 'withMenu', props: Object.freeze({ accessibilityLabel: 'Acme Platform', items: Object.freeze([LINKS[0], MENU]) }), wrappers: IN_HEADER })
]);
