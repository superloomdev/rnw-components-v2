// Info: Divider sample states for the showcase, the browser gates and the
// docs: the plain rule and each inset combination.

// A rule fills the width its container gives it, so the showcase, the
// walker and the browser gates lay its states out in a frame of this width
export const FRAME = Object.freeze({ width: 320 });

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({}) }),
  Object.freeze({ label: 'inset', props: Object.freeze({ inset: true }) }),
  Object.freeze({ label: 'inset start', props: Object.freeze({ insetStart: true }) }),
  Object.freeze({ label: 'inset end', props: Object.freeze({ insetEnd: true }) })
]);
