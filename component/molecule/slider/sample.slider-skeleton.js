// Info: SliderSkeleton sample states for the showcase, the browser gates
// and the docs: the default row, and the row without its label bar.

// The skeleton keeps the live row's nominal width, so the showcase, the
// walker and the browser gates lay its states out in a frame of this
// width
export const FRAME = Object.freeze({ width: 640 });

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({}) }),
  Object.freeze({ label: 'hideLabel', props: Object.freeze({ hideLabel: true }) })
]);
