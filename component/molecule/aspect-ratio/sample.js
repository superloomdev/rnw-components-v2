// Info: AspectRatio sample states for the showcase, the browser gates and
// the docs: one state per ratio, its box holding a text label naming it.

// A box fills the width its container gives it, so the showcase, the
// walker and the browser gates lay its states out in a frame of this width
export const FRAME = Object.freeze({ width: 320 });

export default Object.freeze([
  Object.freeze({ label: '16x9', props: Object.freeze({ ratio: '16x9', children: '16x9' }) }),
  Object.freeze({ label: '9x16', props: Object.freeze({ ratio: '9x16', children: '9x16' }) }),
  Object.freeze({ label: '2x1', props: Object.freeze({ ratio: '2x1', children: '2x1' }) }),
  Object.freeze({ label: '1x2', props: Object.freeze({ ratio: '1x2', children: '1x2' }) }),
  Object.freeze({ label: '4x3', props: Object.freeze({ ratio: '4x3', children: '4x3' }) }),
  Object.freeze({ label: '3x4', props: Object.freeze({ ratio: '3x4', children: '3x4' }) }),
  Object.freeze({ label: '3x2', props: Object.freeze({ ratio: '3x2', children: '3x2' }) }),
  Object.freeze({ label: '2x3', props: Object.freeze({ ratio: '2x3', children: '2x3' }) }),
  Object.freeze({ label: '1x1', props: Object.freeze({ ratio: '1x1', children: '1x1' }) })
]);
