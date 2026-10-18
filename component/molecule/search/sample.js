// Info: Search sample states for the showcase, the browser gates and the
// docs: the states the references draw.

// A field fills the width its container gives it, so the showcase, the
// walker and the browser gates lay its states out in a frame of this width
export const FRAME = Object.freeze({ width: 320 });

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ label: 'Search' }) }),
  Object.freeze({ label: 'filled', props: Object.freeze({ label: 'Search', value: 'Query' }) }),
  Object.freeze({ label: 'disabled', props: Object.freeze({ label: 'Search', disabled: true }) }),
  Object.freeze({ label: 'disabled filled', props: Object.freeze({ label: 'Search', value: 'Query', disabled: true }) }),
  Object.freeze({ label: 'small', props: Object.freeze({ label: 'Search', value: 'Query', size: 'sm' }) }),
  Object.freeze({ label: 'large', props: Object.freeze({ label: 'Search', value: 'Query', size: 'lg' }) })
]);
