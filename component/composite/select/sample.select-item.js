// Info: SelectItem sample states for the showcase, the browser gates and
// the docs: the rest, selected, disabled and truncating forms.

// An option row fills the width its container gives it, so the showcase,
// the walker and the browser gates lay its states out in a frame of this width
export const FRAME = Object.freeze({ width: 320 });

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ label: 'Option one', value: 'one' }) }),
  Object.freeze({ label: 'selected', props: Object.freeze({ label: 'Option one', value: 'one', selected: true }) }),
  Object.freeze({ label: 'disabled', props: Object.freeze({ label: 'Option one', value: 'one', disabled: true }) }),
  Object.freeze({ label: 'long', props: Object.freeze({ label: 'An option label long enough to truncate inside the frame', value: 'long' }) })
]);
