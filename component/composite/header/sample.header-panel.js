// Info: HeaderPanel sample states for the showcase, the browser gates and
// the docs. `requires_parent`: each state mounts inside a Header. Mirrors
// `recipes/probe/HeaderPanel.mount.js` without the action that opens it:
// expanded and collapsed. The panel hangs under the header to the bottom
// of the staged body, as upstream's fixed panel does in its window.

export const FRAME = Object.freeze({ width: 800, height: 320, stage: true });

const IN_HEADER = Object.freeze([Object.freeze({ component: 'Header', props: Object.freeze({}) })]);

export default Object.freeze([
  Object.freeze({ label: 'expanded', props: Object.freeze({ children: 'Signed in as Ada', expanded: true }), wrappers: IN_HEADER }),
  Object.freeze({ label: 'collapsed', props: Object.freeze({ children: 'Signed in as Ada', expanded: false }), wrappers: IN_HEADER })
]);
