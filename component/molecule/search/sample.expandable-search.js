// Info: ExpandableSearch sample states for the showcase, the browser gates
// and the docs: collapsed, expanded, filled expanded and disabled
// collapsed.

// The expanded field fills the width its container gives it, so the
// showcase, the walker and the browser gates lay its states out in a frame
// of this width
export const FRAME = Object.freeze({ width: 320 });

export default Object.freeze([
  Object.freeze({ label: 'collapsed', props: Object.freeze({ label: 'Search' }) }),
  Object.freeze({ label: 'expanded', props: Object.freeze({ label: 'Search', expanded: true }) }),
  Object.freeze({ label: 'filled expanded', props: Object.freeze({ label: 'Search', value: 'Query', expanded: true }) }),
  Object.freeze({ label: 'disabled collapsed', props: Object.freeze({ label: 'Search', disabled: true }) })
]);
