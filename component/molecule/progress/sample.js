// Info: ProgressBar sample states for the showcase, the browser gates and
// the docs. Each entry is one rendered instance: a label and the props it
// takes.

// A bar fills the width its container gives it, so the showcase, the
// walker and the browser gates lay its states out in a frame of this width
export const FRAME = Object.freeze({ width: 320 });

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ label: 'Progress', value: 40 }) }),
  Object.freeze({ label: 'no label', props: Object.freeze({ value: 40 }) }),
  Object.freeze({ label: 'small', props: Object.freeze({ label: 'Progress', value: 60, size: 'sm' }) }),
  Object.freeze({ label: 'helper', props: Object.freeze({ label: 'Progress', value: 40, helperText: 'Uploading' }) }),
  Object.freeze({ label: 'indeterminate', props: Object.freeze({ label: 'Progress' }) }),
  Object.freeze({ label: 'finished', props: Object.freeze({ label: 'Progress', status: 'finished', helperText: 'Done' }) }),
  Object.freeze({ label: 'error', props: Object.freeze({ label: 'Progress', value: 40, status: 'error', helperText: 'Failed' }) })
]);
