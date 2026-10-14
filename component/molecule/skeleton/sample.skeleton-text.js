// Info: SkeletonText sample states for the showcase, the browser gates and
// the docs: the single line, the heading line, the paragraph at the full
// width and at a point width.

// Lines fill the width their container gives them, so the showcase, the
// walker and the browser gates lay its states out in a frame of this width
export const FRAME = Object.freeze({ width: 320 });

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({}) }),
  Object.freeze({ label: 'heading', props: Object.freeze({ heading: true }) }),
  Object.freeze({ label: 'paragraph', props: Object.freeze({ paragraph: true }) }),
  Object.freeze({ label: 'paragraph points', props: Object.freeze({ paragraph: true, width: 200 }) })
]);
