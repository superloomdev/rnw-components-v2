// Info: HeaderName sample states for the showcase, the browser gates and
// the docs. `requires_parent`: each state mounts inside a Header. Mirrors
// `recipes/probe/HeaderName.mount.js`.

export const FRAME = Object.freeze({ width: 800, height: 120, stage: true });

const IN_HEADER = Object.freeze([Object.freeze({ component: 'Header', props: Object.freeze({}) })]);

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ children: 'Platform', href: '#', prefix: 'Acme' }), wrappers: IN_HEADER }),
  Object.freeze({ label: 'noPrefix', props: Object.freeze({ children: 'Platform', href: '#' }), wrappers: IN_HEADER })
]);
