// Info: NumberInputSkeleton sample states for the showcase, the browser
// gates and the docs: the default, the hidden label and the two other
// heights.

// A skeleton fills the width its container gives it, so the showcase, the
// walker and the browser gates lay its states out in a frame of this width
export const FRAME = Object.freeze({ width: 320 });

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({}) }),
  Object.freeze({ label: 'no label', props: Object.freeze({ hideLabel: true }) }),
  Object.freeze({ label: 'small', props: Object.freeze({ size: 'sm' }) }),
  Object.freeze({ label: 'large', props: Object.freeze({ size: 'lg' }) })
]);
